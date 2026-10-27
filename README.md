# AIGC 个人作品集

参考提供的海报，采用芥末黄、草绿、粉色与黑色；包含手绘人物、海报式首屏、作品分类、视频预览与播放弹窗、心得折叠栏、成长章节。

## 打开网页

直接双击 `dist/index.html`，无需安装 Node.js 或依赖。正式发布后，访客使用公网网址访问，无需运行这台电脑。

## 目录与内容

- **产出**：训练营 AIGC（1 支短片）；产品 AIGC（14 支产品创意视频与 6 支 Live 图视频）。
- **想法 / 心得**：3 份标注为「待补充」的写作提纲，并可查看原始工作流截图。
- **蜕变**：3 个成长章节，真实经历待补充，没有虚构时间、客户或成绩。

作品来自用户提供的 `AIGC个人作品 3.zip`。`dist/content.js` 保存作品标题、分类、原始文件名和成长文案。心得内容在 `dist/index.html` 中修改；配色和排版位于 `dist/style.css`，交互位于 `dist/app.js`。

## 发布到 GitHub Pages

此项目通过 `.github/workflows/deploy.yml` 自动发布。网站、素材或发布脚本推送到 `main` 后会触发更新；仅修改 README 不会重新转码视频。线上地址及发布结果以仓库 Actions 和 Pages 页面为准。

1. 把 **aigc-portfolio 目录内的内容**放入目标 GitHub 仓库根目录，使用 `main` 分支。必须保留 `.github`、`media-parts` 和 `scripts`。
2. 仓库 Settings → Pages → Build and deployment，Source 选择 **GitHub Actions**。
3. 在 Actions 中运行 **Publish portfolio to GitHub Pages**。后续推送 `main` 会自动更新。
4. 成功后以工作流返回的实际地址为准；项目站通常为 `https://你的用户名.github.io/仓库名/`。

`.gitignore` 已排除完整的 `dist/assets/film-18.mp4`。该视频超过 GitHub 的 100 MiB 单文件限制，故仓库保存到 `media-parts` 中的 5 个分片，每片不超过 24 MiB。发布流程自动合并并检查每片及完整文件的 SHA-256，再用 FFmpeg 把全部 21 支视频转为 H.264/AAC、限制尺寸并启用 fast start，同时生成真实画面封面。仓库里的源视频保留原样，发布版播放完整转码视频。不要把原始大文件强行加入 Git，也不要改用 Git LFS 链接作为视频地址。

如果在新环境本地预览，先用 Python 3.8+ 执行 `python3 scripts/prepare_media.py`，再打开网页。当前交付目录已包含完整视频，可直接打开。原始素材大多为 HEVC，本地播放依赖浏览器支持；安装 FFmpeg 后也可在本地执行 `python3 scripts/prepare_web_media.py` 生成兼容版。公开版由工作流自动处理，无需访客安装解码器。所有网页路径均为相对路径，兼容 GitHub Pages 的仓库子目录。

公开作品集会公开其中的媒体素材。当前不包含联系方式、账号密钥或追踪脚本。

参考官方文档：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[自定义发布流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[文件大小限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)。

## 验证记录

发布流程会校验视频分片 SHA-256、完整视频 SHA-256、作品数量、输出 H.264 编码、视频大小与封面图。任一处理失败都会阻止该次发布。网页无需后端服务，全部媒体路径使用相对路径。
