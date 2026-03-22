"""
合作项目统计接口
提供社工模型所需的合作数据统计
"""

from fastapi import APIRouter, HTTPException, Request
from typing import List, Dict
from collections import Counter

from app.utils import (
    success_response,
    error_response,
    api_logger
)
from app.db.mongo import get_db

router = APIRouter(
    prefix="/coop",
    tags=["coop", "stats"]
)


@router.get(
    "/stats/overview",
    summary="合作数据概览",
    description="获取社工模型首页的合作数据统计"
)
async def get_coop_overview(
    request: Request
):
    """
    获取合作数据概览
    
    Returns:
        活跃合作领域TOP3、潜在合作项目数量等
    """
    try:
        db = get_db()
        
        # 获取所有合作项目
        coops_cursor = db.coops.find({}).limit(500)
        coops = await coops_cursor.to_list(length=500)
        
        # 统计活跃合作领域
        all_tags = []
        for coop in coops:
            tags = coop.get("tags", [])
            if isinstance(tags, list):
                all_tags.extend(tags)
        
        # 统计标签频次
        tag_counter = Counter(all_tags)
        top_fields = [
            {"name": tag, "count": count}
            for tag, count in tag_counter.most_common(3)
        ]
        
        # 补充默认字段
        if len(top_fields) < 3:
            defaults = ["人工智能", "大数据", "物联网"]
            for i in range(3 - len(top_fields)):
                top_fields.append({"name": defaults[i], "count": 0})
        
        # 潜在合作项目数
        potential_count = len(coops)
        
        api_logger.info(
            f"获取合作数据概览成功 | "
            f"项目数: {potential_count}, "
            f"活跃领域: {[f['name'] for f in top_fields]}"
        )
        
        return success_response(
            data={
                "activeFields": top_fields,
                "potentialProjectCount": potential_count,
                "totalCoops": len(coops)
            },
            message="获取合作数据概览成功"
        )
        
    except Exception as e:
        api_logger.error(f"获取合作数据概览失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"获取失败: {str(e)}")
        )


@router.get(
    "/recommendations",
    summary="推荐合作项目",
    description="获取为用户推荐的合作项目列表"
)
async def get_coop_recommendations(
    request: Request,
    limit: int = 10
):
    """
    获取推荐合作项目
    
    Args:
        limit: 返回数量限制
    
    Returns:
        推荐项目列表
    """
    try:
        db = get_db()
        
        # 获取合作项目（按创建时间排序）
        coops_cursor = db.coops.find({}).sort("created_at", -1).limit(limit)
        coops = await coops_cursor.to_list(length=limit)
        
        recommendations = []
        for coop in coops:
            # 处理成员信息
            members = []
            for member in coop.get("members", [])[:4]:
                if isinstance(member, dict):
                    name = member.get("name", "")
                    school = member.get("school", "")
                    if name:
                        members.append({
                            "name": name,
                            "school": school,
                            "initial": name[0] if name else ""
                        })
            
            # 处理标签
            tags = coop.get("tags", [])
            if not tags and coop.get("type_cn"):
                tags = [coop.get("type_cn")]
            
            # 处理成果
            outputs = coop.get("outputs", [])
            achievement = outputs[0] if isinstance(outputs, list) and outputs else ""
            
            recommendations.append({
                "id": str(coop.get("_id")),
                "title": coop.get("title_cn") or coop.get("title", "合作项目"),
                "tags": tags[:2],
                "description": coop.get("description", coop.get("core_area", "")),
                "achievement": achievement,
                "members": members
            })
        
        api_logger.info(f"获取推荐合作项目成功: {len(recommendations)} 个")
        
        return success_response(
            data={
                "list": recommendations,
                "total": len(recommendations)
            },
            message="获取推荐项目成功"
        )
        
    except Exception as e:
        api_logger.error(f"获取推荐项目失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=error_response(message=f"获取失败: {str(e)}")
        )
