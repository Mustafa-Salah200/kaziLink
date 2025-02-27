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
  service_code = request.values.get("serviceCode", "*384*98332#")
  phone_number = request.values.get("phoneNumber", "+250798976697")
  text = request.values.get("text", "default")
#   x = requests.get('https://fakestoreapi.com/users')

  if text == '':
    response  = "CON What would you want to check \n"
    response += "1. My Account \n"
    response += "2. My phone number"
    # response += "3." + x.text[0]
  elif text == '1':
    response = "CON Choose account information you want to view \n"
    response += "1. Account number \n"
    response += "2. Account balance"
  elif text == '1*2':
    balance  = "KES 10,000"
    response = "END Your balance is " + balance
  elif text == '2':
    response = "END This is your phone number " + phone_number
  return response
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=os.environ.get('PORT'))