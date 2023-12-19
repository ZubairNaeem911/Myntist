import { ethers } from "ethers";
import tokenContractAbi from "../utils/tokenContractAbi.json";
import axios from "axios";
import moment from "moment";
// import Web3 from "web3";
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
const ADD_NUMBER = "ADD_NUMBER";
// providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider, // required
//     options: {
//       infuraId: "d5553721d40c4c96a04c50e69d7c4e3d", // required
//     },
//   },
// };
// web3Modal = new Web3Modal({
//   // network: "ropsten", // optional
//   cacheProvider: true, // optional
//   providerOptions: this.providerOptions, // required
// });
// function initWeb3(provider) {
//   const web3 = new Web3(provider);

//   web3.eth.extend({
//     methods: [
//       {
//         name: "chainId",
//         call: "eth_chainId",
//         outputFormatter: web3.utils.hexToNumber,
//       },
//     ],
//   });

//   return web3;
// };
// actions
const IsInstalled = () => {
  return {
    type: "Installed",
  };
};
const notInstalled = () => {
  return {
    type: "NotInstalled",
  };
};

const clearUpdatedState = () => {
  return {
    type: "Clear State",
  };
};

export const AddAction = () => {
  return {
    type: ADD_NUMBER,
    payload: 1,
  };
};

export const clearState = () => {
  return (dispatch) => {
    dispatch(clearUpdatedState());
  };
};

export const checkMetaMaskInstalled = () => {
  return (dispatch) => {
    window.addEventListener("load", () => {
      try {
        if (typeof web3 !== "undefined") {
          dispatch(IsInstalled());
        } else {
          dispatch(notInstalled());
        }
      } catch (e) {
        console.log(e);
      }
    });
  };
};

const onSuccessConnect = (data) => {
  return {
    type: "Success Connecting",
    payload: data,
  };
};

const onFailureConnect = (error) => {
  return {
    type: "Error Connecting",
    payload: error,
  };
};

export const onConnect = () => {
  return async (dispatch) => {
    // const provider = await this.web3Modal.connect();
    // const web3 = await this.initWeb3(provider);
    // const accounts = await web3.eth.getAccounts();
    // const address = accounts[0];
    // let balance = await web3.eth.getBalance(address);
    // const networkId = await web3.eth.net.getId();
    // const chainId = await web3.eth.chainId();
    // console.log('>>>>>>>>>>>>>>>.',networkId,chainId,balance,address);



    if(window.web3) {



      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const network = await provider.getNetwork();

      if (network.chainId === 97) {
        console.log("CONNECTING..........")
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const latestBlockNumber = await provider.getBlockNumber();
        
        let balance = await provider.getBalance(address);
        balance = ethers.utils.formatEther(balance);

        const TokenContract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          tokenContractAbi,
          signer
        );
        let data = {
          address: address,
          balance: balance,
          contractInstance: TokenContract,
          latestBlockNumber
        };
        dispatch(onSuccessConnect(data));
      } else {
        dispatch(onFailureConnect("Error Conencting..."));
        window.alert("Please Connect to Binance Network First ");
      }
    } else {
      alert('Please install metamask.')
    }
  };
};

const onTransactionsSuccess = (data) => {
  return {
    type: "Transactions Success",
    payload: data,
  };
};

const onTransactionsFails = (e) => {
  return {
    type: "Transactions Fail",
    payload: e,
  };
};

export const getTransactionHash = () => {
  return async (dispatch) => {
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const apiKey = process.env.REACT_APP_BINANCE_API_KEY;
      const transactionList = await axios.get(
        `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`
      );
      dispatch(onTransactionsSuccess(transactionList.data.result));
    } catch (e) {
      dispatch(onTransactionsFails(e));
    }
  };
};

const onSinkTransactionsSuccess = (data) => {
  return {
    type: "Sink Transactions Success",
    payload: data,
  };
};

const onSinkTransactionsFails = (e) => {
  return {
    type: "Sink Transactions Fail",
    payload: e,
  };
};

export const getTransactionHashSinkContract = () => {
  return async (dispatch) => {
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_SINK;
      const apiKey = process.env.REACT_APP_BINANCE_API_KEY;
      const transactionList = await axios.get(
        `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`
      );
      dispatch(onSinkTransactionsSuccess(transactionList.data.result));
    } catch (e) {
      dispatch(onSinkTransactionsFails(e));
    }
  };
};

export const findDay = () => {
  return (dispatch) => {
    try {
      const date = moment().unix();
      let day = date - process.env.REACT_APP_START_DATE;
      day = Math.floor(day / process.env.REACT_APP_TIMESLOT);
      dispatch({ type: "Find Day Success", payload: day });
      console.log("FIND DAY STore LOG",day);
    } catch (e) {
      dispatch({ type: "Find Day Fail", payload: e });
    }
  };
};
