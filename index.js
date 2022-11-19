const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

//koneksi kedatabase remotemysql.com
const connection = mysql.createConnection({
  multipleStatements: true,
  host: 'remotemysql.com',
  user: 'byMWsNlDww',
  password: 'PLJiPdPZ32',
  database: 'byMWsNlDww'
});

const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//session 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));


// router render home page 
// http://localhost:3000/
app.get('/', function(req, res) {
  // Render home html
  res.render("index.html");
});


// router render login page 
// http://localhost:3000/login
app.get('/login', function(req, res) {
  // Render login.html
  res.render('login.html');
});

// router untuk submit form dari login page 
// http://localhost:3000/auth
app.post('/auth', function(req, res) {
  // Capture the input fields
  let username = req.body.username;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM table_user WHERE user_name = ? AND user_password = ?', [username, password], function(error, results, fields) {
      // jika ada error dengan query, maka trow error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
        req.session.loggedin = true;
        req.session.username = username;
        // Redirect to home page
        res.redirect('/home');
      } else {
        res.send('Incorrect Username and/or Password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});


// router untuk balik ke home page ( index.html)
// http://localhost:3000/home
app.get('/home', function(req, res) {
  // If the user is loggedin
  // res.render(index2.html)
  if (req.session.loggedin) {
    // Output username
     res.render('index2')
  } else {
    // Not logged in
    res.send('Please login to view this page!');
  }
  res.end();
});

app.listen(3000, ()=>{
  console.log('Server Berjalan di Port : 3000');
});

