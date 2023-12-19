export const addressList = {
    miniAA: {
        97: '0xffb60038Bc7bFFA537a342b96dEF10243cc08D14',   // miniAA contract address bscTestnet
        56: '0xffb60038Bc7bFFA537a342b96dEF10243cc08D14',   // miniAA contract address bscMainnet
    },
    multicall: {
        97: '0x7a48b8094ccd7053af2D4E188e10E2b8c0dDDc2e',   // no need to update 
        56: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',   // no need to update
    }
}

export const STARTDATE = 1664342893;    // MiniAA Start date in unix timestamp
export const DAY = 360;                 // DAY must be equal to miniAA day length in seconds
export const YEAR = 4320;               // YEAR must be equal to miniAA year length in seconds
export const LIMIT = 10;                // Rows to display per page 
export const SERVER_BASE_URL = "https://6617-202-166-170-107.ap.ngrok.io";  //Backend Server Base URL