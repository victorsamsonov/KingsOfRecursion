import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import ReactLoading from "react-loading";
import PlaylistObjectContext from "../../PlaylistContext";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function AddPlaylist() {
  const [prompt, setPrompt] = useState("");
  const [currentVideoKey, setCurrentVideoKey] = useState("");
  const [text, setText] = useState("");
  
  const [playlistURL, setPlaylistURL] = useState("");
  // const { contextValue, updateContextValue } = useContext(ObjectProvider);
  const { contextValue, updateContextValue } = useContext(
    PlaylistObjectContext
  );
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

  const handlePlaylistURL = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/playlist", { text: playlistURL });
      console.log(response.data);
      updateContextValue(response.data.text_dict);
      const keys = Object.keys(response.data.text_dict);
      setCurrentVideoKey(keys[0]);
      console.log(response.data.text_dict);
      // setResult(response.data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // function renderIframesFromObject(obj) {
  //   const iframeKeys = Object.keys(obj);

  //   return (
  //     <div className="iframe-slider">
  //       {iframeKeys.map((key) => (
  //         <img
  //           src={`https://img.youtube.com/vi/${key}/maxresdefault.jpg`}
  //           className="img-playlist"
  //           onClick={() => {
  //             setCurrentVideoKey(key);
  //           }}
  //         />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <section>
      <Container fluid className="project-section">
        <h1 className="playlist-header">Add your playlist</h1>
        <Container>
          <div className="description-container">
            <text className="description">
              Find the playlist you are willing to use, we will extract all the
              necessary information for the chatbot to assist you.
            </text>
          </div>
        </Container>
      </Container>

      <div className="playlist-input-container">
        <input
          type="text"
          id="textInput"
          value={playlistURL}
          onChange={handleURLChange}
        />
        <button onClick={handlePlaylistURL}>
          <text className="button-text">Proceed</text>
        </button>
      </div>

      {/* <iframe autoPlay controls src={videoStream} width="640" height="480" /> */}
      {/* <img id="bg" width="1200px" height="900px" src="/video_feed" /> */}
    </section>
  );
}

export default AddPlaylist;
