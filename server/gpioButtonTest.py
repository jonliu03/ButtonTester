from time import sleep           # Allows us to call the sleep function to slow down our loop
import RPi.GPIO as GPIO           # Allows us to call our GPIO pins and names it just GPIO
import requests
GPIO.setmode(GPIO.BCM)           # Set's GPIO pins to BCM GPIO numbering

buttonMapping = {'DayWeekMonth': 4, 'Confirm': 21, 'TimeAudio':16, 'TitleAudio': 25, 'DELete': 22, 'SElect': 23 }
for buttonId in buttonMapping:
    GPIO.setup(buttonMapping[buttonId], GPIO.IN)


# For the rotary switch (knob):
clk = 17  # Clock pin
dt = 18   # Data pin
# Setup rotary encoder pins
GPIO.setup(clk, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(dt, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
clkLastState = GPIO.input(clk)
counter = 0

server_address = 'http://localhost:3000/api/button_press'

def send_api_request(buttonId):
    url = "http://localhost:3000/api/button_press"
    payload = {"buttonNumber": f"{buttonId}"}  # Modify payload as needed
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("API request sent successfully")
        else:
            print(f"Failed to send API request. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error occurred: {e}")

while True: 
    for buttonId, buttonPin in buttonMapping.items():
        if buttonId != 'SElect' and GPIO.input(buttonPin):
            if buttonId == 'TimeAudio' or buttonId == 'TitleAudio':
                print(buttonId)
                send_api_request(f"{buttonId}Start")
            while GPIO.input(buttonPin):
                sleep(0.05)
            print(buttonId)                                                                                                                                                   
            send_api_request(buttonId)
        elif buttonId == 'SElect' and not GPIO.input(buttonPin):
            while not GPIO.input(buttonPin):
                sleep(0.05)
            print(buttonId)
            send_api_request(buttonId)
    clkState = GPIO.input(clk)
    dtState = GPIO.input(dt)
    if clkState != clkLastState:
        if dtState != clkState:
            counter = (counter + 1) % 2
            if counter == 0:
                print("Clockwise")
                send_api_request("rightKnob")
        else:
            counter = (counter - 1) % 2
            if counter == 0:
                print("CounterClockwise")
                send_api_request("leftKnob")
        clkLastState = clkState
    sleep(0.00001)
