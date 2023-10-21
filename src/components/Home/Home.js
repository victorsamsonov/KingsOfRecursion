import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/ai.png";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

function Home() {
  return (
    <section>
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
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px" }}
              />
              
            </Col>
          </Row>
        </Container>
        {/* <img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 25%);" src="http://10.253.67.104/video.mjpg" width="541" height="962"/>   */}
        <input type="file" name="video" accept="video/*" capture="environment" style={{ position: 'relative', zIndex: 9999 }} />
      </Container>
     
    </section>
  );
}

export default Home;
