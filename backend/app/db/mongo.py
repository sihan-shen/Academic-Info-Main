# backend/app/db/mongo.py
import time
from typing import Any, Dict, List, Optional, Union
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, PyMongoError
from app.core.config.database import database_settings
from app.utils.logger import app_logger as logger


class MongoDBClient:
    """MongoDB异步客户端（单例模式）
    
    核心功能：
    1. 管理MongoDB异步连接池
    2. 提供数据库实例访问
    3. 连接健康检查和自动重连
    
    使用示例：
        # 获取数据库实例
        db = get_db()
        
        # 直接访问集合
        tutors = db.tutors
        result = await tutors.find_one({"id": "xxx"})
    """
    
    _instance: Optional['MongoDBClient'] = None
    _client: Optional[AsyncIOMotorClient] = None
    _db: Optional[AsyncIOMotorDatabase] = None
    _initialized: bool = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def _ensure_initialized(self):
        """确保客户端已初始化"""
        if not self._initialized:
            self._init_client()
    
    def _init_client(self):
        """初始化MongoDB客户端连接"""
        try:
            self._client = AsyncIOMotorClient(
                database_settings.MONGO_URI,
                maxPoolSize=50,
                minPoolSize=10,
                serverSelectionTimeoutMS=5000,
                retryWrites=True
            )
            self._db = self._client[database_settings.DB_NAME]
            self._initialized = True
            logger.info(f"MongoDB异步客户端初始化成功 | 数据库: {database_settings.DB_NAME}")
        except Exception as e:
            logger.error(f"MongoDB客户端初始化失败: {e}")
            raise
    
    async def check_connection(self) -> bool:
        """检查MongoDB连接是否健康"""
        try:
            if self._client is None:
                return False
            await self._client.admin.command('ping')
            return True
        except Exception as e:
            logger.warning(f"MongoDB连接检查失败: {e}")
            return False
    
    async def reconnect(self) -> bool:
        """尝试重新连接MongoDB"""
        try:
            logger.info("正在尝试重新连接MongoDB...")
            self._init_client()
            # 测试连接
            await self._client.admin.command('ping')
            logger.success("MongoDB重新连接成功")
            return True
        except Exception as e:
            logger.error(f"MongoDB重新连接失败: {e}")
            return False
    
    def get_db(self) -> AsyncIOMotorDatabase:
        """获取数据库实例
        
        Returns:
            AsyncIOMotorDatabase: 异步数据库实例
        """
        self._ensure_initialized()
        if self._db is None:
            raise ConnectionFailure("MongoDB未连接")
        return self._db
    
    def get_collection(self, collection_name: str):
        """获取指定集合
        
        Args:
            collection_name: 集合名称
            
        Returns:
            Collection: 异步集合实例
        """
        return self.get_db()[collection_name]
    
    async def close(self):
        """关闭MongoDB连接"""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            self._initialized = False
            logger.info("MongoDB连接已关闭")


# 全局单例实例
_mongo_client_instance = MongoDBClient()


def get_db() -> AsyncIOMotorDatabase:
    """获取数据库实例（函数接口，供外部调用）
    
    Returns:
        AsyncIOMotorDatabase: 异步数据库实例
        
    示例：
        db = get_db()
        result = await db.tutors.find_one({"id": "xxx"})
    """
    return _mongo_client_instance.get_db()


def get_collection(collection_name: str):
    """获取指定集合（快捷函数）
    
    Args:
        collection_name: 集合名称
        
    Returns:
        Collection: 异步集合实例
    """
    return _mongo_client_instance.get_collection(collection_name)


async def check_mongo_connection() -> bool:
    """检查MongoDB连接健康状态"""
    return await _mongo_client_instance.check_connection()


async def reconnect_mongo() -> bool:
    """重新连接MongoDB"""
    return await _mongo_client_instance.reconnect()


async def close_mongo_connection():
    """关闭MongoDB连接（应用关闭时调用）"""
    await _mongo_client_instance.close()


# 快捷方法：常用集合
def get_tutors_collection():
    """获取导师集合"""
    return get_collection("tutors")


def get_users_collection():
    """获取用户集合"""
    return get_collection("users")


def get_teachers_collection():
    """获取教师集合"""
    return get_collection("teachers")


def get_favorites_collection():
    """获取收藏集合"""
    return get_collection("favorites")


# ---------------------------------------------------------
# 通用 CRUD 操作封装
# ---------------------------------------------------------

async def find_one(collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    通用查询单条记录
    
    Args:
        collection_name: 集合名称
        query: 查询条件
    
    Returns:
        Optional[Dict]: 查询结果或None
    """
    try:
        coll = get_collection(collection_name)
        return await coll.find_one(query)
    except PyMongoError as e:
        logger.error(f"查询失败 ({collection_name}): {str(e)}")
        raise


async def find_many(
    collection_name: str,
    query: Dict[str, Any] = None,
    skip: int = 0,
    limit: int = 20,
    sort: List[tuple] = None
) -> List[Dict[str, Any]]:
    """
    通用查询多条记录（支持分页和排序）
    
    Args:
        collection_name: 集合名称
        query: 查询条件
        skip: 跳过数量
        limit: 返回数量限制
        sort: 排序规则
    
    Returns:
        List[Dict]: 查询结果列表
    """
    if query is None:
        query = {}
    
    try:
        coll = get_collection(collection_name)
        cursor = coll.find(query).skip(skip).limit(limit)
        
        if sort:
            cursor = cursor.sort(sort)
            
        return await cursor.to_list(length=limit)
    except PyMongoError as e:
        logger.error(f"批量查询失败 ({collection_name}): {str(e)}")
        raise


async def insert_one(collection_name: str, document: Dict[str, Any]) -> str:
    """
    通用插入单条记录
    
    Args:
        collection_name: 集合名称
        document: 要插入的文档
    
    Returns:
        str: 插入文档的ID
    """
    try:
        coll = get_collection(collection_name)
        result = await coll.insert_one(document)
        return str(result.inserted_id)
    except PyMongoError as e:
        logger.error(f"插入失败 ({collection_name}): {str(e)}")
        raise


async def update_one(
    collection_name: str,
    query: Dict[str, Any],
    update_data: Dict[str, Any],
    upsert: bool = False
) -> bool:
    """
    通用更新单条记录
    
    Args:
        collection_name: 集合名称
        query: 查询条件
        update_data: 更新数据
        upsert: 不存在时是否插入
    
    Returns:
        bool: 是否更新成功
    """
    try:
        coll = get_collection(collection_name)
        # 自动处理 $set 操作符
        if not any(k.startswith('$') for k in update_data.keys()):
            update_data = {"$set": update_data}
            
        result = await coll.update_one(query, update_data, upsert=upsert)
        return result.modified_count > 0 or result.upserted_id is not None
    except PyMongoError as e:
        logger.error(f"更新失败 ({collection_name}): {str(e)}")
        raise


async def delete_one(collection_name: str, query: Dict[str, Any]) -> bool:
    """
    通用删除单条记录
    
    Args:
        collection_name: 集合名称
        query: 删除条件
    
    Returns:
        bool: 是否删除成功
    """
    try:
        coll = get_collection(collection_name)
        result = await coll.delete_one(query)
        return result.deleted_count > 0
    except PyMongoError as e:
        logger.error(f"删除失败 ({collection_name}): {str(e)}")
        raise
