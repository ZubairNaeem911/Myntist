import { useEffect, useState } from "react";
import Web3 from "web3";
import { Container, Button, Table } from "react-bootstrap";
import Header from "./Header";
import { addressList, LIMIT } from "../utils/config";
import { findDay, findYear, yearOnDay } from "../utils/Helpers";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";
import { YEARS } from "../utils/RewardByYear";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import MiniAA from "../utils/ContractABI.json";
import Multicall from "@dopex-io/web3-multicall";

const MiniAddress = addressList.miniAA[97];
const MulticallAddress = addressList.multicall[97];

const FreePool = ({ user, setUser }) => {
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);
  const [allDays, setAllDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [pageCount, setpageCount] = useState(0);
  const [reload,setReload] = useState(false);
  // const [arrayByPromis, setArrayByPromis] = useState([]);
  const [claimText, setClaimText] = useState("Claim");

  useEffect(() => {
    console.log("Current User from User Effect: ", user);
    if (user) {
      const currentDay = findDay();
      setpageCount(Math.ceil(currentDay / LIMIT));
      const currentYear = findYear();
      setDay(currentDay);
      setYear(currentYear);
      initFreePool(user, currentDay, LIMIT);
    }
    // eslint-disable-next-line
  }, [user,reload]);

  const initFreePool = async (_user, _currentDay, _limit) => {
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
        // const promises = [];

        for (let i = start; i <= _currentDay; i++) {
          const req = await multicall.aggregate([
            MiniAAContract.methods.countFreeClaimers(i),
            MiniAAContract.methods.checkFreeDay(i, _user),
          ]);
          // const reqs = multicall.aggregate([
          //   MiniAAContract.methods.countFreeClaimers(i),
          //   MiniAAContract.methods.checkFreeDay(i, _user)
          // ]);
          let obj = {
            day: i,
            users: req[0],
            isEnter: req[1][0],
            isClaimed: req[1][1],
          };
          transactionArray.push(obj);
          // promises.push(reqs);
        }
        // const promisesArray = await Promise.all(promises);

        // setArrayByPromis(promisesArray);
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
    // console.log("Data with promis: ", arrayByPromis);
  }, [allDays]);

  const handelEnter = async () => {
    if (window.ethereum) {
      try {
        setLoadingTx(true);
        const web3 = new Web3(window.ethereum);
        const MiniAAContract = new web3.eth.Contract(MiniAA.abi, MiniAddress);
        const req = await MiniAAContract.methods
          .enterForFreeClaim()
          .estimateGas({ from: user });

        //   const result = await toast.promise(
        //     tx,
        //     {
        //       pending: 'Trx is pending',
        //       success: 'Confirmed 👌',
        //       error: 'Something went wrong! 🤯'
        //     },{
        //       position: "top-left",
        //     }
        // )
        if (req) {
          const tx = await MiniAAContract.methods
            .enterForFreeClaim()
            .send({ from: user });
          console.log("Tx Hash: ", tx);
        }
        setLoadingTx(false);
        setReload(true);
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
        setClaimText("Claimd");
        const web3 = new Web3(window.ethereum);
        const MiniAAContract = new web3.eth.Contract(MiniAA.abi, MiniAddress);
        const req = await MiniAAContract.methods
          .freeClaim()
          .estimateGas({ from: user });
        if (req) {
          const tx = await MiniAAContract.methods
            .freeClaim()
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
    initFreePool(user, endItem, LIMIT);
  };

  return (
    <>
      <Header user={user} setUser={setUser} />
      <div>
        <Container className="padding-container">
          <div className="heading">
            <h2>Daily Free Myntist Pool</h2>
          </div>
          <div className="v-card-table">
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Today Myntist Reward</th>
                  <th>Your Myntist</th>
                  <th>Users in Pool</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="" colSpan={6}>
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
                        <td>{data?.day}</td>
                        <td>{data?.day === day ? "Open" : "Closed"}</td>
                        <td>
                          {year >= 0
                            ? (
                                (YEARS[yearOnDay(data.day)] / 365) *
                                0.25
                              ).toFixed(2)
                            : 0}
                        </td>
                        <td>
                          {data.isEnter && parseInt(data.users) > 0
                            ? (
                                ((YEARS[yearOnDay(data.day)] / 365) * 0.25) /
                                parseInt(data.users)
                              ).toFixed(2)
                            : 0}
                        </td>
                        <td>{parseInt(data.users)}</td>

                        <td>
                          {data.day === day ? (
                            loadingTx ? (
                              <td>
                                <RotatingLines width="40" />
                              </td>
                            ) : (
                              <Button
                                className="btn btn-primary"
                                onClick={() => handelEnter()}
                              >
                                Enter
                              </Button>
                            )
                          ) : data.day === day - 1 &&
                            allDays[allDays.length - 2].isEnter &&
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
                                {claimText}
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
                  <tr>
                    <td className="" colSpan={6}>
                      <div className="text-center">
                        {/* {" "}
                        <InfinitySpin color="grey" />{" "} */}
                      </div>
                    </td>
                  </tr>
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
    </>
  );
};

export default FreePool;
