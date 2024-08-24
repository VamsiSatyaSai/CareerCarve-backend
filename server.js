const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());

app.listen(3306 , ()=>{
  console.log('started')
});

const connection = mysql.createConnection({
  host:'bkexh4bffdzgsg3wctvq-mysql.services.clever-cloud.com',
  user:'ucg7mgpw3ntmkwut',
  password:'youNLtndBR61LnqVDr3C',
  database:'bkexh4bffdzgsg3wctvq'
});

connection.connect((err) => {
  if(err) {
    console.error(err.code);
    console.error(err.sqlMessage);
  }
  else {
    console.log('Connected to mysql');
  }
})

app.get('/api', (req, response) => {
  const query = `SELECT * FROM mentor`;
  connection.query(query,(error, result) => {
    if (error) console.log(err);
    response.send(result);
  });
});

app.get('/mentor', (req, res) => {
  const { areas_of_expertise, start_time } = req.query; 
  const query = `SELECT mentor.* FROM mentor LEFT JOIN bookings ON mentor.id = bookings.mentor_id WHERE mentor.expertise = ? AND mentor.start_time <= ? AND bookings.id IS NULL `;

  connection.query(query, [areas_of_expertise, start_time], (error, results) => {
    if (error) {
      console.error('SQL Error:', error.message);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results); 
  });
});


app.post('/bookings', (req, res) => {
  const {student_name, mentor_name, booking_time, duration, is_premium, mentor_id, subject} = req.query;
  const minutes = (duration == 60) ? '01:00:00' : `00:${duration}:00`
  const query = `INSERT INTO bookings (student_name, mentor_name, booking_time, duration, is_premium, booking_end_time, mentor_id, subject) VALUES (?, ?, ?, ?, ?, ADDTIME(?, ?), ?, ?)`;
  connection.query(query, [student_name, mentor_name, booking_time, duration, is_premium, booking_time, minutes, mentor_id, subject], (error, result) => {
    if (error) {
      console.log('Booking: ',error.message);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(result);
  })
})

app.get('/bookings/details', (req, res) => {
  const query = 'SELECT * FROM bookings';
  connection.query(query, (error, result) => {
    if (error) {
      console.log(error.message);
    }
    res.json(result);
  })
});
