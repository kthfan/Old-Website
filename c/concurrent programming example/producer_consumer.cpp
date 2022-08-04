#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

#define BUFFER_SIZE 10

typedef void* (*fptr)(void*);

int counter = 0;
int buffer[BUFFER_SIZE];

void sleep_4_times(){
  sleep(0.5);
  sleep(0.5);
  sleep(0.5);
  sleep(0.5);
}

void* producer(const void* data) {
  char *str = (char*) data;
  int next_produced = 0;
  int rcd;
  int in = 0;
  while(true){
      while(counter == BUFFER_SIZE);
      
      next_produced++; 

      buffer[in] = next_produced;
      in = (in + 1) % BUFFER_SIZE;
      
      rcd = counter;
      counter++;
      rcd++;
      printf("producer: %i, equ:%i\n",next_produced,rcd==counter);
      sleep_4_times();
      sleep(0.5);
  }
  pthread_exit(NULL);
}
void* consumer(const void* data) {
  char *str = (char*) data;
  int next_consumed;
  int rcd;
  int out = 0;
  while(true){
      while(counter == 0);
      next_consumed = buffer[out];
      out = (out + 1) % BUFFER_SIZE;
      
      rcd = counter;
      counter--;
      rcd--;
      
      sleep(0.5);
      printf("consumer: %i, equ:%i\n",next_consumed,rcd==counter); 
      sleep_4_times();

  }
  pthread_exit(NULL);
}


int main() {
  pthread_t t_pro;
  pthread_t t_con;
  pthread_create(&t_pro, NULL, (fptr)producer, (void*)"producer");
  pthread_create(&t_con, NULL, (fptr)consumer, (void*)"consumer");

  
  pthread_join(t_pro, NULL);
  pthread_join(t_con, NULL); 
  return 0;
}