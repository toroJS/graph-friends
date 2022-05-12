import * as moment from "moment";

export default class Helper {
  static doSomething(val: string) {
    return val;
  }
  public static sortByDate(
    array: any[],
    propName: string,
    direction: "asc" | "desc"
  ) {
    const sorted = array.sort((a, b) => a[propName].diff[propName]);
    return direction === "asc" ? sorted : sorted.reverse();
  }

  public static timeDifference(date1, date2) {
    var difference = date1 - date2;

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    var secondsDifference = Math.floor(difference / 1000);

    console.log(
      "difference = " +
        daysDifference +
        " day/s " +
        hoursDifference +
        " hour/s " +
        minutesDifference +
        " minute/s " +
        secondsDifference +
        " second/s "
    );
    return daysDifference;
  }

  public static calculateConnectionState(diff: number, intFreq: number) {
    const delay = diff - intFreq;
    let state = "";
    if (delay <= 0) {
      state = "state1";
      console.log("state 1: On Point");
    } else if (delay > 0 && delay <= 3) {
      state = "state2";
      console.log("state 2: 1 - 3 days");
    } else if (delay > 3 && delay <= 6) {
      state = "state3";
      console.log("state 3: 4 - 6 days");
    } else if (delay > 6 && delay <= 8) {
      state = "state4";
      console.log("state 4: 7 - 8 days");
    } else if (delay > 8) {
      state = "state5";
      console.log("state 4: more than 8  days");
    }
    return state;
  }
}
