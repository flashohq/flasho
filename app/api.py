from json import load
import os

from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel
from dotenv import load_dotenv

from .routes import v1
from .utils import config

api_key_header = APIKeyHeader(name="x-admin-secret-key", auto_error=False)

app = FastAPI(docs_url='/api/docs', openapi_url='/api/openapi.json')


async def authorize_request(api_key_header: str = Security(api_key_header)):
    load_dotenv()
    if "ADMIN_SECRET_KEY" in os.environ:
        if api_key_header == os.environ["ADMIN_SECRET_KEY"]:
            return api_key_header
        elif api_key_header == None:
            raise HTTPException(
                status_code=401, detail="authorization header missing"
            )
        else:
            raise HTTPException(
                status_code=401, detail="incorrect authorization credentials"
            )
    else:
        raise HTTPException(
            status_code=403, detail="please create an admin secret key"
        )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(v1.router, prefix='/api/v1',
                   dependencies=[Depends(authorize_request)])


class AddAdminSecretKey(BaseModel):
    new_key: str


@app.post("/api/create_admin_secret")
def create_admin_secret_key(admin_secret_key: AddAdminSecretKey):
    load_dotenv()
    if "ADMIN_SECRET_KEY" in os.environ:
        return {
            "status": "failed",
            "message": "key already exists"
        }
    else:
        config.set_env_variable("ADMIN_SECRET_KEY", admin_secret_key.new_key)
        return {
            "status": "success",
            "message": "new key created"
        }


@app.get("/api/health")
def health_check():
    return "health check OK"
