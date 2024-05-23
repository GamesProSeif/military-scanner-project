#define ENA   2          // Enable/speed motors Right        GPIO14(D4)
#define motor2pin2  0          // L298N in1 motors Rightx          GPIO15(D3)
#define motor2pin1  4          // L298N in2 motors Right           GPIO13(D2)
#define motor1pin1  16           // L298N in3 motors Left            GPIO2(D0)
#define motor1pin2  5           // L298N in4 motors Left            GPIO0(D1)
#define echo1 14    //D5
#define trig1 12    //D6
#define trig2 13    //D7
#define echo2 15    //D8

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <ArduinoWebsockets.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include "math.h"
#include "Wire.h"       
#include "I2Cdev.h"     
#include <MPU6050_light.h>

String command;             //String to store app command state.

const char* ssid = "Azmy_EXT";
const char* password = "0re0b0ri0166";
const char* websockets_server_host = "ws://192.168.1.6:8080";
float wheelD = 0.065;
float duration;
float wheelBase = 0.2;
long dur1;
int dist1;
long dur2;
int dist2;
unsigned long lastTime;

float x,y,ang;
float DISTANCE;
float ANGLETURN;

char buf1[100];
char buf2[100];
char buf3[100];

using namespace websockets;
WebsocketsClient client;

// Function to connect to WiFi
void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("Connected!");
}
void onMessage(WebsocketsMessage message) {
  String msg = message.data();
  Serial.println("Received message: " + msg);
  
  if (msg.startsWith("a:")) {
    sendData("a:2");
  } 
  if (msg.startsWith("s:")){
    msg.toCharArray(buf1, 100);
    int s = sscanf(buf1, "s:%f %f %f", &x, &y, &ang);
    if (s == 3) {
      Serial.print("x: ");
      Serial.println(x);
      Serial.print("y: ");
      Serial.println(y);
      Serial.print("angle: ");
      Serial.println(ang);
    } 
    else {
    Serial.println("Failed to parse the string");
    }
  }
  if(msg.startsWith("f:")){
    msg.toCharArray(buf2, 100);
    int f = sscanf(buf2,"f:%f",&DISTANCE);
    if(f==1){
      Serial.print("Distance to move: ");
      Serial.println(DISTANCE);
      goFront(DISTANCE); 
      sendData("ack");       
    }
  }
  if(msg.startsWith("t:")){
    msg.toCharArray(buf3, 100);
    int t = sscanf(buf3,"t:%f",&ANGLETURN);
    if(t==1){
      ang+=ANGLETURN;
      Serial.print("Angle to turn: ");
      Serial.println(ang);
      if(ANGLETURN>0){
        goLeft(ANGLETURN);
      }
      else{
        goRight(ANGLETURN);    
      }
      sendData("ack");
    }
  }
  if(msg.startsWith("d:")){
    char message[100];    
    sprintf(message,"d:%f %f %f %d %d",x,y,ang,dist1,dist2);
    sendData(String(message));
  }
}
// Function to send sensor readings
void sendData(String data) {
    client.send(data);
}
void stopMotors() {
  digitalWrite(motor1pin1, LOW);
  digitalWrite(motor1pin2, LOW);
  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, LOW);
}
int calculateDuration(float angle) {
  float circumference = PI * wheelD;
  float rotationDistance = (angle / 360.0) * (PI * wheelBase);
  float rotations = rotationDistance / circumference;
  // Assuming the motor speed and rotations per second to be constants, 
  // you need to measure this value empirically if needed.
  float timePerRotation = 1000; // time in milliseconds for one wheel rotation (example value)
  int duration = rotations * timePerRotation;
  return duration;
}
void goFront(float distance){
  duration  = (distance/(wheelD*PI)) * 1000;
  digitalWrite(motor1pin1,HIGH);
  digitalWrite(motor1pin2,LOW);
  digitalWrite(motor2pin1,LOW);
  digitalWrite(motor2pin2,HIGH);
  delay(duration-500);
  stopMotors();
  delay(100);
}
void goLeft(float angle){
  int durL = calculateDuration(angle);
  analogWrite(ENA,100);
  digitalWrite(motor1pin1,HIGH);
  digitalWrite(motor1pin2,LOW);
  digitalWrite(motor2pin1,HIGH);
  digitalWrite(motor2pin2,LOW);
  delay(durL+500);
  stopMotors();
  delay(100);
}
void goRight(float angle){
  int durR = calculateDuration(angle);
  analogWrite(ENA,100);
  digitalWrite(motor1pin1,LOW);
  digitalWrite(motor1pin2,HIGH);
  digitalWrite(motor2pin1,LOW);
  digitalWrite(motor2pin2,HIGH);
  delay(durR+500);
  stopMotors();
  delay(100);  
}
void setup() {
  
 pinMode(trig1,OUTPUT);
 pinMode(echo1,INPUT);
 pinMode(trig2,OUTPUT);
 pinMode(echo2,INPUT);
 
 pinMode(ENA, OUTPUT);
 pinMode(motor1pin1, OUTPUT);
 pinMode(motor1pin2, OUTPUT);
 pinMode(motor2pin1, OUTPUT);
 pinMode(motor2pin2, OUTPUT);

  Serial.begin(115200);
  
  connectToWiFi();
  
  // Setup WebSocket events
  client.onMessage(onMessage);
  
  // Connect to WebSocket server
  client.connect(websockets_server_host);
}
void loop() {
  
  analogWrite(ENA,80);  
  // Poll for WebSocket events
  client.poll();
  // Send sensor readings at the specified rate
  digitalWrite(trig1,LOW);  
  delayMicroseconds(2);
  digitalWrite(trig1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig1,LOW);
  dur1=pulseIn(echo1,HIGH);
  dist1=dur1*0.034/2;
  Serial.print("Front: ");
  Serial.println(dist1); 

  digitalWrite(trig2,LOW);  
  delayMicroseconds(2);
  digitalWrite(trig2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig2,LOW);
  dur2=pulseIn(echo2,HIGH);
  dist2=dur2*0.034/2;
  Serial.print("Right: ");
  Serial.println(dist2); 
  
  delay(500);
}