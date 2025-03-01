const { getPaginationRange } = require("../utils/index.js");

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

async function fetchAllAttendance(attendanceData) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const query = supaBase.supabaseClient.from("attendance").select("*", { count: 'exact' }).eq("user_id", attendanceData.user_id);

  if(attendanceData.pagination) {
    const { page, pageSize } = attendanceData.pagination;
    const { offset, limit } = getPaginationRange(page, pageSize);
    query.range(offset, offset + limit - 1);
  }

  if(attendanceData.dateRange) {
    query.gte("date", attendanceData.dateRange.startDate);
    query.lte("date", attendanceData.dateRange.endDate);
  }

  const { data, count, error } = await query;
  if(error) {
    return Promise.reject({
      success: false,
      data: error
    });
  }

  return Promise.resolve({
    success: true,
    data: {
      records: data,
      count: count
    }
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
  fetchAllAttendance,
  addAttendance,
  updateAttendance
}