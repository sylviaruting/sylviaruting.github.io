# 张汝婷 · 个人作品集网站

深圳大学美术学国画专业个人主页，托管于 GitHub Pages。

## 在线访问

https://sylviaruting.github.io

## 本地预览

直接用浏览器打开 `index.html`，或使用本地服务器：

```bash
python -m http.server 8080
```

然后访问 http://localhost:8080

## 部署到 GitHub Pages

```bash
git add .
git commit -m "Add personal portfolio website"
git push origin main
```

推送后，在仓库 **Settings → Pages** 中确认 Source 为 `main` 分支的 `/ (root)` 目录。

## 项目结构

```
├── index.html          # 主页
├── css/style.css       # 样式
├── js/
│   ├── works.js        # 作品与荣誉数据
│   └── main.js         # 交互逻辑
└── assets/images/      # 作品图片
```

## 修改作品

编辑 `js/works.js` 中的 `WORKS` 和 `AWARDS` 数组即可更新内容。
