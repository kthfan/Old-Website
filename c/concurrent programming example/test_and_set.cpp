#include <stdio.h>

bool test_and_set(bool *target){
  bool rv = *target;
  *target= true;
  return rv ;
}

int main() {
  bool lock = true;
  printf("lock==true, ret: %i, lock: %i\n",
    test_and_set(&lock), lock);
  lock = false;
  printf("lock==false, ret: %i, lock: %i\n",
    test_and_set(&lock), lock);
  return 0;
}