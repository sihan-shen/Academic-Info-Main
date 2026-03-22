"""
导师统计接口
提供数据库中导师和合作项目的总数统计
"""

from fastapi import APIRouter, HTTPException, Request
from app.utils import (
    success_response,
    error_response,
    api_logger
)
from app.db.mongo import get_db

router = APIRouter(
    prefix="/tutor",
    tags=["tutor", "stats"]
)


@router.get(
    "/stats",
    summary="获取导师统计数据",
    description="获取数据库中导师总数和合作项目总数"
)
async def get_tutor_stats(
    request: Request
):
    """
    获取导师统计数据
    
    Returns:
        包含导师总数和合作项目总数的统计信息
    """
    try:
        db = get_db()
        
        # 获取导师总数（排除已删除的）
        tutor_query = {
            "$or": [
                {"is_deleted": {"$exists": False}},
                {"is_deleted": False}
            ]
        }
        total_tutors = await db.tutors.count_documents(tutor_query)
        
        # 获取合作项目总数
        total_coops = await db.coops.count_documents({})
        
        # 获取今日新增导师数
        from datetime import datetime, timedelta
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_query = {
            **tutor_query,
            "created_at": {"$gte": today}
        }
        today_tutors = await db.tutors.count_documents(today_query)
        
        api_logger.info(
            f"获取导师统计成功 | "
            f"导师总数: {total_tutors}, "
            f"合作项目: {total_coops}, "
            f"今日新增: {today_tutors}"
        )
        
        return success_response(
            data={
                "total_tutors": total_tutors,
                "total_coops": total_coops,
                "today_new_tutors": today_tutors
            },
            message="获取统计数据成功"
        )
        
    except Exception as e:
        api_logger.error(f"获取导师统计失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(
                message=f"获取统计数据失败: {str(e)}"
            )
        )
