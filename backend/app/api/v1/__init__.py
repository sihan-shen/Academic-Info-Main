"""
API v1 版本模块
注册所有v1版本的API路由
"""

from fastapi import APIRouter
from app.api.v1.auth.login import router as auth_router
# from app.api.v1.user.profile import router as user_profile_router
from app.api.v1.user.favorite import router as user_favorite_router
from app.api.v1.tutor.list import router as tutor_router
from app.api.v1.tutor.manage import router as tutor_manage_router
from app.api.v1.tutor.search import router as tutor_search_router
from app.api.v1.tutor.export import router as tutor_export_router
from app.api.v1.tutor.network import router as tutor_network_router
from app.api.v1.tutor.stats import router as tutor_stats_router
from app.api.v1.tutor.match import router as tutor_match_router
from app.api.v1.coop.list import router as coop_router
from app.api.v1.coop.stats import router as coop_stats_router
from app.api.v1.interaction.book import router as booking_router
from app.api.v1.match.submit import router as match_router
from app.api.v1.project.list import router as project_router

# 创建v1版本的主路由
v1_router = APIRouter(
    prefix="/v1"
)

# 注册各个模块的路由
v1_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
# v1_router.include_router(user_profile_router, prefix="/user", tags=["user"])
v1_router.include_router(user_favorite_router, prefix="/user", tags=["user", "favorite"])
v1_router.include_router(tutor_router, tags=["tutor"])
v1_router.include_router(tutor_network_router, tags=["tutor", "network"])
v1_router.include_router(tutor_search_router, tags=["tutor", "search"])
v1_router.include_router(tutor_manage_router, tags=["tutor", "admin"])
v1_router.include_router(tutor_export_router, tags=["tutor", "export", "admin"])
v1_router.include_router(tutor_stats_router, tags=["tutor", "stats"])
v1_router.include_router(tutor_match_router, tags=["tutor", "match"])
v1_router.include_router(coop_router, tags=["coop"])
v1_router.include_router(coop_stats_router, tags=["coop", "stats"])
v1_router.include_router(booking_router, prefix="/service", tags=["service"])
v1_router.include_router(match_router, prefix="/match", tags=["match"])
v1_router.include_router(project_router, prefix="/project", tags=["project"])

__all__ = ["v1_router"]
