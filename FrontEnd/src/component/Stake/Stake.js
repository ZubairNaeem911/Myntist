import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import { checkMetaMaskInstalled, findDay } from "../../reduxModules";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Header from "../Header/Header";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import * as echarts from "echarts";
import sha256 from "sha256";
import Timer from "../Helpers/Timer";
import { ethers } from "ethers";
import ReactTooltip from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import {currencyFormatter} from "currency-formatter";
const Stake = (props) => {
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast, removeToast } = useToasts();

  const [state, setState] = React.useState({
    stakeAmount: "",
    days: "",
    stakeLength: 0,
    stakeName: "",
    transferAddress: "",
  });
  const [daysError, setDaysError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [reward, setReward] = useState(0);
  const [biggerPayBetter, setBiggerPayBetter] = useState(0);
  const [longerPayBetter, setLongerPayBetter] = useState(0);
  const [activeStake, setActiveStake] = useState([]);
  const [stakeHistory, setStakeHistory] = useState([]);
  const [currentStakeData, setCurrentStakeData] = useState({});
  const [show, setShow] = useState(false);
  const [bpbUnits, setbpbUints] = useState("MYNT");
  const [lpbUnits, setlpbUints] = useState("MYNT");
  const [totalUint, setTotalUint] = useState("MYNT");
  const [total, setTotal] = useState(0);
  const [transferModal, setTransferModal] = useState(false);
  const [effectivePTP, setEffectivePTP] = useState(0);
  const [lastFullDay, setLastFullDay] = useState("--");
  const [endDay, setEndDay] = useState("--");
  const [loading, setLoading] = useState(false);
  const [shareRate, setShareRate] = useState(1);
  const [ptpPerTShare, setPtpPerTShare] = useState("10,000");
  const [stakeTShare, setStakeTShare] = useState(0);
  const [balance, setBalance] = useState(0);
  const [color, setColor] = useState("#3FE0D0");
  const [chartState, setChartState] = useState([]);
  let dayNext = new Date();
  dayNext.setDate(dayNext.getDate() + 1);
  const [startDate, setStartDate] = useState(dayNext);
  const [endDate, setEndDate] = useState(null);
  const [isDatePicker, setIsDatePicker] = useState(false);

  const onChangeDate = (end) => {
    let endDate = end[1] ? end[1] : end[0];
    let plusOne =
      startDate.toISOString().split("T")[0] ===
      endDate.toISOString().split("T")[0]
        ? 0
        : 1;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setState({
      ...state,
      days: diffDays + plusOne,
    });
    let endDay =
      parseInt(reduxState.currentDay + 1) + parseInt(diffDays + plusOne);
    let BPB = findBiggerPayBetter(
      state.stakeAmount,
      parseInt(diffDays + plusOne)
    );
    let LPB = findLongerPayBetter(
      state.stakeAmount,
      parseInt(diffDays + plusOne)
    );
    findTotal(LPB.share, BPB.share, BPB.uint, LPB.uint, state.stakeAmount);
    setEndDay(endDay);
    setLastFullDay(endDay - 1);
    setIsDatePicker(false);
  };
  useEffect(async () => {
    dispatch(findDay());
    await getChartData();
  }, []);

  useEffect(async () => {
    dispatch(checkMetaMaskInstalled());
    dispatch(findDay());
    await getStakeRecords();
    await findBalance();
    await getChartData();
  }, [reduxState.connection, reduxState.address]);

  const getChartData = async () => {
    if (reduxState.connection && reduxState.currentDay > 0) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/v1/shareRate/getShareRateRecords`
        );
        const records = res.data.records;
        let prevDayDataValue;
        const dataArray = [];

        for (let i = 1; i <= reduxState.currentDay; i++) {
          const dayRecord = records.filter((record) => {
            return record.dayNumber == i;
          });
          if (dayRecord.length === 0) {
            if (i === 1) {
              const perT_Share = (1000000000000 * 1) / 10 ** 8;
              const value = reduxState.marketPrice * perT_Share;
              const data = [i, parseInt(value)];
              prevDayDataValue = value;
              dataArray.push(data);
            } else {
              const data = [i, prevDayDataValue];
              dataArray.push(data);
            }
          } else {
            const sharePrice = dayRecord[0].newShareRate / 10 ** 5;
            const perT_Share = (1000000000000 * sharePrice) / 10 ** 8;
            const value = reduxState.marketPrice * perT_Share;

            const data = [i, parseInt(value)];
            prevDayDataValue = value;
            dataArray.push(data);
          }
        }
        const myChart = echarts.init(
          document.getElementById("mainChart")
          // ,null,{maxWidth:380,height:400}
        );

        myChart.setOption({
          responsive: true,
          maintainAspectRatio: false,
          title: {
            text: "T-Share Daily Price in $USD",
            textStyle: {
              color: "white",
              fontFamily: "Neon",
              fontWeight: 900,
              wordBreak: "break-all",
              fontSize: "17",
            },
          },
          xAxis: {
            axisLabel: {
              textStyle: {
                color: "white",
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "white",
              },
              formatter: "${value}",
            },
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              symbolSize: 10,
              color: "#0dcaf0",
              data: dataArray,
              type: "scatter",
            },
          ],
        });
        myChart.on("mouseover", function (params) {
          setChartState(params.data);
        });
        myChart.on("mouseout", function (params) {
          setChartState([]);
        });
      } catch (e) {
        console.log("Error Get Chart Data", e);
      }
    } else {
      const myChart = echarts.init(document.getElementById("mainChart"));

      myChart.setOption({
        title: {
          text: "T-Share Daily Price in $USD",
          textStyle: {
            color: "white",
            fontFamily: "Neon",
            fontWeight: 900,
            fontSize: "17",
          },
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              color: "white",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "white",
              wordBreak: "break-all",
            },
            formatter: "${value}",
          },
        },
        grid: {
          containLabel: true,
        },
        series: [
          {
            symbolSize: 0,
            color: "#0dcaf0",
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68],
            ],
            type: "scatter",
          },
        ],
      });
    }
  };

  const getStackFeatureReward = async () => {
    let amountInDollar = Number(state.stakeAmount) * reduxState.marketPrice;
    let slab = 0;
    if (amountInDollar >= 10 && amountInDollar < 20) {
      slab = 10;
    } else if (amountInDollar >= 20 && amountInDollar < 50) {
      slab = 20;
    } else if (amountInDollar >= 50 && amountInDollar < 100) {
      slab = 50;
    } else if (amountInDollar >= 100 && amountInDollar < 500) {
      slab = 100;
    } else if (amountInDollar >= 500 && amountInDollar < 1000) {
      slab = 500;
    } else if (amountInDollar >= 1000 && amountInDollar < 5000) {
      slab = 1000;
    } else if (amountInDollar >= 5000 && amountInDollar < 10000) {
      slab = 5000;
    } else if (amountInDollar >= 10000 && amountInDollar < 50000) {
      slab = 10000;
    } else if (amountInDollar >= 50000 && amountInDollar < 100000) {
      slab = 50000;
    } else if (amountInDollar >= 100000) {
      slab = 100000;
    } else {
      console.log("amount is less than $10");
    }

    if (amountInDollar >= 10) {
      const res = await axios.post(
        `${process.env.REACT_APP_GAMIFICATION_SERVER}/v1/users/event`,
        {
          eventName: `$${slab} one time`,
          userId: reduxState.address,
        }
      );
    }
  };

  const createStake = async () => {
    let infoToast;
    try {
      let amount = state.stakeAmount;
      amount = Number(amount);
      let days = state.days;
      days = parseInt(days);
      amount = parseInt(Number(amount * 10 ** 8));
      amount = amount.toLocaleString("fullwide", { useGrouping: false });
      amount = ethers.BigNumber.from(amount.toString());
      let shareCheck = effectivePTP / shareRate;
      if (shareCheck >= 1) {
        setLoading(true);
        let transaction = await reduxState.contractInstance.stakeStart(
          amount,
          days,
          state.stakeName
        );
        infoToast = addToast("Stake in process", {
          appearance: "info",
        });
        transaction = await transaction.wait();

        setState({ stakeAmount: "", days: "", stakeName: "" });
        setBiggerPayBetter(0);
        setLongerPayBetter(0);
        setTotal(0);
        setEffectivePTP(0);
        setStakeTShare(0);
        setTotalUint("MYNT");
        setlpbUints("MYNT");
        setbpbUints("MYNT");
        setEndDay("--");
        setLastFullDay("--");
        removeToast(infoToast);
        if (transaction.status === 1) {
          await getStackFeatureReward();
          await getStakeRecords();
          await findBalance();
          setReward("");
          setLoading(false);
          addToast("Stake completed successfully", {
            appearance: "success",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        } else {
          setLoading(false);
          addToast("Stake can't be completed ", {
            appearance: "error",
            autoDismissTimeout: 3000,
            autoDismiss: true,
          });
        }
      } else {
        addToast("Shares Too Low", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      }
    } catch (e) {
      removeToast(infoToast);
      setLoading(false);
      addToast("Stake can't be generated", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
      console.log("Create Stake Error", e);
    }
  };

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
    if (evt.target.name === "stakeAmount" || evt.target.name === "days") {
      var amount =
        evt.target.name === "stakeAmount" ? value : state.stakeAmount;
      var days = evt.target.name === "days" ? value : state.days;
      errorHandler(days, amount);
      let endDay = parseInt(reduxState.currentDay + 1) + parseInt(days);
      setEndDay(endDay);
      setLastFullDay(endDay - 1);
      if (amount == "" || amount == undefined) {
        amount = 0;
      }
      if (days == "" || days == undefined) {
        days = 1;
        setEndDay("--");
        setLastFullDay("--");
      }
      let BPB = findBiggerPayBetter(amount, days);
      let LPB = findLongerPayBetter(amount, days);

      findTotal(LPB.share, BPB.share, BPB.uint, LPB.uint, amount);
    }
  }

  function errorHandler(days, amount) {
    const userBalance = Number(balance);
    // console.log("DAYS", days, amount);
    if (userBalance < amount) {
      setPriceError("The amount cannot be more than your available MYNT!");
    }
    if (userBalance >= amount) {
      setPriceError("");
    }
    if (amount == 0 && amount !== "") {
      setPriceError("Amount must be greater than 0!");
    }
    if (days > 5555) {
      setDaysError("The stake length cannot be more than 5,555 days!");
    }
    if (days <= 5555) {
      setDaysError("");
    }
    if (days == 0 && days !== "") {
      setDaysError("Day must be greater than 0!");
    }
  }

  const findBalance = async () => {
    if (reduxState.connection && reduxState.address) {
      let balance = await reduxState.contractInstance.balanceOf(
        reduxState.address
      );

      balance = Number(balance._hex);
      balance = balance / 10 ** 8;
      setBalance(balance);
    }
  };

  const findTotal = (
    longerPayBetter,
    biggerPayBetter,
    bpbUint,
    lpbUint,
    ptpAmount
  ) => {
    let tempTotal = 0;
    let totalUint = "";
    ptpAmount = parseFloat(ptpAmount);
    if (longerPayBetter == 0) {
      totalUint = bpbUint;
    }

    if (biggerPayBetter == 0) {
      totalUint = lpbUint;
    }

    if (bpbUint === "Franks" && lpbUint === "MYNT" && longerPayBetter !== 0) {
      biggerPayBetter = biggerPayBetter / 10 ** 8;
      totalUint = "MYNT";
    }

    if (longerPayBetter === undefined) {
      longerPayBetter = 0;
    }
    tempTotal = longerPayBetter + biggerPayBetter;

    if (tempTotal === 0) {
      totalUint = "MYNT";
    }
    if (totalUint === "Franks") {
      let bonuses = tempTotal / 10 ** 8;
      if (bonuses < 0.1) {
        bonuses = 0;
      }
      let effectivePTP = ptpAmount + bonuses;
      const stakeTShare = effectivePTP / ptpPerTShare;
      setStakeTShare(stakeTShare);
      setEffectivePTP(effectivePTP);
    } else {
      let effectivePTP = ptpAmount + tempTotal;
      const stakeTShare = effectivePTP / ptpPerTShare;
      setStakeTShare(stakeTShare);
      setEffectivePTP(effectivePTP);
    }
    setTotalUint(totalUint);
    setTotal(tempTotal);
  };

  const findBiggerPayBetter = (amount, days) => {
    try {
      let minAmount = Math.min(amount, 150e6);
      let BPB = 0;
      BPB = amount * minAmount;
      let uint = "";
      BPB = BPB / 1500e6;
      if (BPB < 0.01) {
        BPB = BPB * 10 ** 8;
        if (BPB < 0.1) {
          BPB = 0;
        }
        uint = "Franks";
      } else {
        uint = "MYNT";
      }
      if (BPB === 0) {
        uint = "MYNT";
      }
      setbpbUints(uint);
      setBiggerPayBetter(BPB);
      return { share: BPB, uint: uint };
    } catch (e) {
      console.log("findBiggerPayBetter", e);
    }
  };

  const findLongerPayBetter = (amount, days) => {
    try {
      let LPB = 0;
      let uint = "MYNT";
      if (days !== 0 && days !== "") {
        days = days > 3641 ? 3641 : days;
        LPB = amount * (days - 1);
        LPB = LPB / 1820;
        if (LPB < 0.01) {
          LPB = LPB * 10 ** 8;
          uint = "Franks";
        } else {
          uint = "MYNT";
        }
        if (LPB === 0) {
          uint = "MYNT";
        }
        setlpbUints(uint);
        setLongerPayBetter(LPB);
        return { share: LPB, uint: uint };
      }
    } catch (e) {
      console.log("findLongerPayBetter", e);
    }
  };

  const calculateDayPercent = async (startDay, endDay) => {
    const total = endDay - startDay;
    const elaps = reduxState.currentDay - startDay;
    let percent = Math.round((elaps / total) * 100);
    if (percent > 100) {
      percent = 100;
    }
    if (percent < 0) {
      percent = 0;
    }
    return percent;
  };

  const getYieldData = async (
    startDay,
    endDay,
    myStakeShare,
    stakeAmount,
    dailySharesData,
    globalDataSet,
    updatedDayNum
  ) => {
    try {
      const currentDay = reduxState.currentDay;
      let day;
      let yieldOfStake = 0;
      let allAPY = 0;
      let yesterDayAPY = 0;
      let shareSum = 0;
      if (startDay > currentDay) {
        return { allAPY: 0, yesterDayAPY: 0, yieldOfStake: 0 };
      } else {
        if (endDay > currentDay) {
          day = currentDay;
        } else {
          day = endDay;
        }
        let prevUserShare = 0;
        for (let i = startDay; i <= day; i++) {
          let userShare = 0;
          if (i >= updatedDayNum) {
            if (i !== endDay) {
              if (prevUserShare === 0) {
                const dailyShare = globalDataSet.globalsDayCountPayOut;
                const totalStakedShare = globalDataSet.stakeSharesTotal;
                userShare = (dailyShare * myStakeShare) / totalStakedShare;
                prevUserShare = userShare;
              } else {
                userShare = prevUserShare;
              }
            }
          } else {
            if (i !== endDay) {
              const dailyShare =
                Number(dailySharesData[i]["dayPayoutTotal"]) / 10 ** 8;
              const totalStakedShare = Number(
                dailySharesData[i]["dayStakeSharesTotal"]
              );
              userShare = (dailyShare * myStakeShare) / totalStakedShare;
            }
          }
          shareSum = userShare + shareSum;
        }
        yieldOfStake = shareSum;
        allAPY = ((yieldOfStake / stakeAmount) * 365) / day;
        if (day > 1 && day >= updatedDayNum) {
          const dailyShare =
            Number(dailySharesData[updatedDayNum - 1]["dayPayoutTotal"]) /
            10 ** 8;
          const totalStakedShare = Number(
            dailySharesData[updatedDayNum - 1]["dayStakeSharesTotal"]
          );
          if (totalStakedShare !== 0) {
            const yesterDayYield =
              (dailyShare * myStakeShare) / totalStakedShare;
            yesterDayAPY = ((yesterDayYield / stakeAmount) * 365) / 1;
          }
        } else {
          const dailyShare =
            Number(dailySharesData[day - 1]["dayPayoutTotal"]) / 10 ** 8;
          const totalStakedShare = Number(
            dailySharesData[day - 1]["dayStakeSharesTotal"]
          );
          if (totalStakedShare !== 0) {
            const yesterDayYield =
              (dailyShare * myStakeShare) / totalStakedShare;
            yesterDayAPY = ((yesterDayYield / stakeAmount) * 365) / 1;
          }
        }
        return { allAPY, yesterDayAPY, yieldOfStake };
      }
    } catch (e) {
      console.log("Yield Function Error", e);
    }
  };

  const stakeRecords = async (count, address) => {
    return new Promise(async function (resolve1, reject1) {
      let promises = [];

      for (let i = 0; i < count; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            reduxState.contractInstance
              .stakeLists(address, i)
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

  const getStakeRecords = async () => {
    let activeStakes = [];

    try {
      if (reduxState.connection && reduxState.address) {
        setLoading(true);
        let count = await reduxState.contractInstance.stakeCount(
          reduxState.address
        );

        count = Number(count._hex);
        if (count > 0) {
          const claimPhaseEndDay = 350;
          const transactions = await stakeRecords(count, reduxState.address);
          const globalData = await reduxState.contractInstance.globals();
          const globalInfo = await reduxState.contractInstance.globalInfo();
          const claimedSatoshisTotal = Number(globalInfo[8]._hex);
          const claimedBtcAddrCount = Number(globalInfo[9]._hex);
          const stakePenaltyTotal =
            Number(globalData["stakePenaltyTotal"]._hex) / 10 ** 8;
          const sharePrice = globalData["shareRate"] / 10 ** 5;
          const perT_Share = (1000000000000 * sharePrice) / 10 ** 8;
          setShareRate(sharePrice);
          setPtpPerTShare(perT_Share);
          const updatedDayNum = globalData["dailyDataCount"];

          const stakeSharesTotal =
            Number(globalData["nextStakeSharesTotal"]._hex) +
            Number(globalData["stakeSharesTotal"]._hex);

          const stakedTokens =
            Number(globalData["lockedFranksTotal"]._hex) / 10 ** 8;

          let totalSupply = await reduxState.contractInstance.totalSupply();
          totalSupply = Number(totalSupply._hex);

          let globalsDayCountPayOut =
            ((totalSupply + stakedTokens) * 10000) / 100448995;
          console.log("TEST PAYOUT>>>>", totalSupply, stakedTokens);
          if (reduxState.currentDay < claimPhaseEndDay) {
            const adoptionBonus =
              (globalsDayCountPayOut * claimedBtcAddrCount) /
                Number(process.env.REACT_APP_CLAIMABLE_BTC_ADDR_COUNT) +
              (globalsDayCountPayOut * claimedSatoshisTotal) /
                Number(process.env.REACT_APP_CLAIMABLE_SATOSHIS_TOTAL);
            globalsDayCountPayOut = adoptionBonus + globalsDayCountPayOut;
          }
          globalsDayCountPayOut = globalsDayCountPayOut + stakePenaltyTotal;
          globalsDayCountPayOut = globalsDayCountPayOut / 10 ** 8;
          console.log("TEST PAYOUT>>>>", globalsDayCountPayOut);
          const dailySharesData = await dailyShareForYield(updatedDayNum);
          const globalDataSet = {
            globalsDayCountPayOut,
            stakedTokens,
            stakeSharesTotal,
          };
          for (let i = 0; i < transactions.length; i++) {
            const claimed = false;
            const id = transactions[i]["stakeId"];
            const numOfDays = transactions[i]["stakedDays"];

            const startDay = transactions[i]["lockedDay"];
            let endDay = transactions[i]["stakedDays"];
            endDay = endDay + startDay;
            let dayPercent = await calculateDayPercent(startDay, endDay);
            const isFreeStake = transactions[i]["isAutoStake"];
            const unlockedDays = transactions[i]["unlockedDay"];
            const stakeName = transactions[i]["newStakeName"];
            let stakeAmount = transactions[i]["stakedFranks"]._hex;
            stakeAmount = Number(stakeAmount);
            stakeAmount = stakeAmount / 10 ** 8;
            let stakeShare = Number(transactions[i]["stakeShares"]._hex);
            const tShare = parseFloat(stakeShare / 1000000000000).toFixed(4);
            const apys = await getYieldData(
              startDay,
              endDay,
              stakeShare,
              stakeAmount,
              dailySharesData,
              globalDataSet,
              updatedDayNum
            );

            let yieldOfStake = apys.yieldOfStake;
            yieldOfStake = parseFloat(yieldOfStake).toFixed(5);
            let allAPY = apys.allAPY;
            allAPY = parseFloat(allAPY).toFixed(5);

            let yesterDayAPY = apys.yesterDayAPY;
            yesterDayAPY = parseFloat(yesterDayAPY).toFixed(5);
            const data = {
              index: i,
              claimed,
              id,
              startDay,
              stakeAmount,
              endDay,
              dayPercent,
              isFreeStake,
              numOfDays,
              stakeName,
              yieldOfStake,
              allAPY,
              yesterDayAPY,
              unlockedDays,
              tShare,
            };
            if (claimed === true) {
              stakeHistory.push(data);
            } else {
              activeStakes.push(data);
            }
          }
          setActiveStake(activeStakes);
          const res = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/v1/stakeHistory/getUserStakes/${reduxState.address}`
          );
          const stakeHistory = res.data.stakes;
          setStakeHistory(stakeHistory);
        } else {
          const globalData = await reduxState.contractInstance.globals();
          const sharePrice = globalData["shareRate"] / 10 ** 5;
          const perT_Share = (1000000000000 * sharePrice) / 10 ** 8;
          setShareRate(sharePrice);
          setPtpPerTShare(perT_Share);
          const res = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/v1/stakeHistory/getUserStakes/${reduxState.address}`
          );
          const stakeHistory = res.data.stakes;
          setStakeHistory(stakeHistory);
          setActiveStake(activeStakes);
        }
        await getChartData();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log("getStakeRecords error", e);
    }
  };

  const claimStakeReward = async (data) => {
    let infoToast;
    try {
      setLoading(true);
      infoToast = addToast("Claim Transaction in process", {
        appearance: "info",
      });
      const transId = parseInt(data.id);
      let transaction = await reduxState.contractInstance.stakeEnd(
        data.index,
        transId
      );
      transaction = await transaction.wait();
      removeToast(infoToast);
      if (transaction.status === 1) {
        const events = transaction.events;
        let transferAmount;
        events.map(async (data) => {
          if (data.event === "ShareRateChange") {
            const hash = sha256(
              JSON.stringify({
                newShareRate: Number(data.args["shareRate"]._hex),
                dayNumber: reduxState.currentDay,
                secret: process.env.REACT_APP_SECRET,
              })
            );
            await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/v1/shareRate/createShareRateRecord`,
              {
                newShareRate: Number(data.args["shareRate"]._hex),
                dayNumber: reduxState.currentDay,
              },
              {
                headers: { authorization: hash },
              }
            );
          }
          if (data.event === "StakeEnd") {
            transferAmount = Number(data.args["stakeReturn"]._hex) / 10 ** 8;
          }
        });
        const yieldOfStake = Number(transferAmount) - Number(data.stakeAmount);
        const yieldValue = yieldOfStake <= 0 ? 0 : yieldOfStake;
        const hash = sha256(
          JSON.stringify({
            clientAddress: reduxState.address,
            allAPY: data.allAPY,
            endDay: data.endDay,
            isFreeStake: data.isFreeStake,
            stakeAmount: data.stakeAmount,
            stakeName: data.stakeName,
            startDay: data.startDay,
            lastDayAPY: data.yesterDayAPY,
            yieldOfStake: yieldValue,
            myntTransfer: transferAmount,
            marketPrice: reduxState.marketPrice,
            stakeTShare: data.tShare,
            stakeProgress: data.dayPercent,
            secret: process.env.REACT_APP_SECRET,
          })
        );
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/v1/stakeHistory/createStakeHistory`,
          {
            clientAddress: reduxState.address,
            allAPY: data.allAPY,
            endDay: data.endDay,
            isFreeStake: data.isFreeStake,
            stakeAmount: data.stakeAmount,
            stakeName: data.stakeName,
            startDay: data.startDay,
            lastDayAPY: data.yesterDayAPY,
            yieldOfStake: yieldValue,
            myntTransfer: transferAmount,
            marketPrice: reduxState.marketPrice,
            stakeTShare: data.tShare,
            stakeProgress: data.dayPercent,
          },
          {
            headers: { authorization: hash },
          }
        );

        addToast("Stake Claimed successfully", {
          appearance: "success",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
        await getStakeRecords();
        setLoading(false);
      }
    } catch (e) {
      removeToast(infoToast);
      await getStakeRecords();
      setLoading(false);
      console.log("claimStakeReward", e);
      addToast(e?.response?.data.message || "Stake can't be claimed ", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    setCurrentStakeData(data);
    setState({
      ...state,
      stakeLength: data.numOfDays,
    });
    setShow(true);
  };

  const transferModalClose = () => setTransferModal(false);

  const handleShowTransferModal = (data) => {
    setCurrentStakeData(data);
    // setState({
    //   ...state,
    //   transferAddress: reduxState.address,
    // });
    setTransferModal(true);
  };

  const transferStake = async () => {
    try {
      let transaction = await reduxState.contractInstance.stakeTransfer(
        currentStakeData.index,
        state.transferAddress
      );
      transferModalClose();
      setLoading(true);
      const infoToast = addToast("Transfer Stake in process", {
        appearance: "info",
      });
      transaction = await transaction.wait();
      setState({ stakeLength: 0 });
      removeToast(infoToast);

      if (transaction.status === 1) {
        addToast("Transfer Stake completed successfully", {
          appearance: "success",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
        // await getStakeRecords();
        setReward("");
      } else {
        // await getStakeRecords();

        addToast("Transfer Stake can't be completed ", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      }
      await getStakeRecords();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      await getStakeRecords();
      console.log("Transfer Stake Error", e);
    }
  };

  const GoodAccounting = async (data) => {
    let infoToast;
    try {
      setLoading(true);
      infoToast = addToast("Good Accounting in process", {
        appearance: "info",
      });
      const transId = parseInt(data.id);
      let transaction = await reduxState.contractInstance.stakeGoodAccounting(
        reduxState.address,
        data.index,
        transId
      );
      transaction = await transaction.wait();
      removeToast(infoToast);
      if (transaction.status === 1) {
        addToast("Good Accounting successfully", {
          appearance: "success",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      } else {
        addToast(" can't be perfrom this functionality ", {
          appearance: "error",
          autoDismissTimeout: 3000,
          autoDismiss: true,
        });
      }

      await getStakeRecords();
      setLoading(false);
    } catch (e) {
      removeToast(infoToast);
      console.log("Good Accounting", e);
      await getStakeRecords();
      setLoading(false);
      addToast(" can't be perfrom this functionality ", {
        appearance: "error",
        autoDismissTimeout: 3000,
        autoDismiss: true,
      });
    }
  };

  const dailyShareForYield = (updatedDayNum) => {
    return new Promise(async function (resolve1, reject1) {
      let promises = [];

      for (let i = 0; i < updatedDayNum; i++) {
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

  const maxAmountMynt = async () => {
    if (reduxState.connection && reduxState.address) {
      setState({
        ...state,
        stakeAmount: parseFloat(balance).toFixed(5),
      });
    }
  };

  const showDatePicker = () => {
    setIsDatePicker(!isDatePicker);
  };

  return (
    <>
      <Header />
      <div className="stake commom-bg">
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

        <Container className="padding-container stake-pg-container">
          <div className="heading">
            <h2>Stake</h2>
          </div>
          <Row>
            <Col xl={4} md={6}>
              <div className="input-fleids">
                <div className="form-floating mb-4 amount-hex">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Stake Name"
                    name="stakeName"
                    onChange={handleChange}
                    value={state.stakeName}
                    disabled={!reduxState.connection}
                  />
                  <label htmlFor="floatingPassword">Stake Name</label>
                </div>
                <div className="form-floating mb-4 amount-hex">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Stake Amount in MYNT"
                    name="stakeAmount"
                    onChange={handleChange}
                    value={state.stakeAmount}
                    disabled={!reduxState.connection}
                  />
                  <label htmlFor="floatingPassword">Stake Amount in MYNT</label>
                  <div className="field-btn__content">
                    <Button
                      disabled={!reduxState.connection}
                      onClick={() => maxAmountMynt()}
                    >
                      Max
                    </Button>
                  </div>
                  <span className="field-hex-text">MYNT</span>
                </div>

                <p className="text-danger">{priceError}</p>

                <div className="form-floating mb-4 amount-hex">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Stake Length in Days"
                    name="days"
                    onChange={handleChange}
                    value={state.days}
                    disabled={!reduxState.connection}
                  />
                  <label htmlFor="floatingPassword">Stake Length in Days</label>
                  <div className="field-btn__content">
                    <Button
                      disabled={!reduxState.connection}
                      onClick={showDatePicker}
                    >
                      D
                    </Button>
                  </div>
                  <span className="field-hex-text">Days</span>
                  {isDatePicker ? (
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        onChangeDate(date);
                      }}
                      startDate={startDate}
                      minDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      selectsEnd
                      className="react-datepicker"
                      disabledKeyboardNavigation
                    />
                  ) : (
                    ""
                  )}
                </div>

                <p className="text-danger">{daysError}</p>
                <div className="btn-and-text">
                  <div className="send-hex">
                    <Button
                      variant="primary"
                      onClick={() => createStake()}
                      disabled={
                        !reduxState.connection
                          ? true
                          : state.days === "" || state.amount === ""
                          ? true
                          : priceError || daysError
                          ? true
                          : false
                      }
                    >
                      STAKE
                    </Button>
                  </div>
                  <div className="stake-input-detail">
                    <div className="content-data">
                      <p>Start Day:</p>
                      <p>{reduxState.currentDay + 1}</p>
                    </div>
                    <div className="content-data">
                      <p>Last Full Day:</p>
                      <p>{lastFullDay}</p>
                    </div>
                    <div className="content-data">
                      <p>End Day:</p>
                      <p>{endDay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={4} md={6} className="stake-details-wrapper">
              <div className="stake-details">
                <h5>Stake Bonuses:</h5>
                <div className="content-data">
                  <p>Longer Pays Better:</p>
                  <p>
                    + {parseFloat(longerPayBetter).toFixed(3)} {lpbUnits}
                  </p>
                </div>
                <div className="content-data">
                  <p>Bigger Pays Better:</p>
                  <p>
                    + {parseFloat(biggerPayBetter).toFixed(3)} {bpbUnits}
                  </p>
                </div>
                <div className="content-data">
                  <p>Total:</p>
                  <p>
                    {parseFloat(total).toFixed(3)} {totalUint}
                  </p>
                </div>
                <div className="content-data">
                  <h6>
                    Effective MYNT:{" "}
                    <span
                      data-tip
                      data-for="effective-mynt"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </h6>
                  <p>{parseFloat(effectivePTP).toFixed(3)} MYNT</p>
                </div>

                <div className="content-data mt-4">
                  <h6>Share Price</h6>
                  <p>{ptpPerTShare} MYNT / T-Share</p>
                </div>
                <div className="content-data">
                  <h6>
                    Stake T-Shares{" "}
                    <span
                      data-tip
                      data-for="stake-tShare"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </h6>
                  <p>{parseFloat(stakeTShare).toFixed(4)}</p>
                </div>
              </div>
            </Col>
            <Col xl={4}>
              <div
                id="mainChart"
                style={{ width: "100%", height: "350px" }}
              ></div>
              <div className="d-flex ms-4 chart-day-usdt">
                <div className="day d-flex me-4">
                  <p className="me-3">Day:</p>
                  <p>{chartState?.length > 0 ? chartState[0] : "--"}</p>
                </div>
                <div className="USDT d-flex">
                  <div class="u-marker"></div>
                  <p className="me-3">USD:</p>
                  <p>{chartState?.length > 0 ? chartState[1] : "--"}</p>
                </div>
              </div>
              {/* <div>
                <Bubble
                  data={{
                    datasets: [
                      {
                        label: "T-Share Daily Close in $USD",
                        data: dataChart,
                        backgroundColor: "#0dcaf0",
                        fontColor: "#fff",
                        // borderWidth: 21,
                      },
                    ],
                  }}
                  // options={{
                  //   scales: {
                  //     x: { display: true, FontColor: "red" },
                  //     y: { display: true, FontColor: "red" },
                  //   },
                  //   scaleFontColor: "#000",
                  //   defaultColor:"red",
                  //   legend: {
                  //     fontColor: "blue",
                  //     scaleFontColor: "#fff",
                  //   },
                  // }}
                />
              </div> */}
            </Col>
          </Row>
          <div className="heading">
            <h2>Active Stakes</h2>
          </div>
          <div className="v-card-table stake-table">
            <Table className="mb-0" responsive="sm">
              <thead>
                <tr className="top-head">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan="2" className="text-center borderr">
                    %APY
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colspan="2" className="text-center borderr">
                    Current Value
                  </th>
                </tr>
                <tr>
                  <th>Stake Type</th>
                  <th>Stake Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Progress</th>
                  <th>
                    Yesterday{" "}
                    <span
                      data-tip
                      data-for="active-yesterday"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>
                    All{" "}
                    <span
                      data-tip
                      data-for="active-all"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>

                  <th>Principal</th>
                  <th>
                    T-Share{" "}
                    <span
                      data-tip
                      data-for="active-tShare"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>Yield</th>
                  <th>MYNT</th>
                  <th>
                    USD{" "}
                    <span
                      data-tip
                      data-for="active-usd"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th className="no-border"></th>
                  <th className="no-border"></th>
                </tr>
              </thead>
              <tbody>
                {activeStake && activeStake.length > 0 ? (
                  activeStake.map((data, i) => {
                    if (data.endDay !== 0) {
                      return (
                        <tr key={i}>
                          <td>
                            {data.isFreeStake ? "Free Stake" : "Simple Stake"}
                          </td>
                          <td>{data.stakeName}</td>
                          <td>{data.startDay}</td>
                          <td>{data.endDay}</td>
                          <td>{data.dayPercent}%</td>

                          <td>
                            {data.startDay === reduxState.currentDay
                              ? 0
                              : parseFloat(data.yesterDayAPY).toFixed(3)}{" "}
                            %
                          </td>
                          <td>{parseFloat(data.allAPY).toFixed(3)}%</td>
                          <td>{parseFloat(data.stakeAmount).toFixed(2)}</td>
                          <td>{data.tShare}</td>
                          <td>{parseFloat(data.yieldOfStake).toFixed(2)}</td>
                          <td>
                            {parseFloat(
                              Number(data.stakeAmount) +
                                Number(data.yieldOfStake)
                            ).toFixed(2)}
                          </td>
                          <td>
                            $
                            {parseFloat(
                              (Number(data.stakeAmount) +
                                Number(data.yieldOfStake)) *
                                reduxState.marketPrice
                            ).toFixed(2)}
                          </td>
                          {data.claimed === false &&
                          data.isFreeStake === false ? (
                            <td>
                              <div className="send-hex">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    claimStakeReward(data);
                                  }}
                                >
                                  Claim
                                </button>
                              </div>
                            </td>
                          ) : (
                            ""
                          )}

                          {data.claimed === false &&
                          //Free Stake Can't be ear;y claim
                          reduxState.currentDay >= data.endDay &&
                          data.isFreeStake === true ? (
                            <td>
                              <div className="send-hex">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    claimStakeReward(data);
                                  }}
                                >
                                  Claim
                                </button>
                              </div>
                            </td>
                          ) : (
                            ""
                          )}
                          {data.endDay <= reduxState.currentDay ? (
                            <td>
                              <div className="send-hex">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    GoodAccounting(data);
                                  }}
                                  disabled={
                                    data.unlockedDays > 0 ? true : false
                                  }
                                >
                                  GA
                                </button>
                              </div>
                            </td>
                          ) : (
                            ""
                          )}

                          {data.claimed === false &&
                          data.isFreeStake === false ? (
                            <td>
                              <div className="send-hex">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    handleShowTransferModal(data);
                                  }}
                                >
                                  Transfer
                                </button>
                              </div>
                            </td>
                          ) : (
                            ""
                          )}
                          {/* {data.endDayTimeStamp > moment().unix() &&
                            data.isFreeStake === true ? (
                              <td>
                                <div className="send-hex">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      handleShow(data);
                                    }}
                                  >
                                    Extend
                                  </button>
                                </div>
                              </td>
                            ) : (
                              ""
                            )} */}
                        </tr>
                      );
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan={12}>None</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="heading">
            <h2>Stake History</h2>
          </div>
          <div className="v-card-table stake-table">
            <Table className="mb-0" responsive="sm">
              <thead>
                <tr className="top-head">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colSpan="2" className="text-center borderr">
                    %APY
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th colspan="2" className="text-center borderr">
                    Final Value
                  </th>
                </tr>
                <tr>
                  <th>Stake Type</th>
                  <th>Stake Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Progress</th>
                  <th>
                    Last Day{" "}
                    <span
                      data-tip
                      data-for="history-lastDay"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>
                    All{" "}
                    <span
                      data-tip
                      data-for="history-all"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>

                  <th>Principal</th>
                  <th>
                    T-Share{" "}
                    <span
                      data-tip
                      data-for="history-tShare"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                  <th>Yield</th>
                  <th>MYNT</th>
                  <th>
                    USD{" "}
                    <span
                      data-tip
                      data-for="history-usd"
                      aria-hidden="true"
                      className="v-icon notranslate theme--dark yellow--text"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="question-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-question-circle fa-w-16 v-icon__component theme--dark yellow--text"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                          className=""
                        ></path>
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {" "}
                {stakeHistory && stakeHistory.length > 0 ? (
                  stakeHistory.map((data, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          {data.isFreeStake ? "Free Stake" : "Simple Stake"}
                        </td>
                        <td>{data.stakeName}</td>
                        <td>{data.startDay}</td>
                        <td>{data.endDay}</td>
                        <td>{data.stakeProgress}%</td>
                        <td> {parseFloat(data.lastDayAPY).toFixed(2)}%</td>
                        <td>{parseFloat(data.allAPY).toFixed(2)}%</td>
                        <td>{data.stakeAmount}</td>
                        <td>{data.stakeTShare}</td>
                        <td>{parseFloat(data.yieldOfStake).toFixed(2)}</td>
                        <td>{parseFloat(data.myntTransfer).toFixed(2)}</td>
                        <td>
                          $
                          {parseFloat(
                            Number(data.myntTransfer) * Number(data.marketPrice)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12}>None</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>

      {/* modal */}
      <Modal show={show} onHide={handleClose} className="extend-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Extend stake length</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0" }}>
          <span style={{ color: "#fff", fontWeight: "500" }}>
            Increase Days up to
          </span>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter number of days"
              name="stakeLength"
              onChange={handleChange}
              value={state.stakeLength}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="send-hex">
          <Button
            variant="secondary"
            className="btn-cancel"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="btn-save"
            onClick={() => {
              extendStakeLength();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Transfer Modal*/}
      <Modal
        show={transferModal}
        onHide={transferModalClose}
        className="extend-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer stake</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0" }}>
          <span style={{ color: "#fff", fontWeight: "500" }}>
            Transfer to Address
          </span>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Transfer Address"
              name="transferAddress"
              onChange={handleChange}
              value={state.transferAddress}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="send-hex">
          <Button
            variant="secondary"
            className="btn-cancel"
            onClick={transferModalClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="btn-save"
            onClick={() => {
              transferStake();
            }}
          >
            Save Changes
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
      {/* Active Stake Tables tooltip */}
      <ReactTooltip
        className="react-tooltip"
        id="active-usd"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">
          Based on the daily BNB/MYNTIST and USDC/BNB rates on <br /> combined
          Uniswap V1 and Uniswap V2 at 05:00 AM.
        </p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="active-tShare"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">
          1 T-Share = 10<sup>12</sup>
        </p>
        <p className="mb-0">1 T-Share = 1,000,000,000,000 Shares</p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="active-all"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">%APY = (Yield / Principal) * (365 / Day Served)</p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="active-yesterday"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">%APY = (Yesterday's Yield / Principal) * 365</p>
      </ReactTooltip>
      {/* History Stake Tables tooltip */}
      <ReactTooltip
        className="react-tooltip"
        id="history-usd"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">
          Based on the daily BNB/MYNTIST and USDC/BNB rates on <br /> combined
          Uniswap V1 and Uniswap V2 at 05:00 AM.
        </p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="history-tShare"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">
          1 T-Share = 10<sup>12</sup>
        </p>
        <p className="mb-0">1 T-Share = 1,000,000,000,000 Shares</p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="history-lastDay"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">%APY = (Last Day's Yield / Principal) * 365</p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="history-all"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">%APY = (Yield / Principal) * (365 / Day Served)</p>
      </ReactTooltip>

      <ReactTooltip
        className="react-tooltip"
        id="effective-mynt"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">
          Effective MYNTIST = Stake Amount in MYNTIST + Stake Bonuses
        </p>
        <p className="mb-0">
          Only use for calculating the number of shares you receive.
        </p>
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="stake-tShare"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <p className="mb-0">Stake T-Share = Effective MYNTIST + Share Price</p>
        <p className="mb-0">
          1 T-Share = 10<sup>12</sup>
        </p>
        <p className="mb-0">1 T-Share = 1,000,000,000,000 Shares</p>
      </ReactTooltip>
    </>
  );
};

export default Stake;
