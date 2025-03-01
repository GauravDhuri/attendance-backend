async function fetchAttendance(attendanceData) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const { data, error } = await supaBase.supabaseClient.from("attendance").select("*").eq("date", attendanceData.date).eq("user_id", attendanceData.user_id);
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

async function updateAttendance(attendanceData, updateId) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const { data, error } = await supaBase.supabaseClient.from("attendance").update(attendanceData).eq("id", updateId);
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
  fetchAttendance,
  addAttendance,
  updateAttendance
}