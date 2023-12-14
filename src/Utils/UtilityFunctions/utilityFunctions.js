//----------------------yyyy-mm-dd to dd/mm/yyyy 
export const formatDate = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    } else {
      return "Invalid Date";
    }
  };

  //---------------------- dd/mm/yyyy to yyyy-mm-dd
export const formatDateReverse = (data) => {
  var date = data;
  var newdate = date.split("/").reverse().join("-");
  return newdate;
};