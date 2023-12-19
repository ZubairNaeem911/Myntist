import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Alert, Container } from "react-bootstrap";
import {checkMetaMaskInstalled } from "../../reduxModules";
import { useToasts } from "react-toast-notifications";
import Header from "../Header/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import sha256 from "sha256";

const ReferalRedirection = (props) => {
  const reduxState = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  let { referAddress } = useParams();

  const [referalAddress, setReferalAddress] = useState("");

  useEffect(() => {
    setReferalAddress(referAddress);
    dispatch(checkMetaMaskInstalled());
    if (reduxState.connection) {
      redirect();
    }
  }, [reduxState.connection]);

  const redirect = async () => {
    try {
      const address = reduxState.address;

      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/v1/refralManagment/userReferal/${reduxState.address}`
      );
      const checkAddress = res.data.address;

      if (checkAddress === process.env.REACT_APP_ZERO_ADDRESS) {
        const hash = sha256(
          JSON.stringify({
            refererAddress: referalAddress,
            clientAddress: address,
            secret: process.env.REACT_APP_SECRET,
          })
        );
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/v1/refralManagment/createReferal`,
          {
            refererAddress: referalAddress,
            clientAddress: address,
          },
          {
            headers: { authorization: hash },
          }
        );

        const badgeResponse = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/v1/badgesManagment/referalBadge`,
          {
            refererAddress: referalAddress,
          }
        );
        if (res.data.success && badgeResponse.data.success) {
          addToast("Referal Generated ", {
            appearance: "success",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
          navigate("/transform");
        } else {
          addToast("Create Referal transaction can't be completed", {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        }
      } else {
        alert("Address Already Added");
        navigate("/transform");
      }
    } catch (e) {
      addToast(e?.response?.data.message || "Create Referal transaction can't be completed", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
    }
  };

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

        <div className="container p-0 transfer">
          <div className="main-content">
            <div className="heading">
              {reduxState.connection ? (
                <>
                  <h2>Connected with {reduxState.address} address</h2>
                  {/* {Redirect()} */}
                  {/* <button onClick={Redirect}>Redirrect</button> */}
                  {/* <Redirect to="/claim" /> */}
                </>
              ) : (
                <h2>Please Connect To MetaMask</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferalRedirection;
