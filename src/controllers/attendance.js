const { calculateTotalHours, safePromise, formatTime } = require("../utils");
const User = require("./../services/user.js");
const Attendance = require("./../services/attendance.js");

async function mark(req, res) {
  try {
    const { checkInTime, checkOutTime, email, date } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser(email));
    if(findUserErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    const userData = findUserRes.data[0];

    const totalWorkHours = calculateTotalHours(checkInTime, checkOutTime);

    const [findAttDataErr, findAttDataRes] = await safePromise(Attendance.fetchAttendance({ date: date, user_id: userData.id  }));
    if(findAttDataErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    if(!findAttDataRes || !findAttDataRes.data.length) {
      const attendanceData = {
        user_id: userData.id,
        date: date,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        total_work_hours: totalWorkHours
      }
  
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
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        total_work_hours: totalWorkHours,
        updated_at: new Date().toISOString(),
      }
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
    const { email, date } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser(email));
    if(findUserErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
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
        msg: "No Data Found",
        data: {}
      })
    }

    const response = {
      checkInTime: formatTime(findAttDataRes.data[0].check_in_time),
      checkOutTime: formatTime(findAttDataRes.data[0].check_out_time),
      date: findAttDataRes.data[0].date,
      totalWorkHours: findAttDataRes.data[0].total_work_hours
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

module.exports = {
  mark,
  fetch
}