

#include <windows.h>
char szAppName[14] = "qm";
STARTUPINFO si;
PROCESS_INFORMATION pi;


int WINAPI WinMain (HINSTANCE hThisInstance,
	HINSTANCE hPrevInstance,
	LPSTR lpszArgument,
	int nCmdShow)
{
	
	HWND hwnd;               /* This is the handle for our window */
	MSG messages;            /* Here messages to the application are saved */
	WNDCLASSEX wincl;        /* Data structure for the windowclass */

	/* The Window structure */
	wincl.hInstance = hThisInstance;
	wincl.lpszClassName = szAppName;
	wincl.lpfnWndProc = NULL;      /* This function is called by windows */
	wincl.style = CS_DBLCLKS;                 /* Catch double-clicks */
	wincl.cbSize = sizeof (WNDCLASSEX);

	/* Use default icon and mouse-pointer */
	wincl.hIcon = LoadIcon (NULL, "AppIcon");
	wincl.hIconSm = LoadIcon (hThisInstance, "AppIcon");
	wincl.hCursor = LoadCursor (NULL, IDC_ARROW);
	wincl.lpszMenuName = NULL;                 /*menu */
	wincl.cbClsExtra = 0;                      /* No extra bytes after the window class */
	wincl.cbWndExtra = 0;                      /* structure or the window instance */
	/* Use Windows's default colour as the background of the window */
	wincl.hbrBackground = (HBRUSH) COLOR_BACKGROUND;

	/* Register the window class, and if it fails quit the program */
	if (!RegisterClassEx (&wincl))
		return 0;
		
	ZeroMemory( &si, sizeof(si) );
	si.cb = sizeof(si);
	ZeroMemory( &pi, sizeof(pi) );
	
	if( !CreateProcess( NULL,"jre7\\bin\\java.exe -jar class.zip",NULL, NULL, FALSE, CREATE_NO_WINDOW ,NULL,NULL, &si,&pi ) ) 
		MessageBox(0,"Unable to open the program.","Error",MB_OK);
	WaitForSingleObject( pi.hProcess, INFINITE ) ;

	return 0;
}
