import { STARTDATE, DAY, YEAR } from './config';

    export const findDay = () => {
    const time = Math.floor(Date.now() / 1000);
    const day = Math.floor((time - STARTDATE) / DAY);
    console.log("Day: ", day);
    return day;
    }
  export const findYear = () => {
    const time = Math.floor(Date.now() / 1000);
    const year = Math.floor((time - STARTDATE) / YEAR);
    console.log("Year: ", year);
    return year;
  }

  export const yearOnDay = (_day) => {
    const secondsofDays = STARTDATE + (_day * DAY);
    const yearThisDay = Math.floor((secondsofDays - STARTDATE) / YEAR);
    // console.log(`Year on Day ${_day} is ${yearThisDay}`);
    return yearThisDay;
  }