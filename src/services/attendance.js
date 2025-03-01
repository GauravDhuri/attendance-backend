async function addAttendance(attendanceData) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const { data, error } = await supaBase.supabaseClient.from("attendance").insert([attendanceData]);
  if(error) {
    return Promise.reject({
      success: false,
      data: error
    });
  }

  return Promise.resolve({
    success: true,
    data: data
  })
}

module.exports = {
  addAttendance
}