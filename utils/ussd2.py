# Your code goes here
from flask import Flask, request
import os
import requests

app = Flask(__name__)

response = ""

@app.route('/', methods=['POST', 'GET'])
def ussd_callback():
  global response
  session_id = request.values.get("sessionId", "mustafae3d")
  service_code = request.values.get("serviceCode", "*384*14636#")
  phone_number = request.values.get("phoneNumber", "+250798976697")
  text = request.values.get("text", "default")
#   x = requests.get('https://fakestoreapi.com/users')

  if text == '':
    response  = " Welcome to WorkID!\n"
    response += "1. Register as Worker\n"
    response += "2. Register as Employer\n"
    response += "3. Login\n"
    response += "4. About Us"
    # response += "3." + x.text[0]
  elif text == '1':
    response = "Worker Registration \n"
    balance  += "Enter your Phone number"
  elif text == '2':
    response = "Enter your primary skill\n"
    response += "1. Domestic Work\n"
    response += "2. Construction\n"
    response += "3. Gardening\n"
    response += "4. Driving\n"
    response += "5. Market Vendor\n"
    response += "6. More..."
  elif text == '1*2':
    balance  = "Enter your location\n"
    balance  += "1. Nairobi\n"
    balance  += "2. Mombasa\n"
    balance  += "4. Other\n"
  elif text == '2*2':
    balance  = "Enter city name"
  elif text == '2*2':
    balance  = "Enter your mobile money number"
  elif text == '2*2':
    balance  = "Enter your mobile money number"
  elif text == '2*2':
    balance  = "Confirm PIN"
  elif text == '2*2':
    balance  = "Registration successful!\n"
    balance  += "Your WorkID is: WK12345\n"
    balance  += "Remember this ID for login.\n"
    balance  += "1. Main Menu\n"
    balance  += "2. Exit\n"
# ================================================================
  elif text == '3':
    balance  = "Enter your WorkID"
  elif text == '3':
    balance  = "Enter PIN:"
# ================================================================
  elif text == '3':
    balance  = "Enter PIN:"
  return response
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=os.environ.get('PORT'))