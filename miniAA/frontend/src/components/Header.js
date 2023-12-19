import Web3 from "web3";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Image, Alert } from "react-bootstrap";

const Header = ({ user, setUser }) => {
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const userAccout = await web3.eth.getAccounts();
        setUser(userAccout[0]);
        console.log(">>>>>>>>>> User :", userAccout[0]);
      }
    };

    checkWalletConnection();
    // eslint-disable-next-line
  }, []);

  const handleConnect = async () => {
    if (!window.ethereum) {      
      console.log("Please Insatall Metamask!");
    } else {
      const currentProvider = window.ethereum;
      await currentProvider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(
        currentProvider || process.env.REACT_APP_TESTNET_RPC_URL
      );
      const userAccout = await web3.eth.getAccounts();
      setUser(userAccout[0]);
      // console.log("Network ID: ", network.chainId);
      console.log(userAccout[0]);
    }
  };
  return (
    <>
      <header className="header home-header">
        <Navbar expand="lg" className="navbar">
          <Container className="position-relative">
            <Navbar.Brand href="/" className="logo">
              <Image src="images/home-logo.svg" fluid />
            </Navbar.Brand>

            <Nav className="ms-auto me-4 my-lg-0 header-list">
              {/* <i className="fa fa-exchange header-icons" aria-hidden="true"></i> */}
              <Link
                className={`nav-link header-menus d-flex align-items-center`}
                to={"/pointspool"}
              >
                Points Pool
              </Link>

              {/* <i className="fa fa-exchange header-icons" aria-hidden="true"></i> */}
              <Link
                className={`nav-link header-menus d-flex align-items-center`}
                to={"/freepool"}
              >
                Free Pool
              </Link>
            </Nav>

            <div className="d-flex align-items-center gap-2">
              {" "}
              <Navbar.Toggle aria-controls="navbarScroll" />
              <div className="btn-wrap">
                {user ? (
                  <button
                    className="btn btn-theme-home text-capitalize"
                    disabled
                  >
                    Connected
                  </button>
                ) : (
                  <button
                    className="btn btn-theme-home text-capitalize"
                    onClick={() => handleConnect()}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            {/* </OverlayTrigger> */}
            
          </Container>
        </Navbar>
      </header>
      {user ? (
              ""
            ) : (
              <Alert className="alert-danger" variant="danger" dismissible>
                <Container>
                  <div className="d-flex align-items-center justify-content-center">
                    <h6>Please Connect To MetaMask</h6>
                  </div>
                </Container>
              </Alert>
            )}
    </>
  );
};

export default Header;
