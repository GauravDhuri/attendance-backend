const { calculateTotalHours, safePromise, formatTime } = require("../utils");
const User = require("./../services/user.js");
const Attendance = require("./../services/attendance.js");

async function mark(req, res) {
  try {
    const { checkInTime, checkOutTime, email, date } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser({ email }));
    if(findUserErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    const userData = findUserRes.data[0];
    let totalWorkHours = null;
    if(checkInTime && checkOutTime) totalWorkHours = calculateTotalHours(checkInTime, checkOutTime);

    const [findAttDataErr, findAttDataRes] = await safePromise(Attendance.fetchAttendance({ date: date, user_id: userData.id }));
    if(findAttDataErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    if(!findAttDataRes || !findAttDataRes.data.length) {
      const attendanceData = {
        check_in_time: checkInTime,
        user_id: userData.id,
        date: date,
      }
      if(checkOutTime) attendanceData.check_out_time = checkOutTime;
      if(totalWorkHours) attendanceData.total_work_hours = totalWorkHours;
  
      const [addErr, _addRes] = await safePromise(Attendance.addAttendance(attendanceData));
      if(addErr) {
        return res.status(500).json({
          status: false,
          msg: "Internal Error",
          data: {}
        })
      }
    } else {
      const updateAttendance = {
        total_work_hours: totalWorkHours,
        updated_at: new Date().toISOString(),
      }
      if(checkInTime) updateAttendance.check_in_time = checkInTime;
      if(checkOutTime) updateAttendance.check_out_time = checkOutTime;

      const updateId = findAttDataRes.data[0].id;
      const [updateErr, _updateRes] = await safePromise(Attendance.updateAttendance(updateAttendance, updateId));
      if(updateErr) {
        return res.status(500).json({
          status: false,
          msg: "Internal Error",
          data: {}
        });
      }
    }

    return res.status(200).json({
      status: true,
      msg: "success",
      data: {}
    });
  } catch (error) {
    console.log('error in marking attendance', error);
    return res.status(500).json({
      status: false,
      msg: "Something went wrong",
      data: {}
    })
  }
}

async function fetch(req, res) {
  try {
    const { email, date, name } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser({ email, name }));
    if(findUserErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    if(!findUserRes || !findUserRes.data.length) {
      return res.status(200).json({
        status: true,
        msg: "No user found",
        data: {}
      })
    }
    const userData = findUserRes.data[0];

    const [findAttDataErr, findAttDataRes] = await safePromise(Attendance.fetchAttendance({ date: date, user_id: userData.id }));
    if(findAttDataErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    if(!findAttDataRes || !findAttDataRes.data.length) {
      return res.status(200).json({
        status: true,
        msg: `No attendace for ${date}`,
        data: {}
      })
    }

    const response = {
      checkInTime: findAttDataRes.data[0].check_in_time ? formatTime(findAttDataRes.data[0].check_in_time) : null,
      checkOutTime: findAttDataRes.data[0].check_out_time ? formatTime(findAttDataRes.data[0].check_out_time) : null,
      date: findAttDataRes.data[0].date,
      totalWorkHours: findAttDataRes.data[0].total_work_hours ? findAttDataRes.data[0].total_work_hours : 'N/A'
    };

    return res.status(200).json({
      status: true,
      msg: "success",
      data: response
    })

  } catch (error) {
    console.log('error in fetching attendance', error);
    return res.status(500).json({
      status: false,
      msg: "Something went wrong",
      data: {}
    })
  }
}

async function fetchAll(req, res) {
  try {
    const { email, name, department, pagination, skipPagination, dateRange } = req.body;

    let userData;

    if(email || name || department) {
      const [findUserErr, findUserRes] = await safePromise(User.findUser({ email, name, department }));
      if (findUserErr) {
        return res.status(500).json({
          status: false,
          msg: 'Internal Error',
          data: {},
        });
      }
  
      if(!findUserRes || !findUserRes.data.length) {
        return res.status(200).json({
          status: true,
          msg: "No user found",
          data: {}
        })
      }

      userData = findUserRes.data;
    }

    const findAttendanceObj = {}

    if(userData) {
      const userIds = userData.map((user) => user.id);
      findAttendanceObj.user_id = userIds;
    }
    if(department) findAttendanceObj.department = department;
    if(dateRange) findAttendanceObj.dateRange = dateRange;
    if(skipPagination) {
      findAttendanceObj.skipPagination = skipPagination
    } else {
      findAttendanceObj.pagination = pagination
    }

    const [findAttDataErr, findAttDataRes] = await safePromise(Attendance.fetchAllAttendance(findAttendanceObj));
    if (findAttDataErr) {
      return res.status(500).json({
        status: false,
        msg: 'Internal Error',
        data: {},
      });
    }

    const records = findAttDataRes.data.records.map(({ check_in_time, check_out_time, date, total_work_hours, users }) => ({
      checkInTime: check_in_time ? formatTime(check_in_time) : null,
      checkOutTime: check_out_time ? formatTime(check_out_time) : null,
      date,
      totalWorkHours: total_work_hours ? total_work_hours : 'N/A',
      name: users.user_name,
      department: users.department
    }));

    const response = {
      records,
      ...(pagination && {
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalCount: findAttDataRes.data.count,
          totalPages: Math.ceil(findAttDataRes.data.count / pagination.pageSize),
        },
      }),
    };

    if(!response.records.length) {
      return res.status(200).json({
        status: true,
        msg: "No attendace data found",
        data: {}
      })
    }

    return res.status(200).json({
      status: true,
      msg: "success",
      data: response
    })
  } catch (error) {
    console.log('error in fetching all attendance', error);
    return res.status(500).json({
      status: false,
      msg: "Something went wrong",
      data: {}
    })
  }
}

module.exports = {
  mark,
  fetch,
  fetchAll
}