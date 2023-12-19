const initialState = {
  isInstalled: true,
  address: "",
  balance: 0,
  contractInstance: "",
  connectionError: "",
  connection: false,
  transactionsData: [],
  transactionsDataError: "",
  sinkTransactionsData: [],
  sinkTransactionsDataError: "",
  currentDay: 0,
  count: 0,
  shareRate:1,
  marketPrice:0.001
};

function handleChange(state, change) {
  const { count } = state;
  return ({
    count: count + change
  })
}
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Installed":
      return { ...state, isInstalled: true };
    case "NotInstalled":
      return { ...state, isInstalled: false };
    case "ADD_NUMBER":
      return handleChange(state, action.payload);
    case "Success Connecting":
      return {
        ...state,
        address: action.payload.address,
        balance: action.payload.balance,
        contractInstance: action.payload.contractInstance,
        connection: true,
        latestBlockNumber:action.payload.latestBlockNumber
      };

    case "Error Connecting":
      return {
        ...state,
        connectionError: action.payload,
      };

    case "Transactions Success":
      return {
        ...state,
        transactionsData: action.payload,
      };
    case "Transactions Fail":
      return {
        ...state,
        transactionsDataError: action.payload,
      };
    case "Sink Transactions Success":
      return {
        ...state,
        sinkTransactionsData: action.payload,
      };
    case "Sink Transactions Fail":
      return {
        ...state,
        sinkTransactionsDataError: action.payload,
      };
    case "Find Day Success":
      return {
        ...state,
        currentDay: action.payload,
      };
    case "Find Day Fail":
      return {
        ...state,
        currentDay: action.payload,
      };
    case "Clear State":
      return { state: initialState };
    default:
      return state;
  }
};
export default rootReducer;
