#Cognito上でCONFIRMED状態のユーザを作成するLambda関数
#引数として、eventにemail, passwdを設定。
import json
import boto3

user_pool_id = 'ap-northeast-1_qWRCAnSQr'
clientid = '17tr8jgea0dehjq1nis0tm1nbf'

cognito_client = boto3.client('cognito-idp',
            region_name = "ap-northeast-1"
            )

def lambda_handler(event, context):
    
    #Cognitoユーザプールへの登録
    user = event['email']
    passwd = event['passwd']
    
    UserID = create_user(user, passwd)
    return UserID 

def create_user(user, passwd):

    #新規ユーザ作成
    response_signup = cognito_client.admin_create_user(
        UserPoolId = user_pool_id,
        Username = user,
        TemporaryPassword = passwd,
        UserAttributes=[
            {
                'Name':'email',
                'Value':user
            },
            {
                'Name':'email_verified',
                'Value':'true'
            },
        ],
        DesiredDeliveryMediums=[
            'EMAIL',
        ],
    )
    
    strUserID = response_signup["User"]["Username"]   #CognitoのUserID
 
    #パスワード変更必須のステータス変更
    response_initial = cognito_client.initiate_auth(
        ClientId = clientid,   
        AuthFlow = "USER_PASSWORD_AUTH",
        AuthParameters = {
            "USERNAME": user,
            "PASSWORD": passwd
        }
    )
    challname = response_initial["ChallengeName"]
    session = response_initial["Session"]
     
    #初回パスワード変更
    response_afterMod = cognito_client.respond_to_auth_challenge(
        ClientId = clientid,
        ChallengeName = challname,
        Session = session,
        ChallengeResponses={
            'NEW_PASSWORD': passwd,
            'USERNAME': user
        }
    )
    
    #トークン取得
    id_token = response_afterMod["AuthenticationResult"]["IdToken"]
    access_token = response_afterMod["AuthenticationResult"]["AccessToken"]
    refresh_token = response_afterMod["AuthenticationResult"]["RefreshToken"]
    
    return strUserID