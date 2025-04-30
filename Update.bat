@echo off
cd D:\Study\Code\Person_Website
git add .
git commit -m "update information"
git pull origin main --rebase
git push -u origin main
pause
