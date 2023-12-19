import React, { useState } from "react";
import {
  Nav,
  Navbar,
  Container,
  Image,
  Dropdown,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { onConnect, checkMetaMaskInstalled } from "../../reduxModules";
import { useSelector, useDispatch } from "react-redux";
import Button from "@restart/ui/esm/Button";

const Header = ({ sendDataToParent }) => {
  const [showDiscord, setShowDiscord] = useState(false);
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();

  const showDiscordOnLanding = () => {
    sendDataToParent(!showDiscord);
    setShowDiscord(!showDiscord);
  };
  return (
    <header className="header home-header app">
      <Navbar expand="lg" className="navbar">
        <Container className="position-relative">
          <Navbar.Brand href="/" className="logo">
            <Image src="/images/home-logo.svg" fluid />
          </Navbar.Brand>
          {/* <div className="searchbox">
						<input className="searchinput" type="text" name="" placeholder="Search Items Here" />
						<button className="searchbutton" href="#">
							<FontAwesomeIcon icon={faSearch} />
						</button>
					</div> */}
          <Navbar.Collapse id="navbarScroll">
            <nav className="ms-auto me-4 my-lg-0 header-list navbar-nav">
              <NavLink to={"/transfer"}
                className="header-menus nav-link d-flex align-items-center"
              >
                <i className="fa fa-exchange header-icons" aria-hidden="true"></i>
                <Link to={"/transfer"}>Transfer</Link>
              </NavLink>
              <NavLink to={"/stake"} className="header-menus nav-link">
                <i className="fa fa-university header-icons" aria-hidden="true"></i>
                <Link to={"/stake"}>Stake</Link>
              </NavLink>
              <NavLink to={"/claim"} className="header-menus nav-link">
                <i className="fa fa-btc header-icons" aria-hidden="true"></i>
                <Link to={"/claim"}>Claim</Link>
              </NavLink>
              <NavLink to={"/refer"} className="header-menus nav-link">
                <i className="fa fa-share-alt header-icons" aria-hidden="true"></i>
                <Link to={"/refer"}>Refer</Link>
              </NavLink>
              <NavLink to={"/transform"} className="header-menus nav-link">
                <i className="fa fa-random header-icons" aria-hidden="true"></i>
                <Link to={"/transform"}>Transform</Link>
              </NavLink>
            </nav>
          </Navbar.Collapse>
        
          <div className="d-flex align-items-center gap-2"> <Navbar.Toggle aria-controls="navbarScroll" />
            <div className="btn-wrap">
              <button 
                className="btn"
                onClick={() => { 
                  dispatch(onConnect());
                }}
              >
                {reduxState.connection ? <button className="btn btn-theme-home text-capitalize" disabled>{(reduxState.address).substring(0, 4) + "..." + (reduxState.address).substring((reduxState.address.length), (reduxState.address.length - 3))}</button> : <button
                className="btn btn-theme-home text-capitalize">Connect</button>}   
              </button>
            </div>
          </div>
          {/* </OverlayTrigger> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
