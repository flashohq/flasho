from fastapi import APIRouter

from .modules.settings import router as settings_router
from .modules.triggers import router as triggers_router
from .modules.email import router as email_router
from .modules.sms import router as sms_router
from .modules.manual_events import router as manual_event
router = APIRouter()

router.include_router(settings_router, prefix='/settings', tags=['settings'])
router.include_router(triggers_router, prefix='/triggers', tags=['triggers'])
router.include_router(email_router, prefix="/email", tags=["Email"])
router.include_router(sms_router, prefix="/sms", tags=["SMS"])
router.include_router(manual_event , prefix="/manual_event" , tags=["Manual_event"])