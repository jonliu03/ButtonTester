import keyboard
import requests

def send_api_request():
    url = "http://localhost:3000/api/button_press"
    payload = {"buttonNumber": "select"}  # Modify payload as needed
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("API request sent successfully")
        else:
            print(f"Failed to send API request. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error occurred: {e}")

def on_key_press(event):
    if event.name == 'space':
        print('Right key pressed')
        send_api_request()

keyboard.on_press(on_key_press)

try:
    # Keep the script running
    keyboard.wait('esc')  # Wait until the user presses the 'esc' key to exit
except KeyboardInterrupt:
    pass
finally:
    keyboard.unhook_all()  # Cleanup before exiting
