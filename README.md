# 即刻用户信息悬浮显示插件

![demo图片](demo.png)

一个浏览器扩展，在即刻网站中悬浮显示用户详细信息，包括头像、昵称、简介、关注数据等。

由于代码比较简单，所以我预期插件发布后即刻Web版会很快跟进，到时这个插件就sunset了，所以一些todo先不处理。

## 功能特性

- 🎯 **智能识别** - 自动识别页面中的用户头像和用户名链接
- 💫 **悬浮显示** - 鼠标悬浮时显示用户详细信息卡片
- 📊 **数据展示** - 显示用户关注数、粉丝数等统计数据
- ⚡ **性能优化** - 用户数据缓存，避免重复请求
- 🎨 **美观界面** - 现代化的卡片设计，与即刻网站风格一致

## TODO

- followers添加链接
- 对当前用户的follow状态
- 设计还要polish
- 别的浏览器的版本，Safari
- API host读取getBase配置
- darkmode
- 移动端网站的支持，https://m.okjike.com/
- 有时浮窗不立即消失的bug，可能发生在由post详情页返回Feed列表的时候
- 评论在页面底部，卡片显示不全的问题


## 安装方法

### Chrome/Edge 浏览器

[Chrome Web Store 安装（推荐）](https://chromewebstore.google.com/detail/hnbakdoibeogigpihopfjfjbacfmcfck?utm_source=item-share-cb)

#### 手动安装（开发者模式）
1. 下载项目文件到本地
2. 打开浏览器扩展管理页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

### Firefox 浏览器

1. 下载项目文件到本地
2. 打开浏览器扩展管理页面 (`about:addons`)
3. 点击齿轮图标，选择"从文件安装附加组件"
4. 选择项目文件夹中的 `manifest.json` 文件

## 使用方法

1. 安装插件后，访问 [即刻网站](https://web.okjike.com)
2. 确保已登录即刻账号
3. 将鼠标悬浮在任何用户头像或用户名上
4. 插件会自动显示该用户的详细信息卡片

## 显示信息

插件会显示以下用户信息：

- 用户头像
- 用户昵称
- 个人简介
- 关注数量
- 粉丝数量
- 微信用户名（如果有）

## 技术实现

- 使用即刻官方API获取用户数据
- 自动获取用户登录token进行身份验证
- 智能DOM元素识别和事件监听
- 用户数据本地缓存优化性能

## 文件结构

```
jike_hover_user_description/
├── manifest.json      # 插件配置文件
├── content.js         # 主要功能脚本
├── icon.png          # 插件图标
└── README.md         # 说明文档
```

## 注意事项

- 需要先登录即刻网站才能正常使用
- 插件仅在即刻网站域名下生效
- 用户数据来源于即刻官方API

## 开发说明

这是一个纯前端浏览器扩展，主要文件：

- `manifest.json`: 定义插件基本信息和权限
- `content.js`: 实现用户信息悬浮显示的核心逻辑

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个插件！ 

感谢[Dia浏览器](https://www.diabrowser.com/)在开发这个插件时提供的帮助。
