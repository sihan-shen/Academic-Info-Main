"""
合作项目列表接口
提供合作项目的查询和筛选功能
"""

from fastapi import APIRouter, HTTPException, Request, Query
from typing import List, Optional
from datetime import datetime

from app.utils import (
    success_response,
    error_response,
    api_logger
)
from app.db.mongo import get_db

router = APIRouter(
    prefix="/coop",
    tags=["coop"]
)


@router.get(
    "/list",
    summary="合作项目列表",
    description="获取合作项目列表，支持分页和筛选",
)
async def get_coop_list(
    request: Request,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    type: Optional[str] = Query(None, description="类型筛选")
):
    """
    合作项目列表接口
    
    Args:
        request: 请求对象
        page: 页码
        page_size: 每页数量
        keyword: 搜索关键词
        type: 类型筛选
    
    Returns:
        合作项目列表
    """
    try:
        db = get_db()
        coops_coll = db.coops

        # 构建查询条件
        query = {}
        
        if keyword:
            query["$or"] = [
                {"title": {"$regex": keyword, "$options": "i"}},
                {"title_cn": {"$regex": keyword, "$options": "i"}},
                {"description": {"$regex": keyword, "$options": "i"}},
                {"tags": {"$in": [keyword]}}
            ]
        
        if type and type != 'all':
            query["type"] = type
        
        # 计算分页
        skip = (page - 1) * page_size
        
        # 获取总数
        total = await coops_coll.count_documents(query)

        # 获取数据
        cursor = coops_coll.find(query).sort("created_at", -1).skip(skip).limit(page_size)
        coops = await cursor.to_list(length=page_size)
        
        # 转换为响应格式
        coop_list = []
        for coop in coops:
            # 处理成员信息
            members = []
            raw_members = coop.get("members", [])
            # 确保 members 是列表
            if isinstance(raw_members, dict):
                raw_members = [raw_members]
            elif not isinstance(raw_members, list):
                raw_members = []
            
            for member in raw_members:
                if isinstance(member, dict):
                    name = member.get("name", "")
                    school = member.get("school", "")
                    if name:  # 只添加有名字的成员
                        members.append({
                            "name": name,
                            "school": school,
                            "initial": name[0] if name else ""
                        })
            
            # 处理标签
            tags = coop.get("tags", [])
            if not tags and coop.get("type_cn"):
                tags = [coop.get("type_cn")]
            
            # 处理成果描述
            achievement = ""
            if coop.get("outputs"):
                outputs = coop.get("outputs")
                if isinstance(outputs, list) and len(outputs) > 0:
                    achievement = outputs[0]
                elif isinstance(outputs, str):
                    achievement = outputs
            
            coop_item = {
                "id": str(coop.get("_id")),
                "title": coop.get("title_cn") or coop.get("title", "合作项目"),
                "tags": tags[:3],  # 最多取3个标签
                "type": coop.get("type", "other"),
                "desc": coop.get("description", coop.get("core_area", "")),
                "achievement": achievement,
                "members": members[:4],  # 最多取4个成员
                "created_at": coop.get("created_at", datetime.now()).isoformat() if isinstance(coop.get("created_at"), datetime) else str(coop.get("created_at", ""))
            }
            coop_list.append(coop_item)
        
        api_logger.info(
            f"获取合作项目列表成功 | "
            f"条件: keyword={keyword}, type={type}, "
            f"分页: page={page}, page_size={page_size}, "
            f"结果: {len(coop_list)}/{total}"
        )
        
        return success_response(
            data={
                "list": coop_list,
                "total": total,
                "page": page,
                "page_size": page_size
            },
            message="获取合作项目列表成功"
        )
        
    except Exception as e:
        api_logger.error(f"获取合作项目列表失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(
                message=f"获取合作项目列表失败: {str(e)}"
            )
        )


@router.get(
    "/detail/{coop_id}",
    summary="合作项目详情",
    description="获取合作项目详细信息",
)
async def get_coop_detail(
    request: Request,
    coop_id: str
):
    """
    合作项目详情接口
    
    Args:
        request: 请求对象
        coop_id: 合作项目ID
    
    Returns:
        合作项目详细信息
    """
    try:
        db = get_db()
        
        from bson.objectid import ObjectId
        
        # 获取合作项目信息
        coop = await db.coops.find_one({"_id": ObjectId(coop_id)})
        
        if not coop:
            raise HTTPException(
                status_code=404,
                detail=error_response(
                    message="合作项目不存在"
                )
            )
        
        # 处理成员信息
        members = []
        for member in coop.get("members", []):
            if isinstance(member, dict):
                members.append({
                    "name": member.get("name", ""),
                    "school": member.get("school", ""),
                    "department": member.get("department", ""),
                    "title": member.get("jobname", "")
                })
        
        detail_data = {
            "id": str(coop.get("_id")),
            "title": coop.get("title_cn") or coop.get("title", "合作项目"),
            "type": coop.get("type", "other"),
            "type_cn": coop.get("type_cn", ""),
            "tags": coop.get("tags", []),
            "description": coop.get("description", ""),
            "core_area": coop.get("core_area", ""),
            "members": members,
            "outputs": coop.get("outputs", []),
            "created_at": coop.get("created_at", datetime.now()).isoformat() if isinstance(coop.get("created_at"), datetime) else str(coop.get("created_at", ""))
        }
        
        api_logger.info(f"获取合作项目详情成功: {coop_id}")
        
        return success_response(
            data=detail_data,
            message="获取合作项目详情成功"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        api_logger.error(f"获取合作项目详情失败: {str(e)}, coop_id={coop_id}")
        raise HTTPException(
            status_code=500,
            detail=error_response(
                message=f"获取合作项目详情失败: {str(e)}"
            )
        )
