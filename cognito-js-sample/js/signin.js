(() => {
    // ユーザープールの設定
    const poolData = {
      UserPoolId: "ap-northeast-1_8MuAJ9W7w",
      ClientId: "2jm23tat6n219rlfpfbo9frspf"
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
    // Amazon Cognito 認証情報プロバイダーを初期化します
    AWS.config.region = "ap-northeast-1"; // リージョン
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-1:3d2a36c7-5b5e-4d69-a4f3-65a62600e6fe"
    });
  
    /**
     * サインイン処理
     */
    document.getElementById("signinButton").addEventListener("click", () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      // 何か1つでも未入力の項目がある場合、メッセージを表示して処理を中断
      const message = document.getElementById('message-span');
      if (!email | !password) {
        message.innerHTML = "All fields are required.";
        return false;
      }
  
      // 認証データの作成
      const authenticationData = {
        Username: email,
        Password: password
      };
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
      );
  
      const userData = {
        Username: email,
        Pool: userPool
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
      // 認証処理
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          const idToken = result.getIdToken().getJwtToken(); // IDトークン
          const accessToken = result.getAccessToken().getJwtToken(); // アクセストークン
          const refreshToken = result.getRefreshToken().getToken(); // 更新トークン
  
          console.log("idToken : " + idToken);
          console.log("accessToken : " + accessToken);
          console.log("refreshToken : " + refreshToken);
  
          // サインイン成功の場合、次の画面へ遷移
          location.href = "index.html";
        },
  
        onFailure: err => {
          // サインイン失敗の場合、エラーメッセージを画面に表示
          console.log(err);
          message.innerHTML = err.message;
        }
      });
    });
  })();