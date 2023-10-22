import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";
import cheerio from "cheerio";
import ReactAudioPlayer from "react-audio-player";
import ReactLoading from "react-loading";
import {
  PlaylistObjectContext,
  NotesObjectContext,
} from "../../PlaylistContext";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import DragDropFiles from "../Home/DragDropFiles";
import Latex from 'react-latex-next'

function AddPlaylist() {
  const [prompt, setPrompt] = useState("");
  const [currentVideoKey, setCurrentVideoKey] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const history = useNavigate();

  const playlists = [
    <div className="empty-playlist">
      <div className="wrapper-empty-playlist">
        <text>Playlist 1</text>
        <AiOutlineFileAdd className="playlist-icon" />
      </div>
    </div>,
    <div className="empty-playlist">
      <div className="wrapper-empty-playlist">
        <text>Playlist 2</text>
        <AiOutlineFileAdd className="playlist-icon" />
      </div>
    </div>,
    <div className="empty-playlist">
      <div className="wrapper-empty-playlist">
        <text>Playlist 3</text>
        <AiOutlineFileAdd className="playlist-icon" />
      </div>
    </div>,
    <div className="empty-playlist">
      <div className="wrapper-empty-playlist">
        <text>Playlist 4</text>
        <AiOutlineFileAdd className="playlist-icon" />
      </div>
    </div>,
    <div className="empty-playlist">
      <div className="wrapper-empty-playlist">
        <text>Playlist 5</text>
        <AiOutlineFileAdd className="playlist-icon" />
      </div>
    </div>,
  ];
  const [playlistURL, setPlaylistURL] = useState("");
  const [currFiles, setCurrFiles] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isPredict, setIsPredict] = useState(false);
  // const { contextValue, updateContextValue } = useContext(ObjectProvider);
  const { contextValue, updateContextValue } = useContext(
    PlaylistObjectContext
  );
  const { notesValue, updateNotesValue } = useContext(NotesObjectContext);

  const handleFile = (files, uploaded) => {
    console.log(files);
    setCurrFiles(files);
    setIsUploaded(uploaded);
  };
  // const [playlistObject, ]
  const handleURLChange = (event) => {
    console.log("hello");
    console.log(event.target.value);
    setPlaylistURL(event.target.value);
  };

  useEffect(() => {
    let keys = Object.keys(contextValue);
    if (keys.length !== 0) {
      setCurrentVideoKey(keys[0]);
    }
  }, []);

  const returnAllPlaylists = () => {
    const out = [0, 1, 2, 3, 4, 5];
    return out.map((_) => {
      <div className="empty-playlist">
        <text>hello</text>
      </div>;
    });
  };

  const handleNotesUpload = async () => {
    const formData = new FormData();
    // formData.append("audio", currentRecording.blob, "audio.wav");
    formData.append("file", currFiles[0]);
    console.log("predict");
    // setProcessing(true);
    // setLoadChat(true);
    setLoading2(true);
    await axios
      .post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to set the content type
        },
      })
      .then((response) => {
        console.log(response.data);
        updateNotesValue(response.data);
        setLoading2(false);
      })
      .catch((error) => {
        setLoading2(false);
        // setProcessing(false);
        // Handle error
      });
    // await obtainLLMResponse();
  };

  const handlePlaylistURL = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setLoading(true);
    try {
      const response = await axios.post("/playlist", { text: playlistURL });
      console.log(response.data);
      updateContextValue(response.data.text_dict);
      const keys = Object.keys(response.data.text_dict);
      setCurrentVideoKey(keys[0]);
      console.log(response.data.text_dict);
      //   history("/playlist");
      setLoading(false);
      // setResult(response.data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePlaylistURL2 = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      await axios.get("/initllm");
      history("/playlist");
      setLoading2(false);
      // setResult(response.data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <section>
      <Container fluid className="project-section">
        <h1 className="playlist-header">Add your playlist and/or Notes</h1>
        <Container></Container>
      </Container>
      <div className="description-container">
        <text className="description">
          Find the playlist you are willing to use, we will extract all the
          necessary information for the chatbot to assist you.
        </text>
      </div>
      <div className="playlist-input-container">
        <input
          type="text"
          id="textInput"
          value={playlistURL}
          onChange={handleURLChange}
        />
        <button onClick={handlePlaylistURL}>
          <text className="button-text">Add Playlist</text>
        </button>
      </div>
      {loading === true ? (
        <ReactLoading type="bubbles" color="#A2FF86" className="loader" />
      ) : (
        <div className="no-loader"></div>
      )}
      <div className="all-playlist-container">{playlists}</div>
      <div className="description-container">
        <text className="description">
          Upload notes pertaining to your class, we will use state-of-the-art
          technologies to extract the information
        </text>
      </div>
      <DragDropFiles
        handleFile={(files, uploaded) => handleFile(files, uploaded)}
      />
      <button className="proceed-button" onClick={handleNotesUpload}>
        <text className="button-text">Upload Notes</text>
      </button>

      <button className="proceed-button" onClick={handlePlaylistURL2}>
        <text className="button-text">Proceed</text>
      </button>
      {loading2 === true ? (
        <ReactLoading type="bubbles" color="#A2FF86" className="loader" />
      ) : (
        <div className="no-loader"></div>
      )}
    </section>
  );
}

export default AddPlaylist;
