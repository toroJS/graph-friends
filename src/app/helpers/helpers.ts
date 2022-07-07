import * as moment from "moment";
import { ConnectionState } from "../models/types";

export default class Helper {
  public static goalInteraction(intFreq): string {
    const interactionFrequencyString = new Map([
      [1, "Daily"],
      [7, "Weekly"],
      [30, "Monthly"],
    ]);

    return interactionFrequencyString.get(parseInt(intFreq));
  }

  static doSomething(val: string) {
    return val;
  }
  public static sortByDate(
    array: any[],
    propName: string,
    direction: "asc" | "desc"
  ) {
    const sorted = array.sort((a, b) => {
      return moment(a[propName]).diff(b[propName]);
    });
    return direction === "asc" ? sorted : sorted.reverse();
  }

  public static isBeforeNow(date) {
    const now = moment();
    const diff = Helper.timeDifference(now.valueOf(), date.valueOf());
    return diff >= 0 ? true : false;
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

    return daysDifference;
  }

  public static calculateConnectionState(diff: number, intFreq: number) {
    const delay = diff - intFreq;
    console.log(delay);

    console.log(delay);

    let state: ConnectionState;
    if (delay <= 0) {
      state = ConnectionState.State1;
      //console.log("state 1: On Point");
    } else if (delay > 0 && delay <= 3) {
      state = ConnectionState.State2;
      //console.log("state 2: 1 - 3 days");
    } else if (delay > 3 && delay <= 6) {
      state = ConnectionState.State3;
      //console.log("state 3: 4 - 6 days");
    } else if (delay > 6 && delay <= 8) {
      state = ConnectionState.State4;
      //console.log("state 4: 7 - 8 days");
    } else if (delay > 8) {
      state = ConnectionState.State5;
      //console.log("state 4: more than 8  days");
    }

    return state;
  }
}
