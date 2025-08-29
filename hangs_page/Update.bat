@echo off
cd D:\Study\Code\Person_Website\hangs_page

:: 添加所有文件
git add .

:: 提交信息，如果没有改动则自动生成空提交
git diff-index --quiet HEAD --
if %errorlevel%==0 (
    echo 没有文件改动，创建一个空提交以强制触发构建...
    git commit --allow-empty -m "trigger rebuild"
) else (
    git commit -m "update information"
)

:: 拉取远程更新并 rebase
git pull origin main --rebase

:: 推送到远程
git push -u origin main

echo.
echo *** 更新已推送，GitHub Pages 构建已触发 ***
pause
