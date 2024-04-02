import RPi.GPIO as GPIO
import requests

# Set up GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# GPIO event handler
def gpio_event(channel):
    try:
        response = requests.post('http://localhost:3000/api/button_press', json={'buttonNumber': 1})
        if response.status_code == 200:
            print("Button press sent successfully")
        else:
            print("Failed to send button press")
    except Exception as e:
        print("Error:", e)

# Register GPIO event
GPIO.add_event_detect(18, GPIO.FALLING, callback=gpio_event, bouncetime=300)

# Keep the script running
try:
    while True:
        pass
except KeyboardInterrupt:
    GPIO.cleanup()
