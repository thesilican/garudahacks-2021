#include <Arduino.h>
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
const int switchPin = 6;
int switchState = 0;
int prevSwitchState = 0;
int reply;

void setup()
{
  Serial.begin(9600);
  lcd.begin(16, 2);
  pinMode(switchPin, INPUT);
  lcd.print("Ask me a question?");
}

void loop()
{
  String input{};
  Serial.println("time");
  input =Serial.readStringUntil('\n');
  lcd.clear();
  lcd.print(input);
  delay(500);
}
// Serial.println("Hi Brian");

// delay(500);
// if (Serial.available() != 0){
//   input = Serial.readStringUntil('\n');
// }else {
//   input = "null";
// }
// Serial.println(input);

// put your main code here, to run repeatedly:
