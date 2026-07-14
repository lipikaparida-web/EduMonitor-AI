from pydantic import BaseModel, EmailStr


class Admin(BaseModel):

    name: str

    email: EmailStr

    password: str