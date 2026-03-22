# init_cloud_structure.py
from pymongo import ASCENDING, DESCENDING
from app.db.mongo import mongo_client  # 用之前封装的云端连接

# 连接云端数据库（自动创建 ai_edu_admission 库，不存在则创建）
db = mongo_client.get_db("ai_edu_admission")

def init_tutors_collection():
    """初始化导师集合+索引（仅创建结构，不插入数据）"""
    # 1. 创建/获取 tutors 集合（不存在则自动创建）
    tutor_coll = db["tutors"]
    
    # 2. 删除旧索引（避免重复）
    existing_indexes = [idx["name"] for idx in tutor_coll.list_indexes()]
    for idx_name in existing_indexes:
        if idx_name not in ["_id_"]:  # 保留默认主键索引
            tutor_coll.drop_index(idx_name)
    
    # 3. 添加和本地一致的索引
    # 姓名+院校+专业联合索引
    tutor_coll.create_index(
        [("name", ASCENDING), ("school", ASCENDING), ("major", ASCENDING)],
        name="tutor_name_school_major_idx",
        unique=False
    )
    # 研究方向数组索引
    tutor_coll.create_index(
        [("research_direction", ASCENDING)],
        name="tutor_research_idx",
        unique=False
    )
    print("✅ 导师集合+索引创建完成")

def init_users_collection():
    """初始化用户集合+索引"""
    user_coll = db["users"]
    # 删除旧索引
    existing_indexes = [idx["name"] for idx in user_coll.list_indexes()]
    for idx_name in existing_indexes:
        if idx_name not in ["_id_"]:
            user_coll.drop_index(idx_name)
    # 添加用户索引：openid 唯一索引（微信小程序用户唯一标识）
    user_coll.create_index(
        [("openid", ASCENDING)],
        name="user_openid_idx",
        unique=True  # openid 必须唯一
    )
    print("✅ 用户集合+索引创建完成")

def init_orders_collection():
    """初始化订单集合+索引"""
    order_coll = db["orders"]
    # 删除旧索引
    existing_indexes = [idx["name"] for idx in order_coll.list_indexes()]
    for idx_name in existing_indexes:
        if idx_name not in ["_id_"]:
            order_coll.drop_index(idx_name)
    # 添加订单索引：用户ID+创建时间
    order_coll.create_index(
        [("user_id", ASCENDING), ("create_time", DESCENDING)],
        name="order_user_time_idx",
        unique=False
    )
    print("✅ 订单集合+索引创建完成")

if __name__ == "__main__":
    # 一键执行所有集合初始化
    init_tutors_collection()
    init_users_collection()
    init_orders_collection()
    print("\n🎉 云端数据库结构（集合+索引）全部创建完成！")