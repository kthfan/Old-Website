@echo off
SETLOCAL


set defaultbit=64
set tolog=yes

set mla=bin\ml.exe
set linka=bin\link.exe
set GoLink=bin\GoLink.exe
set ml64=bin\ml64.exe
set msvcrt=lib\msvcrt
set filename=%1


IF [%filename%]==[] goto quit

IF [%3]==[] (
  goto argc2
) ELSE (
  set argbit=%3
  set exename=%2
  goto endargc
)
:argc2
IF [%2]==[] (
  goto endargc
) ELSE (
  set argbit=%2
)
:endargc

set dirname=%cd%

IF "%argbit%"=="" (goto setargbit)  
goto endsetargbit
:setargbit
set argbit=%defaultbit%
:endsetargbit

FOR /F "tokens=1 delims=?" %%G IN ( "%filename%" ) DO (
set filepath=%%~dG%%~pG
set fileext=%%~xG
set filename=%%~nG
)

IF NOT EXIST "%filepath%" (
  set filepath="%dirname%"
)

echo path: %filepath%

set objname=%filepath%%filename%.obj
IF [%exename%]==[] set exename=%filepath%%filename%.exe
set tmp=%objname%

:checkobj
IF NOT EXIST "%objname%" ( goto checkexe )
set objname=%filepath%%filename%.%random%.obj
goto checkobj

:checkexe

FOR /F "tokens=1 delims=?" %%G IN ( "%exename%" ) DO (
set exename=%%~dG%%~pG%%~nG%%~xG
)

IF NOT EXIST "%exename%" ( 
IF NOT EXIST "%exename%.exe" goto assemble
)
  set /p tmp="%exename% already exists, overwrite(O), rename(R) or quit(Q):"
  IF "%tmp%"=="Q" goto quit ELSE (
    IF "%tmp%"=="q" goto quit
  )
  IF "%tmp%"=="O" goto assemble ELSE (
    IF "%tmp%"=="o" goto assemble
  )
  IF "%tmp%"=="R" goto setexename ELSE (
    IF "%tmp%"=="r" goto setexename
  )
  goto setexenameend
:setexename
  set /p exename="Enter file name:"
  set exename=%filepath%%exename%.exe
  goto checkexe
:setexenameend

  echo Invalid input.
  goto checkexe

:assemble

FOR /F "tokens=1 delims=?" %%G IN ( "%exename%" ) DO (
set exename=%%~dG%%~pG%%~nG%%~xG
)

set asm_cmd="%ml64%" /Fo "%objname%" /c "%filepath%%filename%%fileext%"
set link_cmd="%GoLink%" /console "%objname%" "%msvcrt%.dll" /fo "%exename%"
IF "%argbit%"=="32" ( 
set asm_cmd=%mla% /Fo "%objname%"  /c /coff "%filepath%%filename%%fileext%"
set link_cmd=%linka% /SUBSYSTEM:CONSOLE /OPT:NOREF "%objname%" "%msvcrt%.lib" /OUT:"%exename%"
)

IF %tolog%==yes (
%asm_cmd% > mkmasm.log 2>&1
%link_cmd%  >>mkmasm.log 2>&1
type mkmasm.log
) ELSE (
%asm_cmd%
%link_cmd%
)

echo Delete object file: %objname%
del /F "%objname%"
:quit

ENDLOCAL