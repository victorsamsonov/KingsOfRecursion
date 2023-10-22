import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  PlaylistObjectContext,
  UserPreferanceContext,
} from "../../PlaylistContext";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function Setup() {
  const [prompt, setPrompt] = useState("");
  const [currentVideoKey, setCurrentVideoKey] = useState("");
  const [text, setText] = useState("");
  const [canProceed, setCanProceed] = useState(false);

  const [playlistURL, setPlaylistURL] = useState("");
  // const { contextValue, updateContextValue } = useContext(ObjectProvider);
  const { contextValue, updateContextValue } = useContext(
    PlaylistObjectContext
  );
  const { userPreferance, setUserPreferance } = useContext(
    UserPreferanceContext
  );

  useEffect(() => {
    let keys = Object.keys(contextValue);
    if (keys.length !== 0) {
      setCurrentVideoKey(keys[0]);
    }
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setUserPreferance(e.target.value);
    if (e.target.value.length > 20) {
      setCanProceed(true);
    } else {
      setCanProceed(false);
    }
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
        <h1 className="playlist-header">Current Setup</h1>
        <Container>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            <Col md={7} className="home-header">
              <h1
                style={{ paddingBottom: 15, textAlign: "left" }}
                className="heading"
              >
                <strong className="main-name"> LoremIpsum </strong> offers a
                customizable experience for every student via using Large
                Language Models{" "}
                {/* <span className="bou" role="img" aria-labelledby="wave"> */}
                👩‍💻
                {/* </span> */}
              </h1>
              <div className="description-container">
                <text className="description">
                  Please enter your prefered style of learning, our models will
                  specifically use your prompt as additional context to help you
                  succeed!
                </text>
              </div>

              <div className="multi-word-input-container">
                <textarea
                  className="multi-word-input"
                  placeholder="Enter how you like to learn"
                  value={text}
                  onChange={handleTextChange}
                />
                <text> Enter a minimum of 20 characters</text>
              </div>

              {/* <h1 className="heading-name">
                Welcome to
                <strong className="main-name"> InsightAI </strong>
              </h1> */}

              {/* <div style={{ padding: 50, textAlign: "left" }}>
                <Type />
              </div> */}
            </Col>
            {canProceed ? (
              <button
                style={{ cursor: "pointer" }}
                className="started-button"
                as={Link}

                // onClick={() => updateExpanded(false)}
              >
                <Nav.Item>
                  <Nav.Link as={Link} to="/addplaylist">
                    <text style={{ color: "white" }}>Proceed</text>
                  </Nav.Link>
                </Nav.Item>
              </button>
            ) : (
              <button
                style={{ cursor: "pointer" }}
                className="started-button-disabled"
                disabled={true}

                // onClick={() => updateExpanded(false)}
              >
                <Nav.Item>
                  <Nav.Link>
                    <text style={{ color: "white" }}>Proceed</text>
                  </Nav.Link>
                </Nav.Item>
              </button>
            )}
          </Row>

          {/* <ReactLoading type="bars" color="#a317a3" className="loader" /> */}
        </Container>
      </Container>

      {/* <input
        type="text"
        id="textInput"
        value={playlistURL}
        onChange={handleURLChange}
      />
      <button onClick={handlePlaylistURL}></button> */}

      {/* <iframe autoPlay controls src={videoStream} width="640" height="480" /> */}
      {/* <img id="bg" width="1200px" height="900px" src="/video_feed" /> */}
    </section>
  );
}

export default Setup;
