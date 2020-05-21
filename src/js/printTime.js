export default function printTime(valueDate) {
  function addNullToDate(value) {
    const newValue = value < 10 ? `0${value}` : value;
    return newValue;
  }
  const newDate = new Date(valueDate);
  const date = addNullToDate(newDate.getDate());
  const month = addNullToDate(newDate.getMonth() + 1);
  const year = addNullToDate(newDate.getFullYear());
  const hours = addNullToDate(newDate.getHours());
  const minutes = addNullToDate(newDate.getMinutes());
  const shownDate = `${hours}:${minutes} ${date}.${month}.${year}`;
  return shownDate;
}