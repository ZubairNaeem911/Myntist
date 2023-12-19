import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import './HomeFooter.css';

const HomeFooter = () => {
    return (
        <footer className="footer section-padding">
            <Container>
                <Row>
                    <Col lg="6" md="6" sm="12" xs="12">
                        <div className="footer-logo">
                            <Link to="/"><img src="images/home-logo.svg" alt="Logo" className="img-fluid" /></Link>
                        </div>
                        <div className="email-box">
                            <h2>Get the latest Updates</h2>
                            <input className="form-control" type="text" name="" placeholder="Your Email" />
                            <span><FontAwesomeIcon icon={faPaperPlane} /></span>
                        </div>
                    </Col>
                    <Col lg="3" md="3" sm="12" xs="12">
                        <div className="footer-links">
                            <h4 className="text-capitalize">CryptoKet</h4>
                            <div className="links-wrapper">
                                <ul className="list-unstyled">
                                    <li><a href="#">Explore</a></li>
                                    <li><a href="#">How it Works</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col lg="3" md="3" sm="12" xs="12">
                        <div className="footer-links">
                            <h4 className="text-capitalize">support</h4>
                            <div className="links-wrapper">
                                <ul className="list-unstyled">
                                    <li><a href="#">Help center</a></li>
                                    <li><a href="#">Terms of service</a></li>
                                    <li><a href="#">Legal</a></li>
                                    <li><a href="#">Privacy policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="copyright-holder">
                <Container>
                    <div className="d-flex align-items-center flex-wrap justify-content-between">

                        <div className="copyright-text">
                            <p>10Pentacles, Inc. All Rights Reserved</p>
                        </div>
                        <div className="social-icons">
                            <ul className="list-unstyled d-flex align-items-center">
                                <li><a href="#" target="_blank"><FontAwesomeIcon icon={faInstagram} /></a></li>
                                <li><a href="#" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a></li>
                                <li><a href="#" target="_blank"><FontAwesomeIcon icon={faPaperPlane} /></a></li>
                                <li><a href="#" target="_blank"><FontAwesomeIcon icon={faDiscord} /></a></li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
};

export default HomeFooter;