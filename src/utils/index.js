const { compareSync } = require("bcrypt");

const safePromise = (promise) => promise.then(data => ([null, data])).catch(err => ([err]));

const passwordCompare = (plainPassword, encryptedPassword) => {
  let matched = false;
  try {
    matched = compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    return matched;
  }
  return matched
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
}

const formatTime = (timeString) => {
  const timeWithoutTimezone = timeString.split('+')[0]; 

  const dateObj = new Date(`1970-01-01T${timeWithoutTimezone}Z`);
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

const getPaginationRange = (page, pageSize) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { offset, limit };
}

module.exports = {
  safePromise,
  passwordCompare,
  calculateTotalHours,
  formatTime,
  getPaginationRange
}