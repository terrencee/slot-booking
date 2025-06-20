const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

app.use(express.static('public'));
app.use(express.json());

// Get all bookings
app.get('/api/events', (req, res) => {
  if (!fs.existsSync(BOOKINGS_FILE)) {
    return res.json([]);
  }
  const data = fs.readFileSync(BOOKINGS_FILE);
  res.json(JSON.parse(data));
});

// Add a new booking
app.post('/api/book', (req, res) => {
  const newBooking = req.body;
  let bookings = [];

  if (fs.existsSync(BOOKINGS_FILE)) {
    bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE));
  }

  bookings.push(newBooking);
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  res.json({ message: 'Booking successful!' });
});

// Delete a booking
app.post('/api/delete', (req, res) => {
  const deleteReq = req.body;

  if (!fs.existsSync(BOOKINGS_FILE)) return res.status(404).json({ message: "No data file found." });

  let bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE));

  const newBookings = bookings.filter(
    event =>
      !(
        event.title === deleteReq.title &&
        event.start === deleteReq.start &&
        event.end === deleteReq.end
      )
  );

  if (newBookings.length === bookings.length) {
    return res.status(404).json({ message: "Booking not found." });
  }

  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(newBookings, null, 2));
  res.json({ status: "success", message: "Booking deleted." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
