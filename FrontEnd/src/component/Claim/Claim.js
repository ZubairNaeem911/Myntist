import React, { useState, useEffect } from "react";
import { Container, Table, Alert, Row, Col, Toast } from "react-bootstrap";
import { checkMetaMaskInstalled, findDay,onConnect } from "../../reduxModules";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import Header from "../Header/Header";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import { checkRefererAddress } from "../../utils/helperFunction";
import sha256 from "sha256";
import Timer from "../Helpers/Timer";
const Claim = (props) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const { addToast, removeToast } = useToasts();
  useEffect(async () => {
    dispatch(findDay());
  }, []);
  useEffect(async () => {
    dispatch(checkMetaMaskInstalled());
    dispatch(findDay());
    await findTransactions();
    reaminigTime();
  }, [reduxState.connection, reduxState.accessToken]);

  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#3FE0D0");
  const [perDayTransactions, setPerDayTransactions] = useState([]);
  const [remain, setRemain] = useState(0);
  const [signatureHash, setSignatureHash] = useState("");
  const [signatureHashError, setSignatureHashError] = useState(false);
  const [signaturePayLoad, setSignaturePayLoad] = useState({});
  const [autoStakeDays, setAutoStakeDays] = useState(365);
  const [autoStakeDaysError, setAutoStakeDaysError] = useState("");

  const [state, setState] = React.useState({
    btcAddress: "",
    btcProof: [],
    btcError: false,
    btcBalance: "",
  });

  const claimButtonHandler = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const getBtcProof = async () => {
    try {
      if(reduxState.currentDay<=0){
        addToast("BTC Claim start after one day passed", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      }
      else{
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/v1/hexApi/getProof/${state.btcAddress}`
      );
      if (res.data.success) {
        setLoading(false);
        console.log("PROOF", res.data.proof);
        setState({
          ...state,
          btcProof: res.data.proof,
          btcError: false,
          btcBalance: res.data.balance,
        });
      } else {
        setLoading(false);
        setState({
          ...state,
          btcProof: "",
          // [evt.target.name]: value,
          btcError: true,
          btcBalance: "",
        });
      }}
      // }
    } catch (e) {
      setLoading(false);
      setState({
        ...state,
        btcProof: "",
        btcError: true,
        btcBalance: "",
      });
      console.log(e);
    }
  };

  const createFreeStake = async () => {
    const infoToast = addToast("Free Stake transaction in process", {
      appearance: "info",
    });
    try {
      const btcAddress = state.btcAddress;
      const address = reduxState.address;
      const refererAddress = await checkRefererAddress(address);
      const verificationPayLoad = signaturePayLoad;
      const days = autoStakeDays;
      const balance = parseInt(state.btcBalance);
      const proof = state.btcProof;
      setLoading(true);
      if (days >= 365 && days <= 5555) {
        console.log("VERIFICATION PAYLOAD", verificationPayLoad);
        let freeStake = await reduxState.contractInstance.btcAddressClaim(
          balance,
          proof,
          verificationPayLoad.pubKeyX,
          verificationPayLoad.pubKeyY,
          [
            verificationPayLoad.Sign.v,
            verificationPayLoad.Sign.r,
            verificationPayLoad.Sign.s,
          ],
          days,
          refererAddress,
          verificationPayLoad.nounce,
          verificationPayLoad.claimFlag
        );

        freeStake = await freeStake.wait();

        removeToast(infoToast);

        if (freeStake.status === 1) {
          const events = freeStake.events;
          let refererAddress = "";
          let refererBonus = 0;
          let rawBTC = 0;
          let adjBTC = 0;
          let claimedMynt = 0;
          events.map((data) => {
            if (data.event === "Claim") {
              refererAddress = data.args["referrerAddr"];
              refererBonus = Number(data.args["referrerBonus"]._hex);
              rawBTC = Number(data.args["rawBtc"]._hex);
              adjBTC = Number(data.args["adjBtc"]._hex);
              claimedMynt = Number(data.args["claimedMynt"]._hex);
            }
          });
          if (refererAddress !== process.env.REACT_APP_ZERO_ADDRESS) {
            const refererHash = sha256(
              JSON.stringify({
                referrerAddress: refererAddress,
                clientAddress: reduxState.address,
                amount: refererBonus / 10 ** 8,
                detail: "Btc Free Claim",
                day: reduxState.currentDay,
                secret: process.env.REACT_APP_SECRET,
              })
            );
            await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/v1/referrerRecords/createReferrerHistory`,
              {
                referrerAddress: refererAddress,
                clientAddress: reduxState.address,
                amount: refererBonus / 10 ** 8,
                detail: "Btc Free Claim",
                day: reduxState.currentDay,
              },
              {
                headers: { authorization: refererHash },
              }
            );
          }
          const btcClaimHash = sha256(
            JSON.stringify({
              btcAddress: btcAddress,
              clientAddress: reduxState.address,
              rawBtc: rawBTC,
              adjBtc: adjBTC,
              claimedMynt: claimedMynt,
              day: reduxState.currentDay,
              secret: process.env.REACT_APP_SECRET,
            })
          );
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/v1/btcClaim/createBtcClaimRecord`,
            {
              btcAddress: btcAddress,
              clientAddress: reduxState.address,
              rawBtc: rawBTC,
              adjBtc: adjBTC,
              claimedMynt: claimedMynt,
              day: reduxState.currentDay,
            },
            {
              headers: { authorization: btcClaimHash },
            }
          );

          addToast("completed successfully", {
            appearance: "success",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });

          await findTransactions();
          setLoading(false);
        } else {
          await findTransactions();
          setLoading(false);
          addToast("Free Stake transaction can't be completed ", {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        }
        setAutoStakeDaysError("");
        setSignaturePayLoad({});
        setSignatureHashError(false);
        setSignatureHash("");
        setAutoStakeDays(365);
        setState({
          btcAddress: "",
          btcProof: [],
          btcError: false,
          btcBalance: "",
        });
      } else {
        setLoading(false);
        removeToast(infoToast);
        setAutoStakeDaysError(
          "Days must be greater than 364 and less than 5556"
        );
      }
    } catch (e) {
      setAutoStakeDaysError("");
      setSignaturePayLoad({});
      setSignatureHashError(false);
      setSignatureHash("");
      setAutoStakeDays(365);
      setState({
        btcAddress: "",
        btcProof: [],
        btcError: false,
        btcBalance: "",
      });
      console.log("ERROR>>>>", e);
      removeToast(infoToast);
      await findTransactions();
      setLoading(false);
      addToast(
        e?.response?.data.message ||
        "Free Stake transaction can't be completed>>>>>",
        {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        }
      );
    }
  };

  const findTransactions = async () => {
    if (reduxState.connection === true) {
      const transactionArray = [];
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/v1/btcClaim/getUserBtcRecords/${reduxState.address}`
      );
      const transactionData = response.data.records;
      console.log("BTC TRABSACTIONS", transactionData);

      if (transactionData.length > 0) {
        transactionData.forEach((transaction) => {
          const dataObject = {
            btcAddress: transaction.btcAddress,
            day: transaction.day,
            rawBtc: transaction.rawBtc / 10 ** 8,
            adjustedBtc: transaction.adjBtc / 10 ** 8,
            claimAmount: transaction.claimedMynt / 10 ** 8,
          };
          transactionArray.push(dataObject);
        });
      }
      setLoading(false);
      setPerDayTransactions(transactionArray);
    }
  };

  const reaminigTime = () => {
    let startTime = parseInt(process.env.REACT_APP_START_DATE);
    let currentTime = parseInt(moment().unix());
    console.log(currentTime);
    let timeDiff = startTime - currentTime;

    let scnds = timeDiff % 60;
    let minutes = parseInt(timeDiff / 60);
    let minutesActual = minutes % 60;
    let hours = parseInt(minutes / 60);
    setRemain(`${hours} Hours - ${minutesActual} Minutes - ${scnds} Seconds`);
  };

  const verifySignature = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/v1/hexApi/verifySignatureHash`,
        {
          message: reduxState.address,
          address: state.btcAddress,
          signature: signatureHash,
          walletAddress: reduxState.address,
          balanceInSatoshis: state.btcBalance,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("SIGNATURE PAYLOAD", response.data.payLoad);
        setSignaturePayLoad(response.data.payLoad);
        setSignatureHashError(false);
        setLoading(false);
      } else {
        setSignatureHashError(true);
        setLoading(false);
      }
      // setSignatureHash(value);
    } catch (error) {
      console.log(error);
      // setSignatureHash(value);
      setSignatureHashError(true);
      setLoading(false);
    }
  };
  return (
    <>
      <Header />

      <>
        <div className="claim commom-bg">
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
              <h2>Claim</h2>
            </div>

            {reduxState.connection &&
              state.btcAddress &&
              state.btcError === false &&
              state.btcProof.length > 0 ? (
              <>
                <p>Bitcoin Address: {state.btcAddress}</p>
                <p>Bitcoin Balance: {state.btcBalance} sat</p>
                <p>Binance Address: {reduxState.address}</p>
              </>
            ) : (
              <p>
                {" "}
                Enter your BTC address to review its UTXO. Each address could
                only be claimed once.{" "}
              </p>
            )}
            <Row>
              <Col xl={6}>
                <div className="input-fleids">
                  {Object.keys(signaturePayLoad).length !== 0 ? (
                    <>
                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          className="form-control bitcion-address-field"
                          id="autoStakeDays"
                          placeholder="Auto stake days"
                          name="autoStakeDays"
                          value={autoStakeDays}
                          onChange={(evt) => {
                            setAutoStakeDays(evt.target.value);
                          }}
                        />
                        <label htmlFor="btcAddress">
                          Auto stake length in days
                        </label>
                      </div>
                      <p className="text-danger">{autoStakeDaysError}</p>
                      <div className="send-hex">
                        <button
                          className="btn btn-primary"
                          onClick={createFreeStake}
                        >
                          Submit Claim
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          className="form-control bitcion-address-field"
                          id="btcAddress"
                          placeholder="BTC Address"
                          name="btcAddress"
                          onChange={claimButtonHandler}
                          value={state.btcAddress}
                          disabled = {reduxState.connection ? false : true}
                        />
                        <label htmlFor="btcAddress">BTC Address</label>
                      </div>
                      {state.btcAddress.length > 6 &&
                        state.btcProof.length == 0 ? (
                        <div className="send-hex">
                          <button
                            className="btn btn-primary"
                            onClick={getBtcProof}
                          >
                            Verify Address
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      {state.btcError ? (
                        <p className="text-danger">Invalid Btc Address</p>
                      ) : state.btcProof.length > 0 ? (
                        <>
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control bitcion-address-field"
                              id="signatureMessage"
                              placeholder="Message"
                              name="signatureMessage"
                              value={reduxState.address}
                              disabled={true}
                            />
                            <label htmlFor="signatureMessage">
                              Please sign this message with your bitcoin
                              address
                            </label>
                          </div>

                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control bitcion-address-field"
                              id="signatureHash"
                              placeholder="Paste Btc Signature"
                              name="signatureHash"
                              value={signatureHash}
                              onChange={(evt) => {
                                setSignatureHash(evt.target.value);
                              }}
                            />
                            <label htmlFor="signatureHash">Signature</label>
                          </div>

                          {signatureHash.length > 0 ?(
                            <div className="send-hex">
                            <button
                              className="btn btn-primary"
                              onClick={verifySignature}
                            >
                              Verify Signature
                            </button>
                          </div>):("")
                          }
                          {signatureHashError ? (
                            <p className="text-danger">Invalid Signature</p>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <div className="heading">
              <h2>Claim History</h2>
            </div>
            <div className="v-card-table">
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>BTC Address</th>
                    <th>Raw BTC</th>
                    <th>Adjusted BTC</th>
                    <th>Claimed MYNT</th>
                  </tr>
                </thead>

                <tbody>
                  {reduxState.connection
                    ?
                    <>
                      {perDayTransactions.length > 0
                        ? perDayTransactions.map((data, i) => {
                          return (
                            <tr key={i}>
                              <td>{data.day}</td>
                              <td>{data.btcAddress}</td>
                              <td>{data.rawBtc}</td>
                              <td>{data.adjustedBtc}</td>
                              <td>{data.claimAmount}</td>
                            </tr>
                          );
                        })
                        :
                        <tr>
                          <td colSpan={5}>None</td>
                        </tr>
                      }
                    </>
                    :
                    <tr>
                      <td style={{ padding: "12px" }} className="text-center" colSpan={5}>Please Connect to see Records <button onClick={() => { dispatch(onConnect()); }} className="btn btn-theme-home text-capitalize ms-3">Connect</button></td>
                    </tr>
                  }
                </tbody>
              </Table>
            </div>
          </Container>
        </div>
      </>

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

export default Claim;
