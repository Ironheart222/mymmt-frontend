import {
  AsYouType,
} from "libphonenumber-js";

export const userLogout = () => {
  localStorage.removeItem("user_token");
  localStorage.removeItem("is_child");
  localStorage.removeItem("child_id");
};

// export const adminLogout = () => {
//     localStorage.removeItem("admin_token");
// }

export function currentWeek() {
  var currentdate: any = new Date();
  var oneJan: any = new Date(currentdate.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  return result;
}

export const phoneNumberformat = (value: string) => {
  const asYouType = new AsYouType();

  if (value) {
    return asYouType.input(`+${value}`);
  }
  return "-";
};
