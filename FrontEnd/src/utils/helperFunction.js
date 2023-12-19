import axios from "axios";
export const checkRefererAddress = async (address) =>{
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/v1/refralManagment/userReferal/${address}`
  );
  return response.data.address;
}

