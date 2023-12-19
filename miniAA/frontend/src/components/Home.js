import React, { useEffect } from "react";
import { Col, Container, Row, Table, Alert, Button } from "react-bootstrap";

// import Header from '../Header/Header'
const Home = (props) => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(checkMetaMaskInstalled());
//     dispatch(findDay());
//   }, []);
//   const isInstalled = useSelector((state) => state.isInstalled);
//   const connection = useSelector((state) => state.connection);
  return (
    <>
      {/* <Header /> */}
      <div className="home commom-bg">
        {true ? (
          ""
        ) : (

          <Alert className="alert-danger" variant="danger" dismissible>
            <Container>
              <div className="d-flex align-items-center justify-content-center">
                <h6>Please Install MetaMask First </h6>
              </div>
            </Container>
          </Alert>
        )}
        {true ? (
          ""
        ) : (

          <Alert className="alert-danger" variant="danger" dismissible>
            <Container>
              <div className="d-flex align-items-center justify-content-center">

                <h6>Please Connect To MetaMask</h6>
                {/* <button
                  className="btn btn-secondary"
                  onClick={() => {
                    dispatch(onConnect());
                  }}
                >
                  Connect
                </button> */}
              </div>
            </Container>
          </Alert>
        )}
        <Container className="padding-container">
          <div className="heading">
            <h2>Mini AA Daily Reward Pools</h2>
          </div>
          <Row>
            <Col md={6} className="home-box">
              <div className="home-wraper">
                <div className="heading">
                    <h2>Points Reward Pool</h2>
                </div>
                <div className="content-data">
                  <p>Myntist Balance :</p>
                  <p>10 Myntist</p>
                </div>
                <div className="content-data">
                  <p>Current Day:</p>
                  <p>753</p>
                </div>
                <div className="content-data">
                  <p>Total Myntist :</p>
                  <p>5550 Myntist</p>
                </div>
                <div className="content-data">
                  <p>Your Deposite :</p>
                  <p>0 Myntist</p>
                </div>

              
              <div className="input-fleids">
                <div class="form-floating mb-4 amount-hex">
                  <input
                    type="text"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Stack Amount in Myntist"
                    name="stakeAmount"
                  />
                  <label for="floatingPassword">Enter Amount of Points</label>
                  <div className="field-btn__content">
                    <Button>Max</Button>
                  </div>
                  <span className="field-hex-text">Myntist</span>
                </div>
                <div className="btn-and-text">
                  <div className="send-hex">
                    <Button
                    >
                      Deposit
                    </Button>
                    <Button
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </div>
            
              </div>
            </Col>
            <Col md={6} className="home-box">
              <div className="home-wraper">
                <div className="heading">
                    <h2>Free Reward Pool</h2>
                </div>
                <div className="content-data">
                  <p>Current Day:</p>
                  <p>21</p>
                </div>
                <div className="content-data">
                  <p>Already enrolled:</p>
                  <p>1000</p>
                </div>
                <div className="content-data">
                  <p>Today Free Reward:</p>
                  <p>{20000000000/365}</p>
                </div>
                <div className="btn-and-text">
                  <div className="send-hex">
                    <Button
                    >
                      Enroll Free
                    </Button>
                    <Button
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="heading">
            <h2>History</h2>
          </div>
          <div className="v-card-table">
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Day Payout Total</th>
                  <th>
                    T-Shares Total{" "}
                    <span
                      aria-hidden="true"
                      class="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        class="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          class=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>Payout per T-Share</th>
                  <th>
                    % Gain{" "}
                    <span
                      aria-hidden="true"
                      class="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        class="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          class=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>
                    % APY{" "}
                    <span
                      aria-hidden="true"
                      class="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        class="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          class=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6">None</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </>

  );
};

export default Home;
