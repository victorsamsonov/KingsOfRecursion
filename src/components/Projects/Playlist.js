import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import ReactLoading from "react-loading";
import {
  PlaylistObjectContext,
  UserPreferanceContext,
} from "../../PlaylistContext";
import {
  AiFillAudio,
  AiOutlineCaretRight,
  AiOutlineFileAdd,
} from "react-icons/ai";
import Latex from "react-latex-next";

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
  const [chatbotHistory, setChatbotHistory] = useState([
    <div className="bot-container">
      <text className="bot-text">
        Hello, I am EffiSTEM, a SOTA STEM Large Language Model. I will answer
        questions based on the playlist and/or notes you uploaded 🤩
      </text>
    </div>,
  ]);

  const [playlistURL, setPlaylistURL] = useState("");
  // const { contextValue, updateContextValue } = useContext(ObjectProvider);
  const { contextValue, updateContextValue } = useContext(
    PlaylistObjectContext
  );
  const { userPreferance, setUserPreferance } = useContext(
    UserPreferanceContext
  );
  // const [playlistObject, ]
  const handleURLChange = (event) => {
    console.log("hello");
    console.log(event.target.value);
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
        setPrompt(response.data.transcript);
      })
      .catch((error) => {
        console.error("Failed to upload Blob data to Flask:", error);
        setProcessing(false);
        // Handle error
      });
  }

  useEffect(() => {
    let keys = Object.keys(contextValue);
    if (keys.length !== 0) {
      setCurrentVideoKey(keys[0]);
    }
  }, []);

  const useChatbot = () => {
    axios.put();
  };

  const onStop = (audioData) => {
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

  const addUserChat = () => {
    console.log(prompt);
    const newMessage = (
      <div className="user-container">
        <text className="user-text">{prompt}</text>
      </div>
    );
    setChatbotHistory((prevHistory) => [...prevHistory, newMessage]);
  };

  const addBotChat = (out) => {
    console.log(prompt);
    const newMessage = (
      <div className="bot-container">
        <text className="bot-text">
          {" "}
          <Latex>{out}</Latex>
        </text>
      </div>
    );
    setChatbotHistory((prevHistory) => [...prevHistory, newMessage]);
  };

  const handleChatbot = async (e) => {
    e.preventDefault();
    addUserChat();
    setPrompt("");
    try {
      const response = await axios.post("/chatbot", {
        prompt: prompt,
        user_style: userPreferance,
      });
      console.log(response);
      addBotChat(response.data.out);
      // setResult(response.data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function renderIframesFromObject(obj) {
    const iframeKeys = Object.keys(obj);
    console.log(obj);
    return (
      <>
        <h1 style={{ color: "white" }}>Playlist 1</h1>
        <div className="iframe-slider">
          {iframeKeys.map((key, index) => (
            <div>
              <text>Video {index + 1}</text>
              <img
                src={`https://img.youtube.com/vi/${key}/maxresdefault.jpg`}
                className="img-playlist"
                onClick={() => {
                  setCurrentVideoKey(key);
                }}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const iframeLoaded = useRef(false); // To track if the iframe has loaded

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
        <div className="playlist-page-container">
          <Row
            style={{
              justifyContent: "center",
              width: "55%",
            }}
          >
            <div>
              {Object.keys(contextValue).length !== 0 ? (
                <>
                  <div className="video-container">
                    {renderIframesFromObject(contextValue)}
                  </div>
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
                </>
              ) : (
                <>
                  <h1 style={{ textAlign: "center", color: "black" }}>
                    Add a playlist
                  </h1>
                </>
              )}
            </div>
          </Row>
          <Row
            style={{
              justifyContent: "center",
              width: "37.5%",
            }}
            className="chatbot-container"
          >
            <h1 className="record-title" style={{ color: "black" }}>
              Chatbot
            </h1>
            <div className="chatbot-chat-container">{chatbotHistory}</div>

            {/* {processing === true ? (
              <div className="audio-recorder-container">
                <ReactLoading type="bars" color="#A2FF86" className="loader" />
              </div>
            ) : (
              <div className="no-loader"></div>
            )} */}
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
            <div className="bottom-section-chatbot">
              <textarea
                className="chatbot-input"
                value={prompt}
                onChange={handleTextChange}
              />
              {isRecording === RecordState.START ? (
                <AiFillAudio
                  color="red"
                  className="audio-record"
                  width={100}
                  height={100}
                  onClick={stopRecording}
                />
              ) : (
                <AiFillAudio
                  color="white"
                  className="audio-record"
                  width={100}
                  height={100}
                  onClick={startRecording}
                />
              )}
              <AiOutlineCaretRight
                color="white"
                className="audio-record"
                width={100}
                height={100}
                onClick={handleChatbot}
              />
              {isRecording === RecordState.START && processing !== true ? (
                <ReactLoading
                  type="bars"
                  color="#A2FF86"
                  width={100}
                  height={100}
                  className="audio-record-animation"
                />
              ) : (
                <></>
              )}
              {processing === true ? (
                <ReactLoading
                  type="spin"
                  color="#A2FF86"
                  width={100}
                  height={100}
                  className="audio-record-animation"
                />
              ) : (
                <></>
              )}
            </div>
          </Row>
        </div>

        {/* <ReactLoading type="bars" color="#a317a3" className="loader" /> */}
      </Container>
      <button
        onClick={() => {
          console.log(userPreferance);
        }}
      ></button>
    </section>
  );
}

export default PlaylistPage;
