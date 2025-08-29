@echo off
chcp 65001
:: 设置你的本地仓库路径
cd D:\Study\Code\Person_Website\hangs_page

:: 确认当前分支为 main，如果不是，则切换
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
if NOT "%BRANCH%"=="main" (
    echo 当前分支为 %BRANCH%，正在切换到 main...
    git branch -m %BRANCH% main
)

:: 添加所有文件
git add .

:: 提交信息，如果没有改动则自动生成空提交
git diff-index --quiet HEAD --
if %errorlevel%==0 (
    echo 没有文件改动，创建一个空提交以强制触发构建...
    git commit --allow-empty -m "trigger rebuild"
) else (
    git commit -m "更新信息"
)

:: 拉取远程更新并 rebase
git fetch origin
git branch --set-upstream-to=origin/main main
git pull origin main --rebase

:: 推送到远程 main
git push -u origin main

echo.
echo *** 更新已推送，GitHub Pages 构建已触发 ***
pause
