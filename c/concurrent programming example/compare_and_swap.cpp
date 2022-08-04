#include <stdio.h>

int compare_and_swap(int *value, int expected, int new_value){
  int tmp = *value;
  if(*value == expected)
    *value = new_value;
  return tmp;
}

int main() {
  int lock = 0;
  printf("0,1,0, ret: %i, lock: %i\n",
    compare_and_swap(&lock, 1, 0), lock);
  lock = 0;
  printf("0,1,0, ret: %i, lock: %i\n",
    compare_and_swap(&lock, 0, 1), lock);
  lock = 0;
  printf("0,1,0, ret: %i, lock: %i\n",
    compare_and_swap(&lock, 1, 1), lock);
  lock = 0;
  printf("0,1,0, ret: %i, lock: %i\n",
    compare_and_swap(&lock, 0, 0), lock);
  return 0;
}