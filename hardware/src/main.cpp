#include <Arduino.h>
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
const int switchPin = 6;
int switchState = 0;
int prevSwitchState = 0;
int reply;
int displayView = 0;
int tick = 0;

//Requested variables
int LEDstate = 0;
String xpString = "null";
String reqxpString = "null";
String reqDate = "null";
String reqTime = "null";
String reqEcoscore = "null";

/*To display:
Expiring:
Scroll through "item_name (expiry_date) * " 

Date
Time

Eco score!
#Here
*/

void setup()
{
  Serial.begin(9600);
  lcd.begin(16, 2);
  pinMode(switchPin, INPUT);
  pinMode(10, OUTPUT); //Red LED
  pinMode(9,OUTPUT); //Yellow LED 
  pinMode(8,OUTPUT); //Green LED 
  pinMode(7,INPUT); //Button
  digitalWrite(10, LOW); 
  digitalWrite(9, LOW); 
  digitalWrite(8, LOW);
}

void loop(){
  //DISPLAY VIEWS
    if (displayView == 0){ 
      //expiry items View
      if (reqxpString != xpString){
        xpString = reqxpString;
        lcd.clear();
        lcd.print("Expiry Items");
        lcd.setCursor(0,1);
        lcd.print(xpString);
      }else if(tick == 500 || tick == 1000 || tick == 1500){
        lcd.scrollDisplayLeft();
      }
      //if string at any point differs, print new string and reset
      //if not, scroll every 500th tick
    }else if(displayView == 1){
      //date and time view
      lcd.clear();
      lcd.print(reqDate);
      lcd.setCursor(0,1);
      lcd.print(reqTime);
      
    }else if(displayView == 2){
      //show eco score
      lcd.clear();
      lcd.print("Eco Score:");
      lcd.setCursor(0,1);
      lcd.print(reqEcoscore);
    }
  //LEDS
    if (LEDstate == 1){
      digitalWrite(10,LOW);
      digitalWrite(9,LOW);
      digitalWrite(8,HIGH);
    }else if (LEDstate == 2){
      digitalWrite(10,LOW);
      digitalWrite(9,HIGH);
      digitalWrite(8,LOW);
    }else if (LEDstate ==3) {
      digitalWrite(10,HIGH);
      digitalWrite(9,LOW);
      digitalWrite(8,LOW);
    }
  //if button press, switch display view
  switchState = digitalRead(7);
  if (switchState == 1){
    ++ displayView;
    lcd.clear();
  }

  delay(1);
  ++tick;
  //req all info and resets every 2 sec
  if (tick > 2000){
    Serial.println("get.reqxpString");
    reqxpString = Serial.readStringUntil('\n');
    Serial.println("get.reqDate");
    reqDate = Serial.readStringUntil ('\n');
    Serial.println("get.reqTime"); // only Hrs and Min
    reqTime = Serial.readStringUntil ('\n');
    Serial.println("get.reqEcoScore");
    reqEcoscore = Serial.readStringUntil ('\n');
    tick = 0;
  }
  // String input{};
  // input = Serial.readStringUntil('\n');
  
  // lcd.print(input);
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
