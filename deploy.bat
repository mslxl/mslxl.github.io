@echo off
choice /m "Are you sure to deploy?"

if %errorlevel%==2 exit

if not exist "node_modules" (
	cmd /c npm install -g hexo hexo-cli
	cmd /c npm install
)
 
cmd /c hexo clean
cmd /c hexo g
git pull
cls
git add .
git status

choice /m "Are you sure to commit these file?"
if %errorlevel%==2 exit

set /p msg=Commit msg:
git commit -m "%msg%"

cls
echo Pushing...
git push origin source

if %errorlevel%==0 (
	echo successful
)else(
	echo failed
)
pause >nul
