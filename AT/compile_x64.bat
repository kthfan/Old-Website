
@echo off

SETLOCAL ENABLEDELAYEDEXPANSION

set ASSEMBLER="..\VC\bin\amd64\ml64.exe"	
set COMPILER="..\VC\bin\amd64\cl.exe"
set LINKER="..\VC\bin\amd64\link.exe"
set RC="..\VC\bin\rc.exe"
set INCLUDE_OPT=/I "..\VC\include" /I "..\VC\atlmfc\include" /I "..\Windows Kits\include\ucrt" /I "..\Windows Kits\include\um" /I "..\Windows Kits\include\shared"
set LIB_OPT=/LIBPATH:"..\VC\lib\amd64" /LIBPATH:"..\VC\atlmfc\lib\amd64" /LIBPATH:"..\Microsoft SDKs\lib\ucrt\x64" /LIBPATH:"..\Windows Kits\Lib\win8\um\x64"



FOR /F "tokens=1 delims=?" %%A IN ("%1" ) DO (
  set var_1_name_=%%~nA
  set var_1_path_=%%~dA%%~pA
  set var_1_ext_=%%~xA
)
set dist_dir=!var_1_path_!
set dist_exe=/OUT:"!var_1_path_!!var_1_name_!.exe"
SET objs_=


FOR %%A in (%*) DO (
  FOR /F "tokens=1 delims=?" %%B IN ("%%A") DO (
    set var_for_1_name_=%%~nB
    set var_for_1_path_=%%~dB%%~pB
    set var_for_1_ext_=%%~xB
  )
  set dist_res=/fo "!dist_dir!!var_for_1_name_!.res"
  set dist_obj=/Fo:"!dist_dir!!var_for_1_name_!.obj"
  set dist_obj_asm=/Fo "!var_for_1_path_!!var_for_1_name_!.obj" 
  IF [!var_for_1_ext_!]==[.cpp] (
    !COMPILER! !INCLUDE_OPT! !dist_obj! %%A /c /nologo /W3 /WX- /O2 /Oi /GL /D _MBCS /Gm- /EHsc /MD /GS /Gy /fp:precise /Zc:wchar_t /Zc:forScope 
    set objs_=!objs_! "!var_for_1_path_!!var_for_1_name_!.obj"
  )
  IF [!var_for_1_ext_!]==[.c] (
    !COMPILER! !INCLUDE_OPT! !dist_obj! %%A /c
    set objs_=!objs_! "!var_for_1_path_!!var_for_1_name_!.obj" 
  )
  IF [!var_for_1_ext_!]==[.rc] (
    !RC! !INCLUDE_OPT! !dist_res! %%A
    set objs_=!objs_! "!var_for_1_path_!!var_for_1_name_!.res" 
  )
  IF [!var_for_1_ext_!]==[.asm] (
    !ASSEMBLER! !dist_obj_asm! %%A /c /nologo
	set objs_=!objs_! "!var_for_1_path_!!var_for_1_name_!.obj" 
  )
)

!LINKER! !dist_exe! !objs_! !LIB_OPT! kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /NOLOGO /OPT:REF /OPT:ICF /LTCG /TLBID:1 /DYNAMICBASE /NXCOMPAT /MACHINE:X64


ENDLOCAL
  

