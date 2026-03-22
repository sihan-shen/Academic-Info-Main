"""
用户收藏接口
提供导师和合作项目的收藏功能
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, List
from datetime import datetime

from app.models import User
from app.api.v1.auth.login import get_current_user
from app.utils import (
    success_response,
    error_response,
    api_logger
)
from app.db.mongo import get_db

router = APIRouter(
    prefix="/user",
    tags=["user", "favorite"]
)


@router.post(
    "/favorite/tutor/{tutor_id}",
    summary="收藏/取消收藏导师",
    description="切换导师的收藏状态，已收藏则取消，未收藏则添加"
)
async def toggle_favorite_tutor(
    request: Request,
    tutor_id: str,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    切换导师收藏状态
    
    Args:
        request: 请求对象
        tutor_id: 导师ID
        current_user: 当前登录用户
    
    Returns:
        收藏操作结果
    """
    try:
        db = get_db()
        
        # 检查用户是否登录
        if not current_user:
            raise HTTPException(
                status_code=401,
                detail=error_response(message="请先登录")
            )
        
        user_id = current_user.id
        
        # 检查导师是否存在
        tutor = await db.tutors.find_one({"id": tutor_id})
        if not tutor:
            raise HTTPException(
                status_code=404,
                detail=error_response(message="导师不存在")
            )
        
        # 检查是否已收藏
        existing = await db.favorites.find_one({
            "user_id": user_id,
            "target_type": "tutor",
            "target_id": tutor_id
        })
        
        if existing:
            # 已收藏，取消收藏
            await db.favorites.delete_one({
                "user_id": user_id,
                "target_type": "tutor",
                "target_id": tutor_id
            })
            action = "uncollected"
            message = "已取消收藏"
        else:
            # 未收藏，添加收藏
            favorite_data = {
                "user_id": user_id,
                "target_type": "tutor",
                "target_id": tutor_id,
                "tutor_name": tutor.get("name", ""),
                "tutor_school": tutor.get("school", ""),
                "tutor_department": tutor.get("department", ""),
                "tutor_avatar": tutor.get("avatar", ""),
                "tutor_direction": tutor.get("direction", ""),
                "created_at": datetime.now()
            }
            await db.favorites.insert_one(favorite_data)
            action = "collected"
            message = "收藏成功"
        
        api_logger.info(
            f"用户 {user_id} {message}: 导师 {tutor_id}"
        )
        
        return success_response(
            data={
                "action": action,
                "tutor_id": tutor_id,
                "message": message
            },
            message=message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        api_logger.error(f"收藏导师失败: {str(e)}, tutor_id={tutor_id}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"操作失败: {str(e)}")
        )


@router.post(
    "/favorite/coop/{coop_id}",
    summary="收藏/取消收藏合作项目",
    description="切换合作项目的收藏状态"
)
async def toggle_favorite_coop(
    request: Request,
    coop_id: str,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    切换合作项目收藏状态
    """
    try:
        db = get_db()
        
        if not current_user:
            raise HTTPException(
                status_code=401,
                detail=error_response(message="请先登录")
            )
        
        user_id = current_user.id
        
        # 检查项目是否存在
        from bson.objectid import ObjectId
        coop = await db.coops.find_one({"_id": ObjectId(coop_id)})
        if not coop:
            raise HTTPException(
                status_code=404,
                detail=error_response(message="项目不存在")
            )
        
        # 检查是否已收藏
        existing = await db.favorites.find_one({
            "user_id": user_id,
            "target_type": "coop",
            "target_id": coop_id
        })
        
        if existing:
            # 取消收藏
            await db.favorites.delete_one({
                "user_id": user_id,
                "target_type": "coop",
                "target_id": coop_id
            })
            action = "uncollected"
            message = "已取消收藏"
        else:
            # 添加收藏
            favorite_data = {
                "user_id": user_id,
                "target_type": "coop",
                "target_id": coop_id,
                "coop_title": coop.get("title_cn") or coop.get("title", ""),
                "coop_type": coop.get("type", ""),
                "coop_tags": coop.get("tags", []),
                "created_at": datetime.now()
            }
            await db.favorites.insert_one(favorite_data)
            action = "collected"
            message = "收藏成功"
        
        api_logger.info(
            f"用户 {user_id} {message}: 项目 {coop_id}"
        )
        
        return success_response(
            data={
                "action": action,
                "coop_id": coop_id,
                "message": message
            },
            message=message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        api_logger.error(f"收藏项目失败: {str(e)}, coop_id={coop_id}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"操作失败: {str(e)}")
        )


@router.get(
    "/favorites",
    summary="获取用户收藏列表",
    description="获取当前用户收藏的导师和项目列表"
)
async def get_user_favorites(
    request: Request,
    target_type: Optional[str] = None,  # tutor 或 coop
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    获取用户收藏列表
    
    Args:
        target_type: 筛选类型，tutor=导师，coop=项目，不传则返回全部
    """
    try:
        db = get_db()
        
        if not current_user:
            raise HTTPException(
                status_code=401,
                detail=error_response(message="请先登录")
            )
        
        user_id = current_user.id
        
        # 构建查询条件
        query = {"user_id": user_id}
        if target_type:
            query["target_type"] = target_type
        
        # 获取收藏列表
        favorites_cursor = db.favorites.find(query).sort("created_at", -1)
        favorites = await favorites_cursor.to_list(length=1000)
        
        tutor_list = []
        coop_list = []
        
        for fav in favorites:
            if fav.get("target_type") == "tutor":
                tutor_list.append({
                    "id": fav.get("target_id"),
                    "name": fav.get("tutor_name", ""),
                    "school": fav.get("tutor_school", ""),
                    "department": fav.get("tutor_department", ""),
                    "avatar": fav.get("tutor_avatar", ""),
                    "direction": fav.get("tutor_direction", ""),
                    "date": fav.get("created_at", datetime.now()).isoformat() if isinstance(fav.get("created_at"), datetime) else str(fav.get("created_at", ""))
                })
            elif fav.get("target_type") == "coop":
                coop_list.append({
                    "id": fav.get("target_id"),
                    "title": fav.get("coop_title", ""),
                    "type": fav.get("coop_type", ""),
                    "tags": fav.get("coop_tags", []),
                    "date": fav.get("created_at", datetime.now()).isoformat() if isinstance(fav.get("created_at"), datetime) else str(fav.get("created_at", ""))
                })
        
        api_logger.info(
            f"获取用户 {user_id} 收藏列表: 导师 {len(tutor_list)} 个, 项目 {len(coop_list)} 个"
        )
        
        return success_response(
            data={
                "tutors": tutor_list,
                "coops": coop_list,
                "total": len(tutor_list) + len(coop_list)
            },
            message="获取收藏列表成功"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        api_logger.error(f"获取收藏列表失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"获取失败: {str(e)}")
        )


@router.get(
    "/favorite/status",
    summary="批量查询收藏状态",
    description="查询多个导师或项目的收藏状态"
)
async def check_favorite_status(
    request: Request,
    target_type: str,  # tutor 或 coop
    target_ids: str,   # 逗号分隔的ID列表
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    批量查询收藏状态
    """
    try:
        db = get_db()
        
        if not current_user:
            return success_response(
                data={},
                message="未登录"
            )
        
        user_id = current_user.id
        ids = [id.strip() for id in target_ids.split(",") if id.strip()]
        
        # 查询收藏状态
        favorites_cursor = db.favorites.find({
            "user_id": user_id,
            "target_type": target_type,
            "target_id": {"$in": ids}
        })
        favorites = await favorites_cursor.to_list(length=len(ids))
        
        # 构建结果字典
        result = {}
        for tid in ids:
            result[tid] = False
        for fav in favorites:
            result[fav.get("target_id")] = True
        
        return success_response(
            data=result,
            message="查询成功"
        )
        
    except Exception as e:
        api_logger.error(f"查询收藏状态失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"查询失败: {str(e)}")
        )
