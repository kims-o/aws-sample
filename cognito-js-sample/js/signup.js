(() => {
    // ユーザープールの設定
    const poolData = {
      UserPoolId: "ap-northeast-1_8MuAJ9W7w",
      ClientId: "2jm23tat6n219rlfpfbo9frspf"
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
    const attributeList = [];
  
    // Amazon Cognito 認証情報プロバイダーを初期化します
    AWS.config.region = "ap-northeast-1"; // リージョン
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-1:3d2a36c7-5b5e-4d69-a4f3-65a62600e6fe"
    });
  
    // 「Create Account」ボタン押下時
    const createAccountBtn = document.getElementById("createAccount");
    createAccountBtn.addEventListener("click", () => {
      /**
       * サインアップ処理。
       */
      const username = document.getElementById("email").value;
      const password = document.getElementById('password').value;
  
      // 何か1つでも未入力の項目がある場合、処理終了
      const message = document.getElementById("message-span");
      if (!username | !password) {
        message.innerHTML = "未入力項目があります。";
        return false;
      }
  
      // サインアップ処理
      userPool.signUp(username, password, null, null, (err, result) => {
        if (err) {
          message.innerHTML = err.message;
          return;
        } else {
          // サインアップ成功の場合、アクティベーション画面に遷移する
          alert(
            "登録したメールアドレスへアクティベーション用のリンクを送付しました。"
          );
          location.href = "signin.html";
        }
      });
    });
  })();