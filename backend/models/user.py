from pydantic import BaseModel
from fastapi import Request
import boto3
import os
from xonext.thread import QThread
from xonext.lang.chat.component import QComponent
from typing import Optional
import requests
from fastapi import HTTPException

CLIENT_ID = os.environ.get("BOTO3_CLIENT_ID")
# CLIENT_HASH= os.environ.get("BOTO3_CLIENT_SECRET_HASH")
USER_POOL_ID = os.environ.get("COGNITO_USER_POOL_ID")
DYNAMO_USER_TABLE_NAME = os.environ.get("DYNAMO_USER_TABLE_NAME")
COGNITO_BASE_URL = os.environ.get("COGNITO_BASE_URL")


class User(BaseModel):
    name: str
    email: str
    password: str
    phone_number: Optional[str] = "none"
    profile_img_url: Optional[str] = "none"
    user_plan: Optional[str] = "free"
    authorizer: Optional[str] = "cognito"
    sub: Optional[str] = "none"
    client_id: str = CLIENT_ID

    def signup(self, client):
        try:
            res = client.sign_up(
                ClientId=self.client_id,
                # SecretHash = CLIENT_HASH,
                Username=self.email,
                Password=self.password,
                UserAttributes=[
                    {
                        "Name": "name",
                        "Value": self.name
                    },
                    {
                        "Name": "custom:ProfileImageUrl",
                        "Value": self.profile_img_url if self.profile_img_url else ""
                    },
                    {
                        "Name": "custom:userPlan",
                        "Value": self.user_plan if self.user_plan else "free"
                    },
                    {
                        "Name": "custom:authorizer",
                        "Value": self.authorizer
                    }
                ]
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def confirm_signup(client, email, confirm_code):
        try:
            res = client.confirm_sign_up(
                ClientId=CLIENT_ID,
                Username=email,
                ConfirmationCode=confirm_code
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def login(client,
              email,
              password):
        try:
            res = client.initiate_auth(
                ClientId=CLIENT_ID,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": email,
                    "PASSWORD": password
                }
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            res = e
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def custom_token_exchange(code, redirect_uri):
        try:
            token_exchange_url = COGNITO_BASE_URL+"/oauth2/token"
            token_request_params = {
                "grant_type": "authorization_code",
                "client_id": CLIENT_ID,
                "code": code,
                "redirect_uri": redirect_uri
            }

            try:
                response = requests.post(
                    token_exchange_url,
                    data=token_request_params
                )
                res = response.json()
                try:
                    error = response["data"]["error"]
                    response = {
                        "type": "success",
                        "data": error 
                    }
                except:
                    response = {
                        "type": "success",
                        "data": res
                    }

            except requests.exceptions.RequestException as e:
                raise HTTPException(
                    status_code=500,
                    details="Token exchange failed"
                )

        except Exception as e:
            res = e
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def forgot_password(client,
                        email,
                        ):
        try:
            res = client.forgot_password(
                ClientId=CLIENT_ID,
                Username=email
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            res = e
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def confirm_forgot_password(client,
                                email,
                                confirm_code,
                                new_password
                                ):
        try:
            res = client.confirm_forgot_password(
                ClientId=CLIENT_ID,
                Username=email,
                ConfirmationCode=confirm_code,
                Password=new_password
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            res = e
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def get_user(client,
                 access_token
                 ):
        try:
            res = client.get_user(
                AccessToken=access_token
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            res = e
            response = {
                "type": "fail",
                "data": e
            }
        return {"response": response}

    @staticmethod
    def get_refresh_token_from_cookie(request: Request):
        # print("request", request)
        cookie = request.cookies
        # print("cookies",cookie)
        refresh_token = cookie.get("refreshToken")
        # print("token",refresh_token)
        return refresh_token

    @staticmethod
    def generate_access_token(request: Request,
                              client,
                              ):
        refresh_token = User.get_refresh_token_from_cookie(request)
        if refresh_token:
            try:
                res = client.initiate_auth(
                    ClientId=CLIENT_ID,
                    AuthFlow="REFRESH_TOKEN_AUTH",
                    AuthParameters={
                        "REFRESH_TOKEN": refresh_token
                    }
                )
                response = {
                    "type": "success",
                    "data": res
                }
            except Exception as e:
                res = e
                response = {
                    "type": "fail",
                    "data": e
                }
        else:
            response = {
                "type": "NoRefreshToken",
                "data": None
            }
        return {"response": response}

    @staticmethod
    def init_thread(client: any,
                    user_id: str,
                    table_name: str,
                    uid: Optional[str] = None):
        thread = QThread(
            user=user_id, uid=uid) if uid else QThread(user=user_id)
        res = thread.save_thread_dynamo(
            client=client,
            table_name=table_name,
        )
        response = {
            "type": "success" if res else "fail"
        }
        return response

    @staticmethod
    def check_init_thread(client: any,
                          user_id: str,
                          table_name: str,
                          uid: Optional[str] = None):
        thread = QThread(user=user_id, uid=uid) if uid else QThread(user=user_id)
        res = thread.check_save_thread_dynamo(
            client=client,
            table_name=table_name,
        )
        response = {
            "type": "success" if res else "fail"
        }
        return response

    @staticmethod
    def load_thread(client: any,
                    user_id: str,
                    table_name: str):
        res = False
        try:
            thread = QThread.load_thread_dynamo(client=client,
                                                user_id=user_id,
                                                table_name=table_name)
            if thread:
                data = thread.model_dump()
                res = True
            else:
                data = {"message":"User doesn't exist. Try signing up first !"} 
        except Exception as e:
            print("error in load_thread>>",e)
            data = {"message":"User doesn't exist. Try signing up first !"} 
        response = {
            "type": "success" if res else "fail",
            "data": data
        }
        return response

    @staticmethod
    def validate_insert_component(client: any,
                                  user_id: str,
                                  table_name: str,
                                  component: dict,
                                  summary: str,
                                  component_length: int,
                                  max_content_num: int):
        comp_object = QComponent(
            content=component["content"],
            location=component["location"],
            uid=component["uid"],
            config=component["config"]
        )
        res, value = QThread.static_validate_insert_queue_content_dynamo(
            user_id=user_id,
            client=client,
            table_name=table_name,
            content=comp_object,
            summary=summary,
            component_length=component_length,
            max_content_num=max_content_num
        )
        response = {
            "type": "success" if res else "fail",
            "data": value
        }
        return response

    @staticmethod
    def validate_insert_regen_component(client: any,
                                        user_id: str,
                                        table_name: str,
                                        component: dict,
                                        content_index: int):
        regen_comp = QComponent(
            content=component["content"],
            uid=component["uid"],
            location=component["location"]
        )
        QThread.static_insert_regen_content_dynamo(
            component=regen_comp,
            user_id=user_id,
            client=client,
            table_name=table_name,
            content_index=content_index
        )
        # response = {
        #     "type" : "success" if res else "fail",
        #     "data" : value
        # }
        # return response

    @staticmethod
    def validate_delete_component(client: any,
                                  user_id: str,
                                  table_name: str,
                                  c_idx: int):
        try:
            res = QThread.static_delete_content_dynamo(
                user_id=user_id,
                client=client,
                table_name=table_name,
                index=c_idx
            )
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            response = {
                "type": "fail",
                "data": e
            }
        return response

    @staticmethod
    def handle_like_value(
            client: any,
            user_id: str,
            table_name: str,
            c_idx: int,
            like_value: int):
        try:
            res = QThread.static_handle_like_value_dynamo(
                user_id=user_id,
                client=client,
                table_name=table_name,
                index=c_idx,
                like_value=like_value)
            response = {
                "type": "success",
                "data": res
            }
        except Exception as e:
            print("error in handling like>>",e)
            response = {
                "type": "fail",
                "data": e
            }
        return response

    @staticmethod
    def handle_config_update(
            client: any,
            user_id: str,
            table_name: str,
            config: dict):
        try:
            res = QThread.static_validate_insert_config_dynamo(
                user_id=user_id,
                client=client,
                table_name=table_name,
                config=config
                )
            response = {
                "type": "success",
                "data": res
        }
        except Exception as e:
            print("error in config updation>>",e)
            response = {
                "type": "fail",
                "data": e
            }
        return response