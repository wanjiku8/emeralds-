from flask import Flask, request, jsonify
from flask_cors import  cross_origin,CORS

import smtplib
from email.message import EmailMessage
import json

from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()

# use OSM for maps
import folium

app = Flask(__name__)
CORS(app)
@app.get('/')
def show_home():
  return jsonify({"message":"welcome"}),200

@app.route("/send_email", methods=["POST"])
@cross_origin()
def send_email():
    """
    {
    data: example
    message:str
    name:str
    email:str
    }
    """
    email = os.getenv('email')
    email_key = os.getenv('email_key')
    receiver_email = os.getenv('receiver_email')
    data =request.get_json()
    print(data)
    subject = f"Eventify Feedback - {datetime.now()}"
    message = f'{data["message"]}\n\nFrom {data["name"]} - {data["email"]}'

    mailer = smtplib.SMTP('smtp.elasticemail.com',2525)
    mailer.ehlo()
    mailer.starttls() 

    print(email,email_key)
    mailer.login(f'{email}',f'{email_key}')

    msg = EmailMessage()
    msg['Subject'] = subject 
    msg['From'] = f'Newsletter <{email}>'
    msg['To'] = [f'{receiver_email}']  
    msg.set_content(f'{message}')

    mailer.send_message(msg)
    mailer.quit()

    return {"status": "success"}

#map location
def generate_map_html(start_lat, start_lon, end_lat, end_lon):

    # Create the map
    my_map = folium.Map(location=[(start_lat+end_lat)/2,
                                  (start_lon+end_lon)/2], zoom_start=5)

    # Add start and end location markers
    folium.Marker([start_lat, start_lon], popup='Start').add_to(my_map)
    folium.Marker([end_lat, end_lon], popup='End').add_to(my_map)  

    # Connect markers with polyline
    line = folium.PolyLine(locations=[[start_lat, start_lon], [end_lat, end_lon]])
    my_map.add_child(line)

    # Get map HTML
    map_html = '''
        <html>
        <head>
        <title>My Map</title>
        </head>
        <body>'''+my_map.get_root()._repr_html_()+'''
        </body>
        </html>
        '''

    return map_html

@app.post('/locate')
@cross_origin()
def locate():
    """
    required json data
    {
        latitude: str,
        longitude: str,
    }
    """
    data :dict = request.get_json()
    #coords to the start point
    latitude = data['latitude']
    longitude = data['longitude']
    #fixed end point values
    end_lat = -1.276702
    end_long = 36.811468
    #call the OSM mapping function here
    
    return jsonify({"message":{
        "location":generate_map_html(latitude,longitude,end_lat,end_long)
        }})
@app.get('/categories')
@cross_origin()
def show_data():
    with open("./file-mappings.json") as file:
        data = json.load(file)
    
    return jsonify({"data":data})
if __name__ == "__main__":
    app.run(host='0.0.0.0')
