import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import ReactLoading from "react-loading";

const MicRecorder = require("mic-recorder-to-mp3");
function Projects() {
  const [currentRecording, setCurrentRecording] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(null);
  const [isPredict, setIsPredict] = useState(false);
  const [currFiles, setCurrFiles] = useState(null);
  const [loadChat, setLoadChat] = useState(false);
  const [received, setReceived] = useState(false);
  const [prompt, setPrompt] = useState("");

  const test = () => {
    axios
      .get("/save-recording")
      .then((response) => {
        console.log("response: " + response.data.out);
      })
      .catch((error) => console.log(error));
  };

  function downloadAudioBlob(audioBlob) {
    const blobData = audioBlob;
    setProcessing(true);
    const formData = new FormData();
    formData.append("audio", blobData.blob, "audio.wav");
    // Send the Blob data to your Flask backend using Axios
    axios
      .post("/save-recording", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to set the content type
        },
      })
      .then((response) => {
        console.log(response);
        setProcessing(false);
      })
      .catch((error) => {
        console.error("Failed to upload Blob data to Flask:", error);
        setProcessing(false);
        // Handle error
      });
  }

  const onStop = (audioData) => {
    // console.log("audioData", audioData);
    setCurrentRecording(audioData);
    downloadAudioBlob(audioData);
    let pred = audioData !== null && currFiles !== null ? true : false;
    console.log(audioData);
    console.log(currFiles);
    console.log("pred");
    console.log(pred);
    setIsPredict(pred);
    // transcribe();
  };

  const startRecording = async () => {
    try {
      setIsRecording(RecordState.START);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(RecordState.STOP);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const predict = async () => {
    const formData = new FormData();
    formData.append("audio", currentRecording.blob, "audio.wav");
    formData.append("file", currFiles[0]);
    console.log("predict");
    setProcessing(true);
    setLoadChat(true);
    // await axios
    //   .post("/predict", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data", // Make sure to set the content type
    //     },
    //   })
    //   .then((response) => {
    //     setProcessing(false);
    //     setReceived(true);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to upload Blob data to Flask:", error);
    //     setProcessing(false);
    //     // Handle error
    //   });
    // await obtainLLMResponse();
  };

  const handleTextChange = (event) => {
    setPrompt(event.target.value);
  };

  return (
    <section>
      <Container fluid className="project-section">
        <Container>
          <h1 className="project-heading">
            My Recent <strong className="green">Works </strong>
          </h1>
          <p style={{ color: "white" }}>
            Here are a few projects I've worked on recently.
          </p>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            <h1 className="record-title">Audio Recorder</h1>
            {isRecording == RecordState.START ? (
              <>
                <button className="recording-button" onClick={stopRecording}>
                  Stop Recording
                </button>
                <button className="predict-button" disabled={!isPredict}>
                  Predict
                </button>
              </>
            ) : (
              <>
                <button className="recording-button" onClick={startRecording}>
                  Start Recording
                </button>
                <button
                  className="predict-button"
                  disabled={!isPredict}
                  onClick={predict}
                >
                  Get Answer
                </button>
              </>
            )}
            {processing === true ? (
              <div className="audio-recorder-container">
                <ReactLoading type="bars" color="#A2FF86" className="loader" />
              </div>
            ) : (
              <div className="no-loader"></div>
            )}
            <div className="audio-recorder-container">
              <AudioReactRecorder
                state={isRecording}
                onStop={onStop}
                canvasHeight={"50%"}
                backgroundColor={"white"}
                foregroundColor={"#A2FF86"}
              />
            </div>
            <div />
            <h2 className="text-input-prompt">Your input:</h2>
            <textarea
              id="paragraphInput"
              value={prompt}
              onChange={handleTextChange}
              cols="40"
              rows="5"
            />
          </Row>
          {/* <ReactLoading type="bars" color="#a317a3" className="loader" /> */}
        </Container>
      </Container>
    </section>
  );
}

export default Projects;
