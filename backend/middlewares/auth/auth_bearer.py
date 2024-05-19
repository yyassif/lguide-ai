from typing import Optional

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from middlewares.auth.jwt_token_handler import decode_access_token, verify_token


class AuthBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__( # type: ignore
        self,
        request: Request,
    ):
        credentials: Optional[HTTPAuthorizationCredentials] = await super().__call__(
            request
        )
        self.check_scheme(credentials)
        token = credentials.credentials  # pyright: ignore reportPrivateUsage=none
        return await self.authenticate(
            token,
        )

    def check_scheme(self, credentials):
        if credentials and credentials.scheme != "Bearer":
            raise HTTPException(status_code=401, detail="Token must be Bearer")
        elif not credentials:
            raise HTTPException(
                status_code=403, detail="Authentication credentials missing"
            )

    async def authenticate(
        self,
        token: str,
    ):
        if verify_token(token):
            return decode_access_token(token)
        else:
            raise HTTPException(status_code=401, detail="Invalid token or api key.")


def get_current_user(user = Depends(AuthBearer())):
    return user
