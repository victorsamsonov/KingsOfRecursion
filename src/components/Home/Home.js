import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/ai.png";
import ytLogo from "../../Assets/yt.png";

import Type from "./Type";
// import React, { useState } from "react";
// import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="section-bg">
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Welcome to EffiSTEM!
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>
              <div className="description-container">
                <text className="description">
                  Leverage Large Language models for the most customizable and
                  efficient learning experience in STEM. Upload a youtube
                  playlist of your choice and/or your lecture notes for
                  immediate enhanced question answering.
                </text>
              </div>

              {/* <h1 className="heading-name">
                I'M
                <strong className="main-name"> SOUMYAJIT BEHERA</strong>
              </h1> */}

              <div style={{ padding: 50, textAlign: "left" }}>
                <Type />
              </div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="ai pig"
                className="img-fluid"
                style={{ maxHeight: "350px" }}
              />
            </Col>
          </Row>
        </Container>
        <div className="home-yt-start-container">
          <div className="yt-logo-component">
            <img src={ytLogo} alt="youtube logo" className="yt-logo" />
            <h1 className="yt-logo-component-text">
              Enhanced Youtube Experience
            </h1>
          </div>
          <button
            style={{ cursor: "pointer" }}
            className="started-button"
            as={Link}

            // onClick={() => updateExpanded(false)}
          >
            <Nav.Item>
              <Nav.Link as={Link} to="/setup">
                <text style={{ color: "white" }}>Get Started</text>
              </Nav.Link>
            </Nav.Item>
          </button>
        </div>
      </Container>
    </section>
  );
}

export default Home;
