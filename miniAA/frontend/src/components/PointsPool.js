import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  Container,
  Button,
  Table,
  Modal,
  Form,
  CloseButton,
} from "react-bootstrap";
import Header from "./Header";
import { addressList, LIMIT, SERVER_BASE_URL } from "../utils/config";
import { findDay, findYear, yearOnDay } from "../utils/Helpers";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";
import { YEARS } from "../utils/RewardByYear";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import axios from "axios";
import MiniAA from "../utils/ContractABI.json";
import Multicall from "@dopex-io/web3-multicall";

const MiniAddress = addressList.miniAA[97];
const MulticallAddress = addressList.multicall[97];

const PointsPool = ({ user, setUser }) => {
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);
  const [allDays, setAllDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setpageCount] = useState(0);
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionAmountError, setTransactionAmountError] = useState("");
  const [userPoints, setUserPoints] = useState(null);
  const [reload,setReload] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const submitTranscation = () => {
    if (transactionAmount === "") {
      setTransactionAmountError("Please Enter Points Amount");
    } else if (transactionAmount < 0) {
      setTransactionAmountError("Points Amount must greater than 0");
    } else if (parseFloat(transactionAmount) === 0) {
      setTransactionAmountError("Invalid Points Amount");
    } else if (parseFloat(transactionAmount) > userPoints) {
      setTransactionAmountError("Not have enough points balance");
    } else {
      setTransactionAmountError("");
      handelEnter(parseInt(transactionAmount));
      setShow(false);
    }
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    console.log("Current User from User Effect: ", user);

    if (user) {
      const currentDay = findDay();
      setpageCount(Math.ceil(currentDay / LIMIT));
      const currentYear = findYear();
      setDay(currentDay);
      setYear(currentYear);
      initRewardPool(user, currentDay, LIMIT);
      fetchPoints(user);
    }
    // eslint-disable-next-line
  }, [user,reload]);
  const fetchPoints = async (_user) => {
    try {
      const data = { walletAddress: _user };
      const result = await axios.post(
        `${SERVER_BASE_URL}/v1/users/absolute/points`,
        data
      );
      const { points } = result.data;
      console.log("UserPoints: ", points);
      setUserPoints(points);
    } catch (err) {
      console.log(err);
    }
  };
  const initRewardPool = async (_user, _currentDay, _limit) => {
    console.log(">>>> Current Day: ", _currentDay);
    console.log(">>>> per Page: ", _limit);
    const transactionArray = [];
    if (window.ethereum) {
      try {
        setLoading(true);
        console.log("Loading Start .... ", loading);

        const web3 = new Web3(window.ethereum);
        const MiniAAContract = new web3.eth.Contract(MiniAA.abi, MiniAddress);

        const multicall = new Multicall({
          multicallAddress: MulticallAddress,
          provider: web3,
        });
        let start = _currentDay - _limit;
        if (start < 1) {
          start = 0;
        }

        for (let i = start; i <= _currentDay; i++) {
          const req = await multicall.aggregate([
            MiniAAContract.methods.totalDepositedPoints(i),
            MiniAAContract.methods.claimStatusRewardPool(i, _user),
            MiniAAContract.methods.getUserDeposit(i, _user),
          ]);
          let obj = {
            day: i,
            pointInPool: req[0],
            isClaimed: req[1],
            amount: req[2],
          };
          transactionArray.push(obj);
        }
        setAllDays(transactionArray);
        setLoading(false);
        console.log("Loading at end ....", loading);
      } catch (err) {
        setLoading(false);
        console.log("Loading Catch Block ....", loading);
        console.log("Error: ", err);
      }
    }
  };

  useEffect(() => {
    console.log("All Days Updated: ", allDays);
  }, [allDays]);

  const fetchSigns = async (_amount, _user) => {
    try{
      const data = {
        points: _amount,
        userId: _user
      };
      const result = await axios.post(
        `${SERVER_BASE_URL}/v1/users/contract/points`,
        data
      );
      console.log("Result: ", result);

        return result.data.data;
    } catch (err) {
      console.log(err);
    }

  };

  const sentTxId = async (_txid, _user, _amount, _events) => {
    const data = {
      points: _amount,
      txHash: _txid,
      walletAddress: _user,
      events: _events
    }
    const result = await axios.post(`${SERVER_BASE_URL}/v1/users/reduce/points`, data);
    return result.data

  }

  const handelEnter = async (_points) => {
    console.log("User Balance: ", _points);
    if (window.ethereum) {
      try {
        setLoadingTx(true);
        const result = await fetchSigns(_points,user);
        const {amount, nounce, Sign} = await result;
        
        console.log(amount, nounce, Sign);
        if(Sign){
        const web3 = new Web3(window.ethereum);
        const MiniAAContract = new web3.eth.Contract(MiniAA.abi, MiniAddress);
        const req = await MiniAAContract.methods
          .depositPointsForReward(amount,Sign,nounce)
          .estimateGas({ from: user });
        if (req) {
          const tx = await MiniAAContract.methods
            .depositPointsForReward(amount,Sign,nounce)
            .send({ from: user });
          console.log("Tx Hash: ", tx);
          console.log("Calling an API with txid");
          const result = await sentTxId(tx.transactionHash, user, _points, tx.events);
          console.log("Result From Server: ", result);
          setLoadingTx(false);
          setReload(true);
        }
        }
      } catch (err) {
        console.log("Error: ", err);
        setLoadingTx(false);
        var errorCustom = JSON.parse(
          err.message.replace("Internal JSON-RPC error.", "").trim()
        );
        errorCustom = errorCustom.message
          .replace("execution reverted:", "")
          .trim();
        console.log(errorCustom);
        toast.error(errorCustom, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleClaim = async () => {
    if (window.ethereum) {
      try {
        setLoadingClaim(true);
        const web3 = new Web3(window.ethereum);
        const MiniAAContract = new web3.eth.Contract(MiniAA.abi, MiniAddress);
        const req = await MiniAAContract.methods
          .claimReward()
          .estimateGas({ from: user });
        if (req) {
          const tx = await MiniAAContract.methods
            .claimReward()
            .send({ from: user });
          console.log("Tx Hash: ", tx);
          setLoadingClaim(false);
          setReload(true);
        }
      } catch (err) {
        console.log("Error: ", err);
        setLoadingClaim(false);
        var errorCustom = JSON.parse(
          err.message.replace("Internal JSON-RPC error.", "").trim()
        );
        errorCustom = errorCustom.message
          .replace("execution reverted:", "")
          .trim();
        console.log(errorCustom);
        toast.error(errorCustom, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);
    const total = findDay();
    const pageNumber = data.selected + 1;
    let endItem = pageNumber * LIMIT;
    if (endItem > total) {
      endItem = total;
    }
    console.log("Page Number: ", pageNumber);
    console.log("Page Count: ", Math.ceil(total / LIMIT));
    setpageCount(Math.ceil(total / LIMIT));
    initRewardPool(user, endItem, LIMIT);
  };

  return (
    <>
      <Header user={user} setUser={setUser} />
      <div>
        <Container className="padding-container">
          <div className="heading">
            <h2>Daily Reward Points Pool</h2>
          </div>
          <div className="v-card-table">
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Today Myntist Reward</th>
                  <th>Your Myntist</th>
                  <th>Points in Pool</th>
                  <th>Balance</th>
                  <th>Your Deposit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="" colSpan={8}>
                      <div className="text-center">
                        {" "}
                        <InfinitySpin color="grey" />{" "}
                      </div>
                    </td>
                  </tr>
                ) : allDays.length > 0 ? (
                  allDays.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{data.day}</td>
                        <td>{data.day === day ? "Open" : "Closed"}</td>
                        <td>
                          {year >= 0
                            ? (
                                (YEARS[yearOnDay(data.day)] / 365) *
                                0.75
                              ).toFixed(2)
                            : 0}
                        </td>
                        <td>
                          {parseInt(data.amount) > 0
                            ? (parseInt(data.amount) /
                                parseInt(data.pointInPool)) *
                              (
                                (YEARS[yearOnDay(data.day)] / 365) *
                                0.75
                              ).toFixed(2)
                            : 0}
                        </td>
                        <td>{parseInt(data.pointInPool)}</td>
                        <td>{userPoints?userPoints : <RotatingLines width="40" />}</td>
                        <td>
                          {parseInt(data.amount) > 0
                            ? parseInt(data.amount)
                            : 0}
                        </td>
                        <td>
                          {data.day === day ? (
                            loadingTx ? (
                              <td>
                                <RotatingLines width="40" />
                              </td>
                            ) : (
                              <Button
                                className="btn btn-primary"
                                // onClick={() =>
                                //   handelEnter(parseInt(data.usersBalance))
                                // }
                                onClick={handleShow}
                              >
                                Enter
                              </Button>
                            )
                          ) : data.day === day - 1 &&
                            parseInt(allDays[allDays.length - 2].amount) > 0 &&
                            !allDays[allDays.length - 2].isClaimed ? (
                            loadingClaim ? (
                              <td>
                                <RotatingLines width="40" />
                              </td>
                            ) : (
                              <Button
                                className="btn btn-theme-home"
                                onClick={() => handleClaim()}
                              >
                                Claim
                              </Button>
                            )
                          ) : (
                            <Button
                              className={`btn ${
                                data.isClaimed
                                  ? "btn-theme-home"
                                  : "btn-secondary"
                              }`}
                              disabled
                            >
                              {data.isClaimed ? "Claimd" : "Closed"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  ""
                  // <InfinitySpin color="grey" />
                )}
              </tbody>
            </Table>
          </div>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
            forcePage={pageCount - 1}
          />
        </Container>
      </div>

      <Modal className="transaction-modal" show={show} variant="white" centered>
        <Modal.Header>
          <CloseButton variant="white" onClick={handleClose} />
        </Modal.Header>

        <Modal.Body>
          <div className="transaction-wrapper">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enter Points Amount</Form.Label>
              <Form.Control
                className="mb-1"
                type="number"
                placeholder="No of Points e.g 10 ..."
                value={transactionAmount}
                onChange={(e) => {
                  setTransactionAmount(e.target.value);
                }}
              />
              <span className="error">{transactionAmountError}</span>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={submitTranscation}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PointsPool;
