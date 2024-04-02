from time import sleep           # Allows us to call the sleep function to slow down our loop
import RPi.GPIO as GPIO           # Allows us to call our GPIO pins and names it just GPIO
import requests
GPIO.setmode(GPIO.BCM)           # Set's GPIO pins to BCM GPIO numbering
DayWeekMonth = 4           # Sets our input pin, in this example I'm connecting our button to pin 4. Pin 0 is the SDA pin so I avoid using it for sensors/buttons
Confirm = 21
TimeAudio = 16
TitleAudio = 25
DELete = 22
SELect = 23
GPIO.setup(DayWeekMonth, GPIO.IN)           # Set our input pin to be an input
GPIO.setup(Confirm, GPIO.IN)
GPIO.setup(TimeAudio, GPIO.IN)
GPIO.setup(TitleAudio, GPIO.IN)
GPIO.setup(DELete, GPIO.IN)
GPIO.setup(SELect, GPIO.IN)
server_address = 'http://localhost:3000/api/button_press'

def send_api_request():
    url = "http://localhost:3000/api/button_press"
    payload = {"buttonNumber": "dayweekmonth button pressed. (it works)"}  # Modify payload as needed
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("API request sent successfully")
        else:
            print(f"Failed to send API request. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error occurred: {e}")
# Start a loop that never ends
while True: 
     if (GPIO.input(DayWeekMonth) == True): # Physically read the pin now
          print('DayWeekMonth')
          send_api_request()
          
     sleep(0.1)