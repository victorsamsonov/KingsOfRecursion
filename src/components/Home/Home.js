import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Type from "./Type";

// Assets
import homeLogo from "../../Assets/ai.png";
import ytLogo from "../../Assets/yt.png";

function Home() {
  return (
    <Container fluid className="ux-section-bg">
      <Container className="ux-home-content">
        <Row className="ux-row">
          <Col className="ux-home-header">
            <h1 className="ux-heading">
              Welcome to EffiSTEM!
              <span className="ux-wave">👋🏻</span>
            </h1>
            <div className="ux-typing-section">
              <Type />
            </div>
          </Col>

          <Col className="ux-home-image-section">
            <img src={homeLogo} alt="ai pig" className="ux-home-image"/>
          </Col>
        </Row>

        <div className="ux-yt-section">
          <div className="ux-yt-logo-section">
            <img src={ytLogo} alt="youtube logo" className="ux-yt-logo" />
            <h1 className="ux-yt-text">Enhanced Youtube Experience</h1>
          </div>
          <button className="ux-started-button">
            <Nav.Link as={Link} to="/playlist" className="ux-nav-link">
              Get Started
            </Nav.Link>
          </button>
        </div>
      </Container>

      <footer className="ux-footer">
        © 2023 EffiSTEM. Powered by Google Cloud and AI.
      </footer>
    </Container>
  );
}

export default Home;
