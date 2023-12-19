import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, Table, Alert, Container } from "react-bootstrap";
import { checkMetaMaskInstalled,findDay } from "../../reduxModules";
import { useToasts } from "react-toast-notifications";
import Header from "../Header/Header";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import sha256 from "sha256";
import Timer from "../Helpers/Timer";
import { onConnect } from "../../reduxModules";
import { ethers } from "ethers";

const Main = (props) => {
  const [state, setState] = React.useState({
    recipentAddress: "",
    amount: "",
  });
  const [transferData, setTransferData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#3FE0D0");
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast, removeToast } = useToasts();
  useEffect(async () => {
    dispatch(findDay());
  }, []);
  useEffect(() => {
    dispatch(findDay());
    dispatch(checkMetaMaskInstalled());
    getTransactions();
  }, [reduxState.connection, reduxState.address]);

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  const findBalance = async () => {
    let balance = await reduxState.contractInstance.balanceOf(
      reduxState.address
    );
    balance = balance / 10 ** 8;
    return balance;
  };

  const transferToken = async () => {
    try {
      console.log("AMOUNT>>>", state.amount);
      setLoading(true);
      const reciepentAddress = state.recipentAddress;
      let amount = state.amount;
      let balance = await findBalance();
      balance = Number(balance);
      amount = Number(amount);
      console.log("AMOunt ", amount);
      if (
        amount !== 0 &&
        amount !== "" &&
        amount !== undefined &&
        reciepentAddress !== "" &&
        reciepentAddress !== undefined
      ) {
        if (balance < amount) {
          setLoading(false);
          addToast("Balance is less than amount.", {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        } else {
          amount = Number(amount * 10 ** 8);
          amount = amount.toLocaleString("fullwide", { useGrouping: false });
          amount = ethers.BigNumber.from(amount.toString());
          let tx1 = await reduxState.contractInstance.transfer(
            reciepentAddress,
            amount
          );
          const infoToast = addToast("Transfer transaction in process", {
            appearance: "info",
          });
          tx1 = await tx1.wait();
          removeToast(infoToast);
          if (tx1.status === 1) {
            const hash = sha256(
              JSON.stringify({
                fromAddress: reduxState.address,
                toAddress: reciepentAddress,
                amount: amount / 10 ** 8,
                balance: balance,
                secret: process.env.REACT_APP_SECRET,
              })
            );

            await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/v1/transferRecords/createTransferHistory`,
              {
                fromAddress: reduxState.address,
                toAddress: reciepentAddress,
                amount: amount / 10 ** 8,
                balance: balance,
              },
              {
                headers: { authorization: hash },
              }
            );
            addToast("completed successfully", {
              appearance: "success",
              autoDismissTimeout: 3000,
              autoDismiss: true,
            });
            setState({ recipentAddress: "", amount: "" });
            await getTransactions();
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
        addToast(
          reciepentAddress == ""
            ? "Add Reciepent Address"
            : "Add Transfer Amount.",
          {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          }
        );
      }
    } catch (e) {
      console.log("TRANSFER ERROR", e);
      setLoading(false);
      setState({ recipentAddress: "", amount: "" });
      await getTransactions();
      addToast(e?.response?.data.message || "Transaction Can't Completed", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
    }
  };

  const getTransactions = async () => {
    try {
      if (reduxState.connection === true) {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/v1/transferRecords/getUserTransferRecord/${reduxState.address}`
        );
        if (res.data.success) {
          setTransferData(res.data.records);
        }
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log("GET TRANSFER TRANSACTION ERROR", e);
    }
  };

  const maxAmountMynt = async () => {
    let balance = await findBalance();
    balance = Number(balance);
    setState({
      ...state,
      amount: balance,
    });
  }

  return (
    <>
      <Header />
      <div className="main commom-bg">
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

        {reduxState.isInstalled ? (
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
        ) : (
          ""
        )}

        <Timer />

        <div className="container p-0 transfer">
          <div className="main-content">
            <div className="heading">
              <h2>Transfer</h2>
            </div>
            <Row>
              <Col xl={6}>
                <div className="input-fleids">
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="From your Ethereum address"
                      name="connectorAddress"
                      defaultValue={reduxState.address}
                      disabled
                    />
                    <label htmlFor="floatingInput">
                      From your Wallet address
                    </label>
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingPassword"
                      name="recipentAddress"
                      placeholder="To recipient Ethereum address"
                      onChange={handleChange}
                      value={state.recipentAddress}
                    />
                    <label htmlFor="floatingPassword">
                      To recipient Wallet address
                    </label>
                  </div>
                  <div className="form-floating mb-4 amount-hex">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Amount in HEX"
                      name="amount"
                      onChange={handleChange}
                      value={state.amount}
                    />
                    <label htmlFor="floatingPassword">Amount in MYNT</label>
                    <div className="field-btn__content">
                      <Button disabled={!reduxState.connection} onClick={() => maxAmountMynt()}>Max</Button>
                    </div>
                    <span className="field-hex-text">MYNT</span>
                  </div>
                  {/* {reduxState.connection ? ( */}
                  <div className="send-hex">
                    <Button
                      variant="primary"
                      onClick={transferToken}
                      disabled={reduxState.connection ? false : true}
                    >
                      Send MYNT
                    </Button>
                  </div>
                  {/* ) : (
                    ""
                  )} */}
                </div>
              </Col>
            </Row>
            <div className="heading">
              <h2 className="transfer-history">Transfer History</h2>
            </div>
            <div className="v-card-table">
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Amount</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {reduxState.connection ? (
                    <>
                      {transferData.length > 0 ? (
                        transferData.map((data, i) => {
                          return (
                            <tr key={i}>
                              <td>Transfer</td>
                              <td>{data.toAddress}</td>
                              <td>{data.amount}</td>
                              <td>{data.balance}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4}>None</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td
                        style={{ padding: "12px" }}
                        className="text-center"
                        colSpan={4}
                      >
                        Please Connect to see Record{" "}
                        <button
                          onClick={() => {
                            dispatch(onConnect());
                          }}
                          className="btn btn-theme-home text-capitalize ms-3"
                        >
                          Connect
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
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

export default Main;
