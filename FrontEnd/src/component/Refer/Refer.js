import React, { useState, useEffect } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import { checkMetaMaskInstalled } from "../../reduxModules";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Header from "../Header/Header";
import axios from "axios";
import Timer from "../Helpers/Timer";
import { onConnect } from "../../reduxModules";
const Refer = (props) => {
  const [referData, setReferData] = useState([]);
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [referUrl, setReferUrl] = useState("");
  const { addToast } = useToasts();
  useEffect(async () => {
    dispatch(checkMetaMaskInstalled());
    await generateReferUrl();
    await getReferRecords();
  }, [reduxState.connection]);

  const generateReferUrl = async () => {
    if (reduxState.connection === true) {
      const url = `${process.env.REACT_APP_FRONT_END_URL}/referalRedirection/${reduxState.address}`;
      setReferUrl(url);
    }
  };

  const getReferRecords = async () => {
    if (reduxState.connection) {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/v1/referrerRecords/getUserReferrerRecords/${reduxState.address}`
      );
      setReferData(res.data.records);
    }
  };

  const copyReferalLink = () => {
    navigator.clipboard.writeText(referUrl);
    addToast("copied!", {
      appearance: "success",
      autoDismissTimeout: 3000,
      autoDismiss: true,
    });
  };
  return (
    <>
      <Header />
      <div className="refer commom-bg">
        {reduxState.isInstalled ? (
          ""
        ) : (
          <Alert className="alert-danger" variant="danger" dismissible>
            <Container>
              <div className="d-flex align-items-center justify-content-center">
                <h6>Please Install MetaMask First</h6>
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
            <h2>Referral History</h2>
          </div>
          {reduxState.connection ? (
            <>
              <div
                className="input-fleids"
                style={{
                  padding: "unset",
                  background: "unset",
                  border: "none",
                }}
              >
                <div
                  className="form-floating mb-4"
                  style={{ maxWidth: "700px" }}
                >
                  <input
                    style={{ padding: "0 20px 0 20px" }}
                    type="text"
                    className="form-control"
                    defaultValue={referUrl}
                    disabled
                  />
                </div>
              </div>

              <div className="send-hex">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    copyReferalLink();
                  }}
                >
                  Copy Referal Link
                </button>
              </div>
            </>
          ) : (
            ""
          )}
          <br />
          <div className="v-card-table">
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Referring Wallet Address</th>
                  <th>Details</th>
                  <th>Awarded MYNT</th>
                </tr>
              </thead>
              <tbody>
                {reduxState.connection
                  ?
                  <>
                    {referData.length > 0 ? (
                      referData.map((data, i) => {
                        return (
                          <tr key={i}>
                            <td>{data.day}</td>
                            <td>{data.clientAddress}</td>
                            <td>{data.detail}</td>
                            <td>{data.amount}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4}>None</td>
                      </tr>
                    )}
                  </>
                  :
                  <tr>
                    <td style={{ padding: "12px" }} className="text-center" colSpan={4}>Please Connect to see Referral Record <button onClick={() => { dispatch(onConnect()); }} className="btn btn-theme-home text-capitalize ms-3">Connect</button></td>
                  </tr>
                }
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Refer;
