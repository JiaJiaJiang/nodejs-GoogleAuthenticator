#nodejs-GoogleAuthenticator

**谷歌身份验证器node端**

## 功能

 1. 创建随机秘钥
 2. 验证code
 3. 获取code
 4. 获取QR码地址

## 安装
目前`nodejs-GoogleAuthenticator`不会提交到npm，因此需要使用git拉取

``````
git clone https://git.coding.net/luojia/nodejs-GoogleAuthenticator.git
``````

把它`clone`到你需要的地方，然后`require`它。

## 使用

``````
var googleAuth=require('./nodejs-GoogleAuthenticator').authenticator;
var nya=new googleAuth();
``````

# API
## Class:	googleAuth([codeLength=6])
验证类
 - codeLength：验证码长度，虽然可以定义，但是并没有什么用，因为目前google身份验证器只支持6位验证码



## googleAuth.createSecret([secretLength=16])
创建一个随机秘钥
> 返回字符串秘钥。

 - secretLength：可选参数，指定生成秘钥的字符数，默认为16。




## googleAuth.getCode(secret[,timeSlice])
获取code
> 返回字符串验证码

 - secret：秘钥
 - timeSlice：指定时间片



## googleAuth.verifyCode(secret,code[,discrepancy=1,currentTimeSlice])
验证code是否正确
> 如果验证通过，返回true，否则false

 - secret：秘钥
 - code：验证码
 - discrepancy：时间误差
 - currentTimeSlice：指定当前时间片

## googleAuth.getQRCodeGoogleUrl(name,secret[,title])
通过google的api获取可以直接用身份验证器扫描的二维码
> 返回二维码URL

 - name：显示在验证器中的名字
 - secret：秘钥
 - title：标题，似乎并没有什么用