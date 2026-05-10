# 🚀 Face Yoga Pro - GitHub 部署指南

## 方法一：命令行一键部署（推荐）

打开 PowerShell / 终端，依次执行以下命令：

### 第 1 步：进入项目目录
```powershell
cd "C:\Users\lnizh\Documents\TRAESOLO\face-yoga"
```

### 第 2 步：创建 GitHub 远程仓库并推送
将下面的 `YOUR_USERNAME` 替换为您的 GitHub 用户名，然后执行：

```powershell
# 添加远程仓库（请替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/face-yoga-pro.git

# 推送代码
git branch -M main
git push -u origin main
```

> ⚠️ 如果仓库不存在，Git Credential Manager 会弹出登录窗口，但推送会失败。
> 请先按"方法二"在 GitHub 上创建仓库，然后再执行上面的命令。

---

## 方法二：手动创建仓库 + 命令推送

### 第 1 步：在 GitHub 上创建仓库
1. 打开 https://github.com/new
2. **Repository name** 填写：`face-yoga-pro`
3. **Description** 填写：`Face Yoga Pro - 脸部瑜伽教学网站`
4. ⚠️ **不要**勾选 "Add a README file"
5. ⚠️ **不要**勾选 "Add .gitignore"
6. 点击 **"Create repository"**

### 第 2 步：推送代码
创建仓库后，GitHub 会显示一个页面，忽略上面的命令，直接在终端执行：

```powershell
cd "C:\Users\lnizh\Documents\TRAESOLO\face-yoga"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/face-yoga-pro.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 第 3 步：启用 GitHub Pages

推送成功后：

1. 打开您的仓库页面：`https://github.com/YOUR_USERNAME/face-yoga-pro`
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. **Source** 选择：`Deploy from a branch`
5. **Branch** 选择：`main`，文件夹选 `/ (root)`
6. 点击 **Save**
7. 等待 1-2 分钟，页面顶部会显示您的网站地址：
   👉 **`https://YOUR_USERNAME.github.io/face-yoga-pro/`**

---

## 方法三：使用 GitHub Desktop（最简单）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop → File → Add local repository
3. 选择文件夹：`C:\Users\lnizh\Documents\TRAESOLO\face-yoga`
4. 点击 **Publish repository**
5. 取消勾选 "Keep this code private"
6. 点击 **Publish repository**
7. 推送完成后，按"方法三"的步骤启用 GitHub Pages

---

## ✅ 部署成功后

您的网站将可以通过以下地址访问：
```
https://YOUR_USERNAME.github.io/face-yoga-pro/
```

### 网站功能清单
- 🌍 11 种语言切换
- 🎬 SVG 动画教学演示
- 📱 响应式设计（手机/平板/桌面）
- 🔍 SEO 优化（结构化数据、hreflang）
- ♿ 无障碍访问支持

### 后续更新
修改文件后，只需执行：
```powershell
cd "C:\Users\lnizh\Documents\TRAESOLO\face-yoga"
git add -A
git commit -m "更新描述"
git push
```
GitHub Pages 会自动重新部署。
