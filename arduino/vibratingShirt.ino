/** Pin definition*/
int backLeft = 3;
int backRight = 5;
int bellyLeft = 6;
int bellyRight = 9;
int chestLeft = 10;
int chestRight = 11;

/** Int to control more than one pin */
int all = 0; //control every pins
int left = 1; //control the left side pins
int right = 2; //control the right side pins

void setup()
{
  pinMode(backLeft, OUTPUT);  
  pinMode(backRight, OUTPUT);  
  pinMode(bellyLeft, OUTPUT);  
  pinMode(bellyRight, OUTPUT);  
  pinMode(chestLeft, OUTPUT);  
  pinMode(chestRight, OUTPUT);  

  Serial.begin(9600);
  setVibration(all, 0);
}

String buffer = "";
int pin = all;
int vibration = 0;
 
void loop()
{
  if(Serial.available() > 0)     
  {
    char letter = (char)Serial.read();
    if(letter == 'P')
    {
      buffer = "";
    }
    else if(letter == 'V')
    {
      pin = buffer.toInt();
      buffer = "";
      
    }
    else if(letter == 'E')
    {
      vibration = buffer.toInt();
      buffer = "";
      setVibration(pin, vibration);
    }
    else
    {
      buffer += letter;
    }
  }
}
 
void setVibration(int pin, int vibration)
{
  if(pin == all) {
    analogWrite(backLeft, vibration); 
    analogWrite(backRight, vibration); 
    analogWrite(bellyLeft, vibration); 
    analogWrite(bellyRight, vibration); 
    analogWrite(chestLeft, vibration); 
    analogWrite(chestRight, vibration); 
  }
  else if(pin == left) 
  {
    analogWrite(backLeft, vibration); 
    analogWrite(bellyLeft, vibration);
    analogWrite(chestLeft, vibration); 
  }
  else if(pin == right) 
  {
    analogWrite(backRight, vibration); 
    analogWrite(bellyRight, vibration); 
    analogWrite(chestRight, vibration);  
  }
  else 
  {
    analogWrite(pin, vibration); 
  }
}
