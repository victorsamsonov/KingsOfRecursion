from PIL import Image
import requests
from transformers import AutoProcessor, BlipModel
import requests
import json
import assemblyai as aai
import time
# from utils import identify_learning_style_and_hobby, speech_to_text, get_gpt_response, text_to_voice, extract_image_content
import os
import base64
import wave
import io
# API
from flask import Flask, request, jsonify
from streaming.camera import VideoCamera
from flask import Flask, Response
import numpy as np

import tensorflow as tf
# SETTING UP API KEYS
api = Flask(__name__)
aai.settings.api_key = f"0831fea3924f4be890a69c8aef4b2528"

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
from pytube import Playlist
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
  for p in playlist:  
    print(p)
    to_add = p.split("watch?v=")[-1]
    print(to_add)
    out.append(to_add)
  return out


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
  ids = get_ids(videos)
  return ids_transcription(ids), ids


@api.route('/playlist', methods=['POST'])
def playlist():
    data = request.get_json()
    playlist_url = data.get('text')
    print(data)
    print("hello")
    print(playlist_url)
    text_dict, ids = main(playlist_url)
    return jsonify({'text_dict':text_dict, "ids": ids })



if __name__ == '__main__':
    api.run(debug=True)
    