@echo off
chcp 65001 >nul
set "folder=%~dp0"
set "output=%folder%output.txt"

tree "%folder%" /F /A > "%output%"
start "" "%output%"
