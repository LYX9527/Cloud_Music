<br />
<p align="center">
  <h2 align="center" style="font-weight: 900">Cloud_Music</h2>

  <p align="center">
   第三方网易云播放器
  </p>
</p>


## ✨ 特性

- ✅ 使用 Vue.js 全家桶开发
- 🔴 网易云账号登录（扫码/手机/邮箱登录）
- 📺 支持 MV 播放
- 📃 支持歌词显示
- 📻 每日推荐歌曲
- 🛠 更多特性开发中

## ⚙️ 部署到自己的服务器

 部署到自己的服务器上

1. 部署网易云 API，详情参见 [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
2. 克隆本仓库

```sh
git clone --recursive https://github.com/LYX9527/Cloud_Music/tree/master
```

3. 安装依赖

```sh
yarn install

```

4. （可选）使用 Nginx 反向代理 API，将 API 路径映射为 `/api`，如果 API 和网页不在同一个域名下的话（跨域），会有一些 bug。

5. 复制 `/.env.example` 文件为 `/.env`，修改里面 `VUE_APP_NETEASE_API_URL` 的值为网易云 API 地址。本地开发的话可以填写 API 地址为 `http://localhost:3000`，YesPlayMusic 地址为 `http://localhost:8080`。如果你使用了反向代理 API，可以填写 API 地址为 `/api`。

```
VUE_APP_NETEASE_API_URL=http://localhost:3000
```

6. 编译打包

```sh
yarn run build
```

7. 将 `/dist` 目录下的文件上传到你的 Web 服务器

## :computer: 配置开发环境

本项目由 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供 API。

运行本项目

```shell
# 安装依赖
yarn install

# 创建本地环境变量
cp .env.example .env

# 运行（网页端）
yarn dev
```

## ☑️ Todo



## 📜 开源许可

本项目仅供个人学习研究使用，禁止用于商业及非法用途。

基于 [MIT license](https://opensource.org/licenses/MIT) 许可进行开源。


## 🖼️ 截图


