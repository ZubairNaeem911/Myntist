import React, { useState, useEffect } from "react";
import { Container, Table, Alert, Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { checkMetaMaskInstalled, findDay } from "../../reduxModules";
import axios from "axios";
import Header from "../Header/Header";
import { ethers } from "ethers";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { checkRefererAddress } from "../../utils/helperFunction";
import ClipLoader from "react-spinners/ClipLoader";
import sha256 from "sha256";
import Timer from "../Helpers/Timer";
import { onConnect } from "../../reduxModules";
const Transform = (props) => {
  const dispatch = useDispatch();
  const { addToast, removeToast } = useToasts();
  const reduxState = useSelector((state) => state);

  const [perDayData, setPerDayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enterLobbyModal, setEnterLobbyModal] = useState(false);
  const [state, setState] = React.useState({
    amountBNB: 0,
  });
  const [color, setColor] = useState("#3FE0D0");

  useEffect(() => {
    dispatch(checkMetaMaskInstalled());
    dispatch(findDay());
    findTransactions();
  }, [reduxState.connection, reduxState.currentDay, reduxState.address]);

  const countShare = (amount, todayCollection, totalSupply) => {
    let share = 0;
    share = amount / todayCollection;
    share = share * totalSupply;
    return share;
  };

  const findCurrentDay = () => {
    const date = moment().unix();
    let day = date - process.env.REACT_APP_START_DATE;
    day = Math.floor(day / process.env.REACT_APP_TIMESLOT);
    return day;
  };

  const findDailySupply = async (updatedDayNum) => {
    return new Promise(async function (resolve1, reject1) {
      let promises = [];

      for (let i = 0; i <= updatedDayNum; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            reduxState.contractInstance
              .dailyData(i)
              .then((res) => {
                resolve(res);
              })
              .catch((e) => {
                reject(e);
              });
          })
        );
      }

      Promise.all(promises).then((x) => {
        resolve1(x);
      });
    }).catch((e) => {
      reject1(e);
    });
  };

  const findTransactions = async () => {
    if (reduxState.connection === true) {
      setLoading(true);
      setPerDayData([]);
      const startDay = 0;
      const myntAvailable = [];
      const submittedBNB = [];
      const pendingDays = [];
      const compeleteData = [];
      const currentDay = findCurrentDay();
      try {
        const globalInfo = await reduxState.contractInstance.globalInfo();
        const globalData = await reduxState.contractInstance.globals();
        let updatedDayNum = globalData["dailyDataCount"];
        updatedDayNum = updatedDayNum >= 350 ? 350 : updatedDayNum;
        const day = currentDay >= 350 ? 350 : currentDay;

        const dailySupplyData = await findDailySupply(updatedDayNum);
        let lastUpdatedDaySupply = "";
        // Daily Supply For Transform Lobbies
        for (let i = 0; i <= currentDay; i++) {
          if (i == 0) {
            myntAvailable.push(1e9);
          } else {
            if (updatedDayNum == 0) {
              const token = (1900000000000000 * 10000) / 350 / 10 ** 8;
              lastUpdatedDaySupply = token;
              myntAvailable.push(token);
            }

            if (i < updatedDayNum) {
              const data = dailySupplyData[i];
              let unclaimedSatoshis = Number(
                data["dayUnclaimedSatoshisTotal"]._hex
              );
              if (unclaimedSatoshis == 0) {
                unclaimedSatoshis = 1900000000000000;
              }
              const token = (unclaimedSatoshis * 10000) / 350 / 10 ** 8;

              lastUpdatedDaySupply = token;
              myntAvailable.push(token);
            }
            if (i >= updatedDayNum) {
              const unclaimedSatoshis = Number(globalInfo[7]._hex);
              const token = (unclaimedSatoshis * 10000) / 350 / 10 ** 8;
              lastUpdatedDaySupply = token;

              myntAvailable.push(token);
            }
          }
        }
        const transactionBNBSubmitted =
          await reduxState.contractInstance.xfLobbyRange(startDay, day);
        transactionBNBSubmitted.map((data) => {
          submittedBNB.push(Number(data._hex));
        });

        const userPendingDays =
          await reduxState.contractInstance.xfLobbyPendingDays(
            reduxState.address
          );
        userPendingDays.map((data) => {
          pendingDays.push(Number(data._hex));
        });

        for (let i = 0; i <= currentDay; i++) {
          if (i <= 350) {
            let dayTotalBNB = submittedBNB[i] / 10 ** 18;
            let dayAvailableMynt = myntAvailable[i];
            let myntPerBNB = 0;

            if (dayTotalBNB > 0) {
              let bnb = dayTotalBNB;
              if (bnb < 1) {
                bnb = 1;
              }
              myntPerBNB = dayAvailableMynt / bnb;
            } else {
              myntPerBNB = dayAvailableMynt;
            }
            let userSubmitedBNB = 0;
            let userShare = 0;
            let btnCheck = false;

            if (pendingDays[i] === 1) {
              const userTransactionData =
                await reduxState.contractInstance.xfLobbyEntry(i);
              console.log("Transactions", userTransactionData);
              for (let i = 0; i < userTransactionData.length; i++) {
                userSubmitedBNB =
                  userSubmitedBNB +
                  Number(userTransactionData[i].rawAmount._hex) / 10 ** 18;
              }
              userShare = countShare(
                userSubmitedBNB,
                dayTotalBNB,
                dayAvailableMynt
              );
              if (reduxState.currentDay >= i + 1) {
                btnCheck = true;
              }
            }
            const status = reduxState.currentDay === i ? "Opened" : "Closed";
            const data = {
              day: i,
              totalBNB: dayTotalBNB,
              availableMynt: dayAvailableMynt,
              myntPerBNB: myntPerBNB,
              userSubmitedBNB: userSubmitedBNB,
              userMynt: userShare,
              status: status,
              btnCheck: btnCheck,
            };
            compeleteData.push(data);
          }
        }
        setPerDayData(compeleteData);
        setLoading(false);
      } catch (e) {
        console.log("findTransactions Error", e);
        setLoading(false);
      }
    }
  };

  const claimReward = async (day) => {
    setLoading(true);
    const infoToast = addToast("Claim transaction in process", {
      appearance: "info",
    });
    try {
      let tx1 = await reduxState.contractInstance.xfLobbyExit(day);
      tx1 = await tx1.wait();

      removeToast(infoToast);
      if (tx1.status === 1) {
        const events = tx1.events;
        let refererAddress = "";
        let refererBonus = 0;
        console.log("TEST EVENTS>>>",events);
        events.map((data) => {
          if (data.event === "XfLobbyExit") {
            refererAddress = data.args["referrerAddr"];
            refererBonus = Number(data.args["referrerAddrBonus"]._hex);
          }
        });
        if (refererAddress !== process.env.REACT_APP_ZERO_ADDRESS) {
          const hash = sha256(
            JSON.stringify({
              referrerAddress: refererAddress,
              clientAddress: reduxState.address,
              amount: refererBonus / 10 ** 8,
              detail: "Transform Lobbies",
              day: day,
              secret: process.env.REACT_APP_SECRET,
            })
          );
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/v1/referrerRecords/createReferrerHistory`,
            {
              referrerAddress: refererAddress,
              clientAddress: reduxState.address,
              amount: refererBonus / 10 ** 8,
              detail: "Transform Lobbies",
              day: day,
            },
            {
              headers: { authorization: hash },
            }
          );
        }
        await findTransactions();
        setLoading(false);
        addToast("Claim transaction completed successfully", {
          appearance: "success",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      } else {
        await findTransactions();
        setLoading(false);
        addToast("Claim transaction can't be completed ", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      }
    } catch (e) {
      console.log("claimReward ERROR", e);
      removeToast(infoToast);
      await findTransactions();
      setLoading(false);
      addToast(
        e?.response?.data.message || "Claim transaction can't be completed ",
        {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        }
      );
    }
  };

  const handleEnterLobbyModal = () => {
    setEnterLobbyModal(true);
  };

  const enterLobbyModalClose = () => {
    setState({
      ...state,
      amountBNB: 0,
    });
    setEnterLobbyModal(false);
  };

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  const enterLobby = async () => {
    let infoToast;
    try {
      const balance = reduxState.balance;
      let amount = state.amountBNB;
      if (amount > balance) {
        addToast("Amount is less than balance.", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      } else {
        setLoading(true);
        infoToast = addToast("Transaction in process", {
          appearance: "info",
        });
        amount = Number(amount * 10 ** 18);
        amount = amount.toLocaleString("fullwide", { useGrouping: false });
        amount = ethers.BigNumber.from(amount.toString());
        enterLobbyModalClose();
        const refererAddress = await checkRefererAddress(reduxState.address);
        console.log("REFERER Address",refererAddress);
        let transaction = await reduxState.contractInstance.xfLobbyEnter(
          refererAddress,
          {
            value: amount,
          }
        );
        transaction = await transaction.wait();
        removeToast(infoToast);
        if (transaction.status === 1) {
          setLoading(false);
          addToast("Transaction completed successfully", {
            appearance: "success",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
          findTransactions();
        } else {
          removeToast(infoToast);
          setLoading(false);
          addToast("Transaction can't be completed ", {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        }
      }
    } catch (e) {
      removeToast(infoToast);
      setLoading(false);
      addToast("Transaction can't be completed ", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
      console.log("ERROR", e);
    }
  };

  return (
    <>
      <Header />
      <div className="transform commom-bg">
        {reduxState.isInstalled ? (
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

        {reduxState.isInstalled
          ?
          <>
            {reduxState.connection ? (
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
          :
          ""
        }

        <Timer />

        <Container className="padding-container">
          <div className="heading">
            <h2>Transform</h2>
          </div>
          <div className="v-card-table">
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>MYNT Available</th>
                  <th>Total BNB</th>
                  <th>MYNT/BNB</th>
                  <th>Closing</th>
                  <th>Your MYNT</th>
                  <th>Your BNB</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>

                {reduxState.connection
                  ?
                  <>
                    {loading === false && perDayData && perDayData.length > 0
                      ? perDayData.map((data, i) => {
                        return (
                          <tr key={i}>
                            <td>{data.day}</td>
                            <td>
                              {data.availableMynt !== 0
                                ? data.day === 0
                                  ? `${parseInt(
                                    data.availableMynt / 1000000000
                                  ).toFixed(3)}  B`
                                  : `${parseFloat(
                                    data.availableMynt / 1000000
                                  ).toFixed(3)} M`
                                : data.availableMynt}
                            </td>
                            <td>{data.totalBNB}</td>
                            <td>{parseInt(data.myntPerBNB)}</td>
                            <td>{data.status}</td>
                            <td>{parseInt(data.userMynt)}</td>
                            <td>{data.userSubmitedBNB}</td>
                            {data.status === "Opened" ? (
                              <td width={100}>
                                <div className="send-hex">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      handleEnterLobbyModal();
                                    }}
                                  >
                                    Enter
                                  </button>
                                </div>
                              </td>
                            ) : (
                              ""
                            )}
                            {data.btnCheck ? (
                              <td width={100}>
                                <div className="send-hex">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      claimReward(data.day);
                                    }}
                                  >
                                    Claim
                                  </button>
                                </div>
                              </td>
                            ) : (
                              ""
                            )}
                          </tr>
                        );
                      })
                      :
                      <tr>
                        <td colSpan={7}>None</td>
                      </tr>
                    }
                  </>
                  :
                  <tr>
                    <td style={{ padding: "12px" }} className="text-center" colSpan={7}>Please Connect to use Transform Lobbies <button onClick={() => { dispatch(onConnect()); }} className="btn btn-theme-home text-capitalize ms-3">Connect</button></td>
                  </tr>
                }
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
      <Modal
        show={enterLobbyModal}
        onHide={enterLobbyModalClose}
        className="extend-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Enter Adoption Amplifier Lobby On Day ${reduxState.currentDay}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0" }}>
          <span style={{ color: "#fff", fontWeight: "500" }}>Enter Amount</span>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter amount"
              name="amountBNB"
              onChange={handleChange}
              value={state.amountBNB}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="send-hex">
          <Button
            variant="secondary"
            className="btn-cancel"
            onClick={enterLobbyModalClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="btn-save"
            onClick={() => {
              enterLobby();
            }}
          >
            Enter Lobby
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? (
        <>
          <div className="claims-loader">
            <ClipLoader color={color} loading={loading} size={100} />
          </div>
        </>
      ) : (
        ""
      )}
      {loading ? <div className="if-loader-enable fade show"></div> : ""}
    </>
  );
};

export default Transform;
