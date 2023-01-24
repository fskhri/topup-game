const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

//koneksi kedatabase remotemysql.com
const connection = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_login'
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
// add register 
// add localhost:3000/register
app.get('/register', function(req, res) {
  // Render login.html
  res.render('register.html');
});
app.post('/register', function(req, res) {

  // var user_id= req.params.body.user_id
  var user_name = req.body.name;
  var user_email = req.body.email;
  var user_password = req.body.password;

  connection.connect(function(err) {
    if (err) {
      console.log(err);
    };
    // checking user already registered or no
    connection.query(`SELECT * FROM table_user WHERE user_email = '${user_name}' AND user_password  = '${user_password}'`, function(err, result) {
      if (err) {
        console.log(err);
      };
      if (Object.keys(result).length > 0) {
        res.json({ err: 'akun sudah ada ' });
      } else {
        //creating user page in userPage function

        var sql = `INSERT INTO table_user ( user_name,user_email , user_password) VALUES ( '${user_name}', '${user_email}','${user_password}')`;
        connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            // using userPage function for creating user page
            res.render('login.html');

          };
        });

      }
    })
  });
});
// add update akun
//get view
app.get('/akun/:id',function(req,res){
  res.render('update')
})

app.put('/akun/:id',function(req,res){
  const id = req.params.id
  const data = { ...req.body };
  const queryCari = 'SELECT * FROM  table_user WHERE ?';
  const queryUPDATE = 'UPDATE table_user SET ? WHERE id = ?';
  
  connection.query(queryCari,id ,function(err, result) {
    if (err) {
      console.log(err);
    }
    if(rows.length){
      connection.query(queryUPDATE,[data,id],(err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika update berhasil
        res.status(200).json({ success: true, message: 'Berhasil update data!' });
    });
    }
    else {
      return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
    }
  })
})

// add delete akun
app.delete('/akun/:id',function(req,res){
  const id = req.params.id
  const queryCari = 'SELECT * FROM  table_user WHERE ?';
  const queryDELETE = 'DELETE FROM table_user WHERE id = ?';
  
  connection.query (queryCari,id ,function(err, result) {
    if (err) {
      console.log(err);
    }
    if(rows.length){
      connection.query(queryDELETE,id,(err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika update berhasil
        res.status(200).json({ success: true, message: 'Berhasil delete data!' });
      }); 
    }
  })
})


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

