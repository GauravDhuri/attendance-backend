const { calculateTotalHours, safePromise } = require("../utils");
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

    const attendanceData = {
      user_id: userData.id,
      date: date,
      check_in_time: checkInTime,
      check_out_time: checkOutTime,
      total_work_hours: totalWorkHours
    }

    const [addErr, addRes] = await safePromise(Attendance.addAttendance(attendanceData));
    if(addErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      })
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

module.exports = {
  mark
}