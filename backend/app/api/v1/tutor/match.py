"""
智能导师匹配接口
提供基于研究需求的导师推荐功能
"""

from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from pydantic import BaseModel

from app.utils import (
    success_response,
    error_response,
    api_logger
)
from app.db.mongo import get_db

router = APIRouter(
    prefix="/tutor",
    tags=["tutor", "match"]
)


class MatchRequest(BaseModel):
    """导师匹配请求模型"""
    subject: str  # 学科方向
    keywords: str  # 研究兴趣关键词
    prefer_cross_school: bool = False  # 优先跨校合作
    prefer_high_output: bool = False  # 优先高成果导师
    prefer_young: bool = False  # 优先青年学者


@router.post(
    "/match",
    summary="智能导师匹配",
    description="根据研究需求智能匹配最适合的导师"
)
async def match_tutors(
    request: Request,
    match_data: MatchRequest
):
    """
    智能导师匹配
    
    Args:
        match_data: 匹配条件
    
    Returns:
        推荐导师列表
    """
    try:
        db = get_db()
        
        # 构建查询条件
        query = {
            "$or": [
                {"is_deleted": {"$exists": False}},
                {"is_deleted": False}
            ]
        }
        
        # 关键词匹配
        keywords = match_data.keywords.split(",")
        keyword_conditions = []
        for kw in keywords:
            kw = kw.strip()
            if kw:
                keyword_conditions.append({
                    "$or": [
                        {"name": {"$regex": kw, "$options": "i"}},
                        {"direction": {"$regex": kw, "$options": "i"}},
                        {"tags": {"$in": [kw]}},
                        {"research_direction": {"$regex": kw, "$options": "i"}}
                    ]
                })
        
        if keyword_conditions:
            query["$and"] = query.get("$and", [])
            query["$and"].extend(keyword_conditions)
        
        # 学科方向匹配
        if match_data.subject:
            query["$and"] = query.get("$and", [])
            query["$and"].append({
                "$or": [
                    {"department": {"$regex": match_data.subject, "$options": "i"}},
                    {"direction": {"$regex": match_data.subject, "$options": "i"}},
                    {"tags": {"$in": [match_data.subject]}}
                ]
            })
        
        # 查询导师
        tutors_cursor = db.tutors.find(query).limit(20)
        tutors = await tutors_cursor.to_list(length=20)
        
        # 格式化结果
        matched_tutors = []
        for tutor in tutors:
            matched_tutors.append({
                "id": tutor.get("id"),
                "name": tutor.get("name", ""),
                "school": tutor.get("school", ""),
                "department": tutor.get("department", ""),
                "title": tutor.get("jobname") or tutor.get("title", ""),
                "avatar": tutor.get("avatar", ""),
                "direction": tutor.get("direction", ""),
                "tags": tutor.get("tags", [])[:3],
                "paper_count": len(tutor.get("coops", [])),
                "match_score": 85  # 匹配度评分
            })
        
        # 按匹配度排序（简单实现：论文数量多的排前面）
        matched_tutors.sort(key=lambda x: x["paper_count"], reverse=True)
        
        # 限制返回数量
        matched_tutors = matched_tutors[:10]
        
        api_logger.info(
            f"导师匹配成功 | "
            f"学科: {match_data.subject}, "
            f"关键词: {match_data.keywords}, "
            f"结果: {len(matched_tutors)} 位导师"
        )
        
        return success_response(
            data={
                "list": matched_tutors,
                "total": len(matched_tutors),
                "match_params": {
                    "subject": match_data.subject,
                    "keywords": match_data.keywords,
                    "prefer_cross_school": match_data.prefer_cross_school,
                    "prefer_high_output": match_data.prefer_high_output,
                    "prefer_young": match_data.prefer_young
                }
            },
            message=f"为您找到 {len(matched_tutors)} 位匹配导师"
        )
        
    except Exception as e:
        api_logger.error(f"导师匹配失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"匹配失败: {str(e)}")
        )
