from PIL import Image
import requests
import requests
import json
import assemblyai as aai
import time
# from utils import identify_learning_style_and_hobby, speech_to_text, get_gpt_response, text_to_voice, extract_image_content
import os
import base64
import wave
import io
import config
import atexit
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech
# API
from flask import Flask, request, jsonify
from flask import Flask, Response
import numpy as np
from chatbot import Chatbot
import tiktoken
from pdf2image import convert_from_path
import matplotlib.pyplot as plt

# SETTING UP API KEYS
api = Flask(__name__)
aai.settings.api_key = f"0831fea3924f4be890a69c8aef4b2528"
APP_ID = "kingsofrecursion_d737ae_3757aa"	

APP_KEY = "9dd7232822a78267bc092094a6290d3984b7883810e73226766246fe8f65b7e5"

CHATBOT = False
def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        # time.sleep(0.1)


# @api.route('/video_feed')
# def video_feed():
#     return Response(gen(VideoCamera()),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

##########################################
@api.route('/save-recording', methods=['POST'])
def save_recording():
    try:
        audio_file = request.files['audio']
        if audio_file:
            # Create a BytesIO object to work with the data
            blob_io = io.BytesIO(audio_file.read())

            # Create a WAV file
            output_wav_file = 'output.wav'  # Replace with your desired output file path
            print("hello")
            with wave.open(output_wav_file, 'wb') as wf:
                wf.setnchannels(1)  # 1 for mono, 2 for stereo
                wf.setsampwidth(2)  # 2 bytes for 16-bit audio, adjust as needed
                wf.setframerate(91000)  # Adjust to your audio sample rate
                wf.writeframes(blob_io.read())

            blob_io.close()
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe("output.wav")   
            print(transcript.text)
            return {"transcript": transcript.text}
        else:
            return 'No audio data received', 400
    except Exception as e:
        return str(e), 500

from youtube_transcript_api import YouTubeTranscriptApi
from pytube import Playlist, YouTube
import re

def get_youtube_playlist_videos(playlist_url):
    try:
        # Create a Playlist object
        playlist = Playlist(playlist_url)
        
        # Initialize the list to store video links
        video_links = []
        
        # Iterate through the videos in the playlist and get their links
        for video in playlist.videos:
            video_links.append(video.watch_url)
        
        return video_links
    except Exception as e:
        return str(e)


def get_ids(playlist):
  out = []
  title = []
  for p in playlist:  
    # print(p)
    to_add = p.split("watch?v=")[-1]
    video_url = f"https://www.youtube.com/watch?v={to_add}"
    yt = YouTube(video_url)

    # Get the video title
    video_title = yt.title
    title.append(video_title)
    # print(to_add)
    out.append(to_add)
  return out, title


def transcriptions_to_text(out):
  i = 0
  for k, v in out.items():
    try:
        with open("./docs/" + f"video_{i+1}" + ".txt", 'w', encoding='utf-8') as file:
            file.write(v)
        print(f"{k} successfuly converted to .txt")
    except Exception as e:
        return str(e)
    i += 1


def ids_transcription(ids):
  out = {id: "" for id in ids}
  for id in ids:
    yt_transcript_api_out = YouTubeTranscriptApi.get_transcript(id)
    curr = ""
    for e in yt_transcript_api_out:
      print(e["text"])
      print(out[id])
      pattern = r'\[.*?\]'
      cleaned_text = re.sub(pattern, "", e["text"])
      curr = curr + " " + cleaned_text
    out[id] = curr
  return out


def main(playlist):
  videos = get_youtube_playlist_videos(playlist)
  ids, titles = get_ids(videos)
  out = ids_transcription(ids), ids, titles
  transcriptions_to_text(out[0])
  return out


@api.route('/playlist', methods=['POST'])
def playlist():
    data = request.get_json()
    playlist_url = data.get('text')
    print(data)
    print("hello")
    print(playlist_url)
    text_dict, ids, titles = main(playlist_url)
    return jsonify({'text_dict':text_dict, "ids": ids, "titles": titles })


def text_to_voice(text):
    """
    Convert the given text to voice using Google's Text-to-Speech API.
    The function currently outputs an MP3 file.
    """
    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    response = client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)

    output_audio_path = "output_voice_response.mp3"
    with open(output_audio_path, 'wb') as out:
        out.write(response.audio_content)
        
    with open(output_audio_path, 'rb') as file:
        wav_data = base64.b64encode(file.read()).decode('utf-8')
    return wav_data


@api.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    prompt = data.get('prompt')
    user_style = data.get("user_style")
    out = CHATBOT.predict(prompt, user_style)
    return jsonify({'out':out})


@api.route('/notes', methods=["POST"])
def notes():
    import requests
    import json
    import time
    pdf_notes = request.files["file"]
    print(pdf_notes)
    if pdf_notes:
        # Save the uploaded PDF file to a specific directory
        pdf_notes.save("curr_pdf.pdf")
    time.sleep(3)
    images = convert_from_path("curr_pdf.pdf")
    print(images)
    for i, image in enumerate(images):
        image.save(os.path.join("./images", f"page_{i + 1}.jpg"), "JPEG")

    out = {}
    for i in range(len(images)):
        r = requests.post("https://api.mathpix.com/v3/text",
        files={"file": open(f"./images/page_{i + 1}.jpg","rb")},
        data={
        "options_json": json.dumps({
            "math_inline_delimiters": ["$", "$"],
            "rm_spaces": True
        })
        },
        headers={
            "app_id": APP_ID,
            "app_key": APP_KEY
        }
        )
        # time.sleep(1)
        text = json.dumps(r.json(), indent=4, sort_keys=True)
        file_name = f"./docs/file{i+1}.txt"
        # Open the file in write mode and write the string to it
        with open(file_name, "w") as file:
            file.write(r.json()["text"])
        out["./images/page_{i + 1}"] = text
    return {"out": "out"}


@api.route('/initllm', methods=['GET'])
def initllm():
    global CHATBOT
    CHATBOT = Chatbot()
    return {'out':"200"} 
#     options = {
#     "conversion_formats": {"docx": True, "tex.zip": True},
#     "math_inline_delimiters": ["$", "$"],
#     "rm_spaces": True
# }
#     r = requests.post("https://api.mathpix.com/v3/pdf",
#     files={"file": open("curr_pdf.pdf","rb")},
#      data={
#         "options_json": json.dumps(options)
#     },
#     headers={
#         "app_id": APP_ID,
#         "app_key": APP_KEY, "Content-type": "application/json"
#     })
#     print(r.text.encode("utf8"))
def cleanup_on_exit():
    # Delete .jpg images in the ./images directory
    for root, dirs, files in os.walk('./images'):
        for file in files:
            if file.endswith('.jpg'):
                file_path = os.path.join(root, file)
                os.remove(file_path)

    # Delete .txt files in the ./docs directory
    for root, dirs, files in os.walk('./docs'):
        for file in files:
            if file.endswith('.txt'):
                file_path = os.path.join(root, file)
                os.remove(file_path)

atexit.register(cleanup_on_exit)
if __name__ == '__main__':
    api.run(debug=True)
    