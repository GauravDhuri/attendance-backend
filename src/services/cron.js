const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Attendance = require('./attendance.js');
const User = require('./user.js');
const { safePromise } = require('../utils/index.js');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  service: 'sendgrid',
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_SECRET,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendReminderEmail = async (userEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Cron Job 1: Reminder to check-in at 11 AM for users who have not checked in
cron.schedule('0 11 * * *', async () => {
  try {
    const [err, userRes] = await safePromise(User.findUser({}));
    const users = userRes.data;
    for (let user of users) {
      const [err,attendanceRes] = await safePromise(Attendance.fetchAttendance({ user_id: user.id, date: new Date().toLocaleDateString('en-CA')}));
      const attendance = attendanceRes.data;
      if (!attendance || !attendance.check_in_time) {
        await sendReminderEmail(
          user.email,
          'Reminder: Please check in for today!',
          'This is a reminder to check in if you haven\'t already done so.'
        );
      }
    }
  } catch (error) {
    console.error('Error checking attendance for check-in reminder:', error);
  }
});

// Cron Job 2: Reminder to check-out at 8 PM for users who have not checked out
cron.schedule('0 20 * * *', async () => {
  try {
    const [err, userRes] = await safePromise(User.findUser({}));
    const users = userRes.data;
    for (let user of users) {
      const [err,attendanceRes] = await safePromise(Attendance.fetchAttendance({ user_id: user.id, date: new Date().toLocaleDateString('en-CA')}));
      const attendance = attendanceRes.data;;
      if (attendance && attendance.check_in_time && !attendance.check_out_time) {
        await sendReminderEmail(
          user.email,
          'Reminder: Please check out for today!',
          'This is a reminder to check out if you haven\'t already done so.'
        );
      }
    }
  } catch (error) {
    console.error('Error checking attendance for check-out reminder:', error);
  }
});

