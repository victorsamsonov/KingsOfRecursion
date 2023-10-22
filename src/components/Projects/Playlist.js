
import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import ReactLoading from "react-loading";
import PlaylistObjectContext from "../../PlaylistContext";
import html2canvas from "html2canvas";
const MicRecorder = require("mic-recorder-to-mp3");

function PlaylistPage() {
  const [currentRecording, setCurrentRecording] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(null);
  const [isPredict, setIsPredict] = useState(false);
  const [currFiles, setCurrFiles] = useState(null);
  const [loadChat, setLoadChat] = useState(false);
  const [received, setReceived] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [videoStream, setVideoStream] = useState("");
  const [currentVideoKey, setCurrentVideoKey] = useState("");
  const [playlistURL, setPlaylistURL] = useState("");
  const { contextValue, updateContextValue } = useContext(PlaylistObjectContext);
  const iframeRef = useRef(null);
  const screenshotRef = useRef(null);
  const canvasRef = useRef(null);
  const iframeLoaded = useRef(false);


  const captureScreenshot = () => {
    if (iframeRef.current && screenshotRef.current) {
      const iframe = iframeRef.current;
      const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
      
      html2canvas(iframeContent.body, { useCORS: true }).then((canvas) => {
        const screenshotDataURL = canvas.toDataURL("image/png");
        screenshotRef.current.src = screenshotDataURL;
      });
  
      console.log("Screenshot captured!"); // Add this line for debugging
    }
  };


  <button onClick={captureScreenshot} className="screenshot-button">
    Capture Screenshot
  </button>

  useEffect(() => {
    captureScreenshot();
  }, []);

  const handleURLChange = (event) => {
    setPlaylistURL(event.target.value);
  };

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

    axios
      .post("/save-recording", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setProcessing(false);
      })
      .catch((error) => {
        console.error("Failed to upload Blob data to Flask:", error);
        setProcessing(false);
      });
  }

  useEffect(() => {
    let keys = Object.keys(contextValue);
    if (keys.length !== 0) {
      setCurrentVideoKey(keys[0]);
    }
  }, []);

  const onStop = (audioData) => {
    setCurrentRecording(audioData);
    downloadAudioBlob(audioData);
    let pred = audioData !== null && currFiles !== null ? true : false;
    setIsPredict(pred);
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

    setProcessing(true);
    setLoadChat(true);
  };

  const handleTextChange = (event) => {
    setPrompt(event.target.value);
  };

  const handlePlaylistURL = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/playlist", { text: playlistURL });
      console.log(response.data);
      updateContextValue(response.data.text_dict);
      const keys = Object.keys(response.data.text_dict);
      setCurrentVideoKey(keys[0]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderIframesFromObject = (obj) => {
    const iframeKeys = Object.keys(obj);

    return (
      <div className="iframe-slider">
        {iframeKeys.map((key) => (
          <img
            src={`https://img.youtube.com/vi/${key}/maxresdefault.jpg`}
            className="img-playlist"
            onClick={() => {
              setCurrentVideoKey(key);
            }}
          />
        ))}
      </div>
    );
  };

  const captureVideoFrame = () => {
    var browser = document.querySelector("iframe");
    var request = browser.getScreenshot(100, 100);
    request.onsuccess = function () {
      var blob = request.result;
      var url = URL.createObjectURL(blob);
    };
    console.log("hello");
  };

  const handleIframeLoad = () => {
    iframeLoaded.current = true;
  };

  return (
    <section>
      <Container fluid className="project-section">
        <h1 className="playlist-header">Current Playlist</h1>
        <Container>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {Object.keys(contextValue).length !== 0 ? (
              <>
                <div>{renderIframesFromObject(contextValue)}</div>
                <iframe
                  ref={iframeRef}
                  className="main-video"
                  src={`https://www.youtube.com/embed/${currentVideoKey}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media;fullscreen"
                  allowFullScreen={true}
                  title="video"
                  width="500"
                  height="380"
                  onLoad={handleIframeLoad}
                />
                <button onClick={captureVideoFrame}>Capture Frame</button>
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width="560"
                  height="315"
                />
              </>
            ) : (
              <></>
            )}
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
        </Container>
      </Container>
      <input
        type="text"
        id="textInput"
        value={playlistURL}
        onChange={handleURLChange}
      />
      <button onClick={handlePlaylistURL}>Submit</button>
  
      {/* "Capture Screenshot" button placed here */}
      <button onClick={captureScreenshot} className="screenshot-button">
        Capture Screenshot
      </button>
    </section>
  );
  
 }   

export default PlaylistPage;