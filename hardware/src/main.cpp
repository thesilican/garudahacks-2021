#include <Arduino.h>

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.setTimeout(5000);
  // Serial.println("0");
}

void loop() {
  String input{};
  
  // Serial.println("Hi Brian");
  delay(500);
  if (Serial.available() != 0){
    input = Serial.readStringUntil('\n');
  }else {
    input = "null";
  }
  Serial.println(input);
  
  // put your main code here, to run repeatedly:
}