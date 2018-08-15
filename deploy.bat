@echo off
choice /m "Are you sure to deploy?"

if %errorlevel%==2 exit

cmd /c hexo clean
cmd /c hexo g
git add .
git status

choice /m "Are you sure to commit these file?"
if %errorlevel%==2 exit

set /p msg=Commit msg:
git commit -m "%msg%"

git push origin master

