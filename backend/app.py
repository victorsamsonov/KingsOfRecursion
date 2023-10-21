from PIL import Image
import requests
from transformers import AutoProcessor, BlipModel
import requests
import json
import assemblyai as aai
# from utils import identify_learning_style_and_hobby, speech_to_text, get_gpt_response, text_to_voice, extract_image_content
import os
import base64
import wave
import io
# API
from flask import Flask, request, jsonify
# SETTING UP API KEYS
aai.settings.api_key = f"0831fea3924f4be890a69c8aef4b2528"

###################################

api = Flask(__name__)

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

if __name__ == '__main__':
    api.run(debug=True)