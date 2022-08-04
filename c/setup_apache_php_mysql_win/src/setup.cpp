
#ifndef _WINDOWS_
#include <windows.h>
#endif

#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include<iostream>
#include <vector>
using namespace std;

#include "Resource.h"

#define MAX_HTTPD_SIZE 65536
#define MAX_PHPINI_SIZE 131072
#define MAX_ERR_SIZE 32768

string szApacheDefPath = "c:/Apache2";
string szPhpDefPath = "c:/php";
string szApacheVer = "2.2";
char szApachePath[MAX_PATH] = {0};
char szPhpPath[MAX_PATH] = {0};
char szMySqlPath[MAX_PATH] = {0};

void LoadFileInResource(int name, int type, DWORD& size, const char*& data);
std::string ReplaceString(std::string subject, const std::string& search,
                          const std::string& replace);
void ReplaceStringInPlace(std::string& subject, const std::string& search,
                          const std::string& replace);
int file_exists(const char* filename);
BOOL DirectoryExists(LPCTSTR szPath);
int ModifyHttpdConf();
void scanPath(char* szBuffer);
int ModifyPhpIni();
int loadDll();
int runCommands();
int solveMySqlPasswd();
int execmd(string cmd, DWORD timeout, int output);
int install();
int uninstall();
int setConfig();
int introduction();
int desc();

int main(){
begin:
	char szOptBuf[64] = {0};
	introduction();
	printf("Choose options: \n");
	printf("1. Install\n");
	printf("2. Uninstall\n");
	printf("3. Description\n");
	printf("Your option: ");
	fgets(szOptBuf, 64, stdin);
	szOptBuf[strcspn(szOptBuf, "\r\n")] = 0;
	if(strcmp(szOptBuf, "1")==0){
		install();
	}else if(strcmp(szOptBuf, "2")==0){
		uninstall();
	}else if(strcmp(szOptBuf, "3")==0){
		desc();
		goto begin;
	}else{
		printf("Please enter 1 or 2 or 3\n");
	}
	system("pause");
	return 0;
}
int desc(){
	DWORD size = 0;
    const char* data = NULL; 
	LoadFileInResource(IDR_DESC_TEXT, TEXTFILE, size, data);
	printf(data);
	return 0;
}
int introduction(){
	DWORD size = 0;
    const char* data = NULL; 
	LoadFileInResource(IDR_INTRO_TEXT, TEXTFILE, size, data);
	printf(data);
	return 0;
}
int setConfig(){
	char szVerBuf[64] = {0};
	printf("Choose version of Apache: \n");
	printf("1. 2.2\n");
	printf("2. 2.4\n");
	printf("Your option: ");
	fgets(szVerBuf, 64, stdin);
	szVerBuf[strcspn(szVerBuf, "\r\n")] = 0;
	if(strcmp(szVerBuf, "1")==0) {
		szApacheDefPath = "c:/Apache2";
		szApacheVer = "2.2";
	}else if(strcmp(szVerBuf, "2")==0) {
		szApacheDefPath = "c:/Apache24";
		szApacheVer = "2.4";
	}else {
		printf("Please enter 1 or 2\n");
		return 1;
	}
	
	printf("Apache Directory: ");
	scanPath(szApachePath);
	printf("PHP Directory: ");
	scanPath(szPhpPath);
	printf("MySQL Directory: ");
	scanPath(szMySqlPath);
	return 0;
}
int install(){
	if(setConfig()!=0) return 1;
	printf("Modifying httpd.conf\n");
	if(ModifyHttpdConf()!=0){
		printf("Error occurred while modify httpd.conf.\n");
		return 0;
	}
	printf("Modifying php.ini\n");
	if(ModifyPhpIni()!=0){
		printf("Error occurred while modify php.inf.\n");
		return 0;
	}
	printf("Extracting files.\n");
	if(loadDll()!=0){
		printf("Error occurred while extract files.\n");
		return 0;
	}
	printf("Executing commands.\n");
	if(runCommands()!=0){
		printf("Error occurred while executing commands.\n");
		return 0;
	}
	printf("Finding mysql password.");
	if(solveMySqlPasswd()!=0){
		printf("Error occurred while finding mysql password.\n");
		return 0;
	}
	printf("Successfully install.\n");
}
int uninstall(){
	printf("Uninstalling.\n");
	if(setConfig()!=0) return 1;
	int nCount = 4;
	string cmds[4] = {
		"net stop mysql",
		string(szMySqlPath) + "/bin/mysqld.exe --remove",
		string(szApachePath) + "/bin/httpd.exe -k stop",
		string(szApachePath) + "/bin/httpd.exe -k uninstall"
	};
	int interval[4] = {10000, 10000, 10000, 10000};
	for(int i=0;i<nCount;i++){
		printf(("Log: Executing command: "+cmds[i]+"\n").c_str());
		execmd(cmds[i], interval[i], 1);
	}
	printf("Successfully uninstall.\n");
	return 0;
}


int ModifyHttpdConf(){
	char szHttpdConfPath[MAX_PATH] = {0};
	char szBuffer[MAX_HTTPD_SIZE] = {0};
	string str;
	string file_str;
	DWORD len;
	HANDLE fileHandle;
	strcat_s(szHttpdConfPath, MAX_PATH, szApachePath);
	strcat_s(szHttpdConfPath, MAX_PATH, "/conf/httpd.conf");
	file_str = szHttpdConfPath;
	if(!file_exists(szHttpdConfPath)) {
		printf(("Error: File " + file_str + " does not exists.\n").c_str());
		return 1;
	}
	fileHandle = CreateFile( szHttpdConfPath, GENERIC_READ | GENERIC_WRITE,
		0, 0, OPEN_EXISTING, 0, 0 ) ;
	if(!ReadFile(fileHandle,szBuffer,MAX_HTTPD_SIZE,&len,NULL)){
		CloseHandle( fileHandle );
		printf(("Error: Can not read file: " + file_str + "\n").c_str());
		return 1;
	}
	str = szBuffer;
	if(str.find("Modified by followjohn.") != string::npos){
		CloseHandle( fileHandle );
		printf(("Note: File "+file_str+" is modified. \n").c_str());
		return 0;
	}
	ReplaceStringInPlace(str, szApacheDefPath, string(szApachePath));
	if(SetFilePointer(fileHandle, 0, NULL, FILE_BEGIN) == INVALID_SET_FILE_POINTER || !WriteFile( fileHandle, str.c_str(), (DWORD)str.length(), &len, NULL )){
		CloseHandle( fileHandle );
		printf(("Error: Can not write file: " + file_str + "\n").c_str());
		return 1;
	}
	DWORD size = 0;
    const char* data = NULL;
	char szFileBuffer[4096] = {0};
	if(szApacheVer=="2.2") LoadFileInResource(IDR_HTTPEND22_TEXT, TEXTFILE, size, data);
	else if(szApacheVer=="2.4") LoadFileInResource(IDR_HTTPEND24_TEXT, TEXTFILE, size, data);
	memcpy_s(szFileBuffer, 4096, data, size);
	str = szFileBuffer;
	ReplaceStringInPlace(str, szPhpDefPath, string(szPhpPath));
	ReplaceStringInPlace(str, szApacheDefPath, string(szApacheDefPath));
	if(!WriteFile( fileHandle, str.c_str(), (DWORD)str.length(), &len, NULL )){
		CloseHandle( fileHandle );
		printf(("Error: Can not write file: " + file_str + "\n").c_str());
		return 1;
	}
	CloseHandle( fileHandle );
	return 0;
}
int ModifyPhpIni(){
	HANDLE hFile;
	char szBuffer[MAX_PHPINI_SIZE] = {0};
	DWORD len;
	DWORD nIndex;
	string szPhpIni_p = string(szPhpPath)+"/php.ini-production";
	string szPhpIni_d = string(szPhpPath)+"/php.ini-development";
	string lpIniAry[2] = {szPhpIni_p, szPhpIni_d};
	string szText;
	int iniexist = file_exists((string(szPhpPath)+"/php.ini").c_str());
	
	for(int i=0;i<2;i++){
		printf(("Log: Modifying file: " + lpIniAry[i] +"\n").c_str());
		if(!file_exists(lpIniAry[i].c_str())) {
			if(iniexist){
				printf(("Warning: File " + lpIniAry[i] + " does not exists.\n").c_str());
				continue;
			}else{
				printf(("Error: File " + lpIniAry[i] + " does not exists.\n").c_str());
				return 1;
			}
		}
		hFile = CreateFile( lpIniAry[i].c_str(), GENERIC_READ | GENERIC_WRITE,
			0, 0, OPEN_EXISTING, 0, 0 ) ;
		if(!ReadFile(hFile,szBuffer,MAX_PHPINI_SIZE,&len,NULL)){
			CloseHandle( hFile );
			printf(("Error: Can not read file: " + lpIniAry[i] + "\n").c_str());
			return 1;
		}
		szText = szBuffer;
		if(szText.find("Modified by followjohn.") != string::npos){
			CloseHandle( hFile );
			printf(("Note: File "+lpIniAry[i]+" is modified. \n").c_str());
			return 0;
		}
		nIndex = szText.find("doc_root =");
		szText.append("\r\n;Modified by followjohn.\r\n");
		szText.insert(nIndex+10, (" " + string(szApachePath) + "/htdocs/"));
		if(SetFilePointer(hFile, 0, NULL, FILE_BEGIN) == INVALID_SET_FILE_POINTER || !WriteFile( hFile, szText.c_str(), (DWORD)szText.length(), &len, NULL )){
			CloseHandle( hFile );
			printf(("Error: Can not write file: " + lpIniAry[i] + "\n").c_str());
			return 1;
		}
		CloseHandle( hFile );
	}
	if (rename( szPhpIni_d.c_str() , (string(szPhpPath)+"/php.ini").c_str() )){
		printf(("Error: Can not rename file: " + szPhpIni_d + " to " + string(szPhpPath)+"/php.ini" + "\n").c_str());
		return 1;
	}
	return 0;
}
int loadDll(){
	int nCount = 1;
	string dest[1] = {string(szMySqlPath)+"/bin/vcruntime140_1.dll"};
	DWORD names[1] = {IDR_VCRT140_1_DLL};
	DWORD types[1] = {TEXTFILE};
	for(int i=0;i<nCount;i++){
		printf(("Log: Extracting file to "+dest[i]+"\n").c_str());
		DWORD size = 0;
		DWORD len = 0;
		const char* data = NULL;
		HANDLE hFile = NULL;
		LoadFileInResource(names[i], types[i], size, data);
		if(file_exists(dest[i].c_str())) {
			printf(("Note: File " + dest[i] + " already exists.\n").c_str());
			continue;
		}
		hFile = CreateFile( dest[i].c_str(), GENERIC_WRITE,
			0, 0, CREATE_ALWAYS, 0, 0 ) ;
		if(hFile == NULL || hFile == INVALID_HANDLE_VALUE){
			printf(("Error: Can not create file: " + dest[i] + "\n").c_str());
			return 1;
		}
		if(!WriteFile( hFile, data, (DWORD)size, &len, NULL )){
			printf(("Error: Can not write file: " + dest[i] + "\n").c_str());
			CloseHandle( hFile );
			return 1;
		}
		CloseHandle( hFile );
	}
	return 0;
}
int runCommands(){
	int nCount = 6;
	int pass[6] = {0,0,0,0,0,0};
	string cmds[6] = {
		string(szApachePath) + "/bin/httpd.exe -t",
		string(szApachePath) + "/bin/httpd.exe -k install",
		string(szApachePath) + "/bin/httpd.exe -k start",
		string(szMySqlPath) + "/bin/mysqld.exe --install",
		string(szMySqlPath) + "/bin/mysqld.exe --initialize",
		"net start mysql"
	};
	int interval[6] = {5000, 5000, 5000, 5000, 60000, 10000};
	SC_HANDLE sch = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
	string serviceNames[2] = {"Apache"+szApacheVer, "MySQL"};
	int scexist[2] = {1, 1};
	int sc2run[2] = {1, 1};
	
	for(int i=0;i<2;i++){
		DWORD needed = 0;
		SERVICE_STATUS_PROCESS stat;
		SC_HANDLE svc = OpenService(sch, serviceNames[i].c_str(), SC_MANAGER_ALL_ACCESS);
		if (svc == NULL){
			DWORD errcode = GetLastError();
			if(errcode==ERROR_SERVICE_DOES_NOT_EXIST) {
				scexist[i] = 0;
				CloseServiceHandle(svc);
				continue;
			}else{
				printf(("Error: Exception on opening service "+ serviceNames[i] +" , error code: %d.\n").c_str(), errcode);
				CloseServiceHandle(svc);
				CloseServiceHandle(sch);
				return 1;
			}
		}
		if(QueryServiceStatusEx(svc, SC_STATUS_PROCESS_INFO,
					(BYTE*)&stat, sizeof(stat), &needed) == 0){
			printf(("Error: Exception on querying service "+ serviceNames[i] +" , error code: %d.\n").c_str(), GetLastError());
			CloseServiceHandle(svc);
			CloseServiceHandle(sch);
			return 1;
		}
		if(stat.dwCurrentState == SERVICE_RUNNING) sc2run[i] = 0;
		CloseServiceHandle(svc);
	}
	CloseServiceHandle(sch);
	
	if(scexist[0]){
		cmds[1] = "Note: Apache is already installed.\n";
		pass[1] = 1;
	}
	if(scexist[1]){
		cmds[3] = "Note: MySQL is already installed.\n";
		pass[3] = 1;
	}
	if(!sc2run[0]){
		cmds[2] = "Note: Apache is already running.\n";
		pass[2] = 1;
	}
	if(!sc2run[1]){
		cmds[5] = "Note: MySQL is already running.\n";
		pass[5] = 1;
	}
	if(DirectoryExists((LPCTSTR) (string(szMySqlPath)+"/data").c_str())){
		cmds[4] = "Note: MySQL is already initialized.\n";
		pass[4] = 4;
	}
	for(int i=0;i<nCount;i++){
		if(pass[i]){
			printf(cmds[i].c_str());
		}else{
			printf(("Log: Executing command: "+cmds[i]+"\n").c_str());
			if(execmd(cmds[i], interval[i], 1)!=0) return 1;
		}
	}
	return 0;
}
int solveMySqlPasswd(){
	HANDLE fileHandle ;
    WIN32_FIND_DATA findData ;
	char szBuffer[MAX_ERR_SIZE];
	string strText;
	DWORD len;
	
    fileHandle = FindFirstFile( (string(szMySqlPath)+"/data/*.err").c_str(), &findData );
    if( fileHandle != INVALID_HANDLE_VALUE ) {
        do {
            if( !(findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)){
				string fn = string(szMySqlPath)+"/data/"+string(findData.cFileName);
				printf(("Log: Search " + fn +" for password.\n").c_str());
				
				HANDLE hFile = CreateFile( fn.c_str(), GENERIC_READ,
					FILE_SHARE_READ | FILE_SHARE_WRITE, 0, OPEN_EXISTING, 0, 0 ) ;
				if(hFile == NULL || hFile == INVALID_HANDLE_VALUE){
					printf(("Error: Can not open file: " + fn + "\n").c_str());
					return 1;
				}
				if(!ReadFile(hFile,szBuffer,MAX_ERR_SIZE,&len,NULL)){
					printf(("Error: Can not open file: " + fn + "\n").c_str());
					CloseHandle( hFile );
					return 1;
				}
				strText = szBuffer;
				CloseHandle( hFile );
				DWORD nStart = strText.find("A temporary password is generated for root");
				if(nStart == string::npos) {
					printf(("Note: Password is not in " + fn +" .\n").c_str());
					continue;
				}
				nStart = strText.find(": ", nStart + strlen("A temporary password is generated for root"));
				if(nStart == string::npos) {
					printf(("Note: Password is not in " + fn +" .\n").c_str());
					continue;
				}
				DWORD nEnd = strText.find("\r\n", nStart+2);
				if(nEnd == string::npos) {
					nEnd = len;
				}
				string strPasswd = strText.substr(nStart+2, nEnd-nStart);
				int rtstate;
				for(int i=0;i<3;i++){
					printf("***** Please Reset Your Password *****\n");
					printf("Step-1: Enter your new password.\n");
					printf("Step-2: Enter your old password.\nYour default password for root is: ");
					printf((strPasswd+"\n\n").c_str());
					
					char szNewPasswdBuf[256] = {0};
					printf("Enter new password: ");
					fgets(szNewPasswdBuf, 256, stdin);
					szNewPasswdBuf[strcspn(szNewPasswdBuf, "\r\n")] = 0;
					rtstate = execmd(string(szMySqlPath)+ "/bin/mysqladmin.exe -u root -p password " + string(szNewPasswdBuf), INFINITE, 1);
					if(rtstate == 0) break; 
				}
				if(rtstate != 0){
					printf(("Error: Can not reset password in MySQL. Your root password might be in " + fn + " .\n").c_str());
					return 1;
				}
				return 0;
			}
        } while( FindNextFile( fileHandle, &findData ) ) ;
    }
    printf("Error: Can not find mysql password.");
    return 1;
}
void scanPath(char* szBuffer){
	fgets(szBuffer, MAX_PATH, stdin);
	szBuffer[strcspn(szBuffer, "\r\n")] = 0;
	string str = szBuffer;
	ReplaceStringInPlace(str, "\\", "/");
	memcpy_s(szBuffer, MAX_PATH, str.c_str(), MAX_PATH);
	DWORD nLen = strlen(szBuffer);
	if(nLen > 0 && szBuffer[nLen-1] == '/') szBuffer[nLen-1] = (char)0;
}
int execmd(string cmd, DWORD timeout, int output){
	STARTUPINFO si;
	PROCESS_INFORMATION pi;
	DWORD dwObjState;
	DWORD exit_code;
	double dwPassedTime = 0;
	ZeroMemory( &si, sizeof(si) );
	si.cb = sizeof(si);
	ZeroMemory( &pi, sizeof(pi) );
	if( !CreateProcess( NULL, (LPSTR)cmd.c_str(), NULL, NULL, FALSE, 0,NULL,NULL, &si,&pi ) ) {
		if(output) printf(("Error: Can not execute command: " + cmd + "\n").c_str());
		return 1;
	}
	while( (dwObjState = WaitForSingleObject(pi.hProcess, timeout)) == WAIT_TIMEOUT){
		dwPassedTime += timeout/1000;
		printf(("Note: %f seconds passed while executing command: " + cmd + "\n").c_str(), dwPassedTime);
	}
	if(dwObjState != WAIT_OBJECT_0){
		if(output) printf(("Error: Exception occurred after executing command: " + cmd + "\n").c_str());
		CloseHandle(pi.hThread);
		CloseHandle(pi.hProcess);
		return 1;
	}
	if (GetExitCodeProcess(pi.hProcess, &exit_code) == FALSE) printf(("Warning: Unable to get the exit code of" + cmd + "\n").c_str());
	else{
		if(exit_code!=0){
			if(output) printf(("Error: Exit code of " + cmd + " is %d \n").c_str(), exit_code);
			CloseHandle(pi.hThread);
			CloseHandle(pi.hProcess);
			return 1;
		}
	}
	CloseHandle(pi.hThread);
	CloseHandle(pi.hProcess);
	return 0;
}
int file_exists(const char* filename){
	FILE *file;
    if ((file = fopen(filename, "r")))
    {
    	
        fclose(file);
        return 1;
    }
    return 0;
}
void LoadFileInResource(int name, int type, DWORD& size, const char*& data)
{
    HMODULE handle = ::GetModuleHandle(NULL);
    HRSRC rc = ::FindResource(handle, MAKEINTRESOURCE(name),
        MAKEINTRESOURCE(type));
    HGLOBAL rcData = ::LoadResource(handle, rc);
    size = ::SizeofResource(handle, rc);
    data = static_cast<const char*>(::LockResource(rcData));
}
std::string ReplaceString(std::string subject, const std::string& search,
                          const std::string& replace) {
    size_t pos = 0;
    while ((pos = subject.find(search, pos)) != std::string::npos) {
         subject.replace(pos, search.length(), replace);
         pos += replace.length();
    }
    return subject;
}
void ReplaceStringInPlace(std::string& subject, const std::string& search,
                          const std::string& replace) {
    size_t pos = 0;
    while ((pos = subject.find(search, pos)) != std::string::npos) {
         subject.replace(pos, search.length(), replace);
         pos += replace.length();
    }
}
BOOL DirectoryExists(LPCTSTR szPath)
{
  DWORD dwAttrib = GetFileAttributes(szPath);

  return (dwAttrib != INVALID_FILE_ATTRIBUTES && 
         (dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}
