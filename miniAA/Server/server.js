const express = require('express');
const cors = require('cors');
const path = require("path");

// Setting up port
let PORT = 5200;

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Front Site Build Path
app.use('/', express.static(path.join(__dirname, './build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});


//=== 5 - START SERVER
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT + '/'));
