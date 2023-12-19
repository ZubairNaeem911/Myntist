import React, { useState, useEffect } from 'react';
import moment from "moment";

const Timer = () => {
    const [remain, setRemain] = useState(0);

    useEffect(() => {
        reaminigTime();
      }, []);

    const reaminigTime = () => {
        let startTime = parseInt(process.env.REACT_APP_START_DATE);
        let currentTime = parseInt(moment().unix());
    
        let timeDiff = startTime - currentTime;
    
        let scnds = timeDiff % 60;
        let minutes = parseInt(timeDiff / 60);
        let minutesActual = minutes % 60;
        let hours = parseInt(minutes / 60);
        // hours = hours % 60;
        setRemain(`${hours} Hours - ${minutesActual} Minutes - ${scnds} Seconds`);
      };
    
      setInterval(() => {
        reaminigTime();
      }, 1000);

  return (
    <>
        {parseInt(moment().unix()) >= process.env.REACT_APP_START_DATE ? (
          ""
        ) : (
          <>
            <h3 style={{color: "#fff"}} className="mb-2 ms-3 pt-4 text-center">{`Remaining Time `}</h3>
            <h3 style={{color: "#fff"}} className="ms-3 text-center">{`${remain}`}</h3>
          </>
        )}
    </>
  )
}

export default Timer