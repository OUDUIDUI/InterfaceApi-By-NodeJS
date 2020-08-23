# NodeJS 搭建接口文档
![interfaceApi](./_data/interfaceApi.png)
### 项目介绍
#### 通过框架快速搭建接口
该项目使用Express框架搭建API接口，并且使用jwt令牌生成和验证，bcryptjs密码加密等模块，使接口更健壮。
#### 中间件控制
通过自定义中间件控制和复用路由功能，例如错误提醒，路由鉴权，异步请求等等。
#### 用户鉴权
多维度控制路由的访问，例如用户的登录状态，角色定位，路由守卫等，让每个路由的范围更安全。

### 项目运行
####配置参数
打开config路径下的config.env，配置MongoDB地址、邮箱相关参数等。

####全局安装nodemon
``` 
sudo npm i nodemon -g
```
####运行
```
npm run dev
```

