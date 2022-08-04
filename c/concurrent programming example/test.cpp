#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>
#include <unistd.h>

//全域性變數
int var = 100;

//執行緒主控函式
void *tfn(void *arg) {
		
        //修改全域性變數var的值
        var = 200;
        printf(" create thread succesful\n");
        return NULL;
}

int main(void) {
        //主控執行緒第一次列印var
        printf("before pthread_create var = %d\n", var);
        pthread_t tid;
        pthread_create(&tid, NULL, tfn, NULL);
        sleep(1);
        //主控執行緒再次列印var
        printf("after pthread_create, var = %d\n", var);
        return 0;
}
