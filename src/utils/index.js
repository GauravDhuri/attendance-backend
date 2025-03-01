const { compareSync } = require("bcrypt");

const safePromise = (promise) => promise.then(data => ([null, data])).catch(err => ([err]));

async function passwordCompare(plainPassword, encryptedPassword) {
  let matched = false;
  try {
    matched = compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    console.log("error", error);
    return matched;
  }
}

const calculateTotalHours = (checkInTime, checkOutTime) => {
  const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
  const [checkOutHour, checkOutMinute] = checkOutTime.split(':').map(Number);

  const checkInDate = new Date();
  checkInDate.setHours(checkInHour, checkInMinute, 0, 0);

  const checkOutDate = new Date();
  checkOutDate.setHours(checkOutHour, checkOutMinute, 0, 0);

  const diffInMilliseconds = checkOutDate - checkInDate;

  const totalHours = diffInMilliseconds / (1000 * 60 * 60);

  return totalHours;
};


module.exports = {
  safePromise,
  passwordCompare,
  calculateTotalHours
}