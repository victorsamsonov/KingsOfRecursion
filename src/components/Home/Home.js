import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/ai.png";
import ytLogo from "../../Assets/yt.png";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
// import React, { useState } from "react";
// import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
// import Container from "react-bootstrap/Container";
// import logo from "../Assets/logo.png";
// import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="section-bg">
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Welcome to Lorem Ipsum!
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

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
          <img
            src={ytLogo}
            alt="youtube logo"
            className="yt-logo"
          />
          <h1 className="yt-logo-component-text">
            Enhanced Youtube Experience
          </h1>
          </div>
          <button
            style={{ cursor: "pointer" }}
            className="started-button"
            as={Link}
            to="/project"
            // onClick={() => updateExpanded(false)}
          >
            <Nav.Item>
              <Nav.Link as={Link} to="/project">
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
