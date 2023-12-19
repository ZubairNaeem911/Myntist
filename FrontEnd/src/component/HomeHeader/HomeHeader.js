import React, { useState } from "react";
import {
  Nav,
  Navbar,
  Container,
  Image,
  Dropdown,
  button,
  input,
  OverlayTrigger,
  Popover,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { onConnect, checkMetaMaskInstalled } from "../../reduxModules";
import { useSelector, useDispatch } from "react-redux";
const HomeHeader = ({ sendDataToParent }) => {
  const [showDiscord, setShowDiscord] = useState(false);
  const dispatch = useDispatch();
  const showDiscordOnLanding = () => {
    sendDataToParent(!showDiscord);
    setShowDiscord(!showDiscord);
  };

  return (
    <header className="header home-header">
      <Navbar expand="lg" className="navbar">
        <Container className="position-relative">
          <Navbar.Brand href="/" className="logo">
            <Image src="images/home-logo.svg" fluid />
          </Navbar.Brand>
          <div className="searchbox">
            <input
              className="searchinput"
              type="text"
              name=""
              placeholder="Search Items Here"
            />
            <button className="searchbutton" href="#">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 header-list">
              <Nav.Link className="header-menus d-flex align-items-center">
                <Link to={"/app"}>Explore</Link>
              </Nav.Link>
              <Nav.Link className="header-menus item-clr-grey">
                <Link to={"/"}>My items</Link>
              </Nav.Link>
              <Nav.Link className="header-menus item-clr-grey">
                <Link to={"/"}>Following</Link>
              </Nav.Link>
              <Nav.Link className="header-menus">
                <Link to={"/"}>Create</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {/* <div className="btn-wrap">
					<button className="btn btn-theme-home text-capitalize">Connect</button>
				</div> */}
          {/* <OverlayTrigger
            trigger="click"
            key="bottom"
            placement="bottom"
            overlay={
              <Popover
                id={`popover-positioned-bottom`}
                className="header-popover"
              >
                <Popover.Header as="h3">{`Popover bottom`}</Popover.Header>
                <Popover.Body>
                  <div className="content-wrapper d-flex flex-row justify-content-between">
                    <div className="discord-box">
                      <span className="discord-icon">
                        <FontAwesomeIcon icon={faDiscord} />
                      </span>
                      <h6>
                        Discord
                        <FontAwesomeIcon icon={faLongArrowAltRight} />
                      </h6>
                      <p>
                        Join the global community or find a local group or
                        Stacks Chapter.
                      </p>
                    </div>
                    <div className="discord-box discord-more-box">
                      <h6>
                        Discord and more
                        <FontAwesomeIcon icon={faLongArrowAltRight} />
                      </h6>
                      <p>
                        Join the global community or find a local group or
                        Stacks Chapter.
                      </p>
                      <h6>
                        Discord and more
                        <FontAwesomeIcon icon={faLongArrowAltRight} />
                      </h6>
                      <p>
                        Join the global community or find a local group or
                        Stacks Chapter.
                      </p>
                      <h6>
                        Discord and more
                        <FontAwesomeIcon icon={faLongArrowAltRight} />
                      </h6>
                      <p>
                        Join the global community or find a local group or
                        Stacks Chapter.
                      </p>
                    </div>
                    <div className="discord-box discord-more-box social-text">
                      <div className="discord-social-box">
                        <div className="no-rotate-icon d-flex align-items-center justify-content-between">
                          <h6>Discord and more</h6>
                          <FontAwesomeIcon icon={faLongArrowAltRight} />
                        </div>
                        <p>
                          Join the global community or find a local group or
                          Stacks Chapter.
                        </p>
                      </div>
                      <ul className="list-unstyled">
                        <li>
                          <a href="#">GitHub</a>
                        </li>
                        <li>
                          <a href="#">Reddit</a>
                        </li>
                        <li>
                          <a href="#">Telegram</a>
                        </li>
                        <li>
                          <a href="#">Twitter</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Popover.Body>
              </Popover>
            }
          > */}
            <div className="btn-wrap">
              <button
                className="btn btn-theme-home text-capitalize"
                onClick={() => {
                  dispatch(onConnect());
                }}
              >
                Connect
              </button>
            </div>
          {/* </OverlayTrigger> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default HomeHeader;
