/**
* MODULE DEPENDENCIES
*/
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('routes');
var http = require('http');
var path = require('path');
var bcrypt = require('bcrypt');
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var app = express();
var db_config = {
  host     : 'localhost',
  user     : 'teampalak',
  password : 'teampalak',
  database : 'teampalak'
};
var con;
var fs = require('fs');

//CONNECT TO DATABASE AND HANDLE CONNECTION ERRORS
function handleDisconnect() {
  con = mysql.createConnection(db_config); 
  con.connect(function(err) { 
    if(err) {
      console.log('Error connecting to database: ', err);
      setTimeout(handleDisconnect, 2000); 
    } 
  });

  con.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                        
    } else {                                      
      throw err;                         
    }
  });
}

handleDisconnect();

app.listen(3001, function() {
  console.log("Admin module running on port 3001.");
});

/**
* CACHE
*/
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'somesecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));

app.use(function(request, response, next) {
  response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(fileUpload());
 
/**
* PAGES
*/
app.get('/', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user) {
    con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[user], function(err, rows, fields) {
      response.render('index', {
        user: user,
        accountType: accountType
      });
    });
  } else {
    response.redirect('/login');
  }
});

//DISPLAYS LOG IN PAGE
app.get('/login', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user) {
    response.redirect('/');   
  } else {
    response.render('login', {
      user: user,
      accountType: accountType
    });
  }
});

//VALIDATES LOG IN
app.post('/login', (request, response) => {
  if (request.body.user) {
    con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[request.body.user], function(err, rows, fields) {
      if(rows.length > 0) {
        con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[request.body.user], function(err, rows, fields) {
          if(bcrypt.compareSync(request.body.password, rows[0].Password)) {
            request.session.user = request.body.user;
            request.session.accountType = rows[0].AccountType;
            response.send("<script type='text/javascript'>alert('Successfully logged in.'); window.location.replace(\"/\");</script>")
          } else {
            response.send("<script type='text/javascript'>alert('Incorrect username/password.'); window.location.replace(\"/login\");</script>")
          }
        });
      } else {
        response.send("<script type='text/javascript'>alert('No account registered.'); window.location.replace(\"/login\");</script>")
      }
    });
  }
});

//DISPLAYS SIGN UP PAGE
app.get('/signup', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  
  if(user && accountType == 'Admin') {
    response.render('signupform', {
      user: user,
      accountType: accountType
    });
  } else {
    response.redirect('/');
  }
});

//ADDS ACCOUNT
app.post('/signup', (request, response) => {
  if (request.body.user) {
    var query = "SELECT * FROM accounts WHERE username = ?";
    con.query(query,[request.body.user], function(err, rows, fields) {
      if(rows.length > 0) {
        response.send("<script type='text/javascript'>alert('Username is already taken.'); window.location.replace(\"/signup\");</script>");
      } else {
        if(request.body.password != request.body.repassword) {
          response.send("<script type='text/javascript'>alert('Passwords do not match.'); window.location.replace(\"/signup\");</script>");
        } else {
          var insert = "INSERT INTO accounts (username, password, firstname, lastname, email) VALUES ?";
          let hash = bcrypt.hashSync(request.body.password, 10);
          var values = [
            [request.body.user, hash, request.body.firstName, request.body.lastName, request.body.email]
          ];
          con.query(insert,[values], function(err, rows, fields) {
            response.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/signup\");</script>");
          });
        }
      }
    });       
  }
});

//DISPLAYS TOURNAMENTS PAGE
app.get('/tournaments', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  var minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  var tomorrow = minDate.toISOString().split('T')[0];
  
  if(user && accountType == 'Admin') {
    con.query('SELECT tournaments.TournamentID, TournamentName, TournamentGame, Status, DATE_FORMAT(tournament_details.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(tournament_details.TSched,"%l:%i %p") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, tournament_details.registration_fee FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID', function(err, rows, fields) {
      //con.query('SELECT COUNT(tourna.ID) AS teams FROM (SELECT Team1ID AS ID FROM game WHERE TournaID = ? UNION SELECT Team2ID AS ID FROM game WHERE TournaID = ?) AS tourna', [index, index], function(err, rows2, fields) {
        response.render('tournaments', {
          user: request.session.user,
          accountType: request.session.accountType,
          data: rows,
          tomorrow: tomorrow
        });
      //});
    });
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ADD TOURNAMENT PAGE
app.get('/addtournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  var minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  var tomorrow = minDate.toISOString().split('T')[0];

  if(user && accountType == 'Admin') {
    response.render('addtournament', {
      user: user,
      accountType: accountType,
      tomorrow: tomorrow
    });
  } else {
    response.redirect('/');
  }
});

//ADDS TOURNAMENT
app.post('/addtournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    var values = [
      [request.body.TournamentName, request.body.TournamentGame, 'Open']
    ];

    con.query('INSERT INTO tournaments (TournamentName, TournamentGame, Status) VALUES ?',[values], function(err, rows, fields) {
      con.query('SELECT LAST_INSERT_ID() AS lastID', function(err, rows, fields) {
        
        if(request.body.TournamentPicture) {
          var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
          var filetype = path.extname(request.body.TournamentPicture);

          if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
              var values2 = [
                [rows[0].lastID, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants, image]
              ];

              con.query('INSERT INTO tournament_details (TournamentID, TSched, TVenue, registration_fee, Max_participants, Tpic) VALUES ?',[values2], function(err, rows, fields) {
                //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
                response.redirect('/tournaments');
              });
          } else {
            response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
          }
        } else { 
          var values2 = [
            [rows[0].lastID, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants]
          ];

          con.query('INSERT INTO tournament_details (TournamentID, TSched, TVenue, registration_fee, Max_participants) VALUES ?',[values2], function(err, rows, fields) {
            //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
            response.redirect('/tournaments');
          });
        }
      });
    });
  } else {
    response.redirect('/');
  }
});

//DISPLAYS TOURNAMENT DETAILS
app.post('/viewtdetails', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);
  var minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  var tomorrow = minDate.toISOString().split('T')[0];

  con.query('SELECT tournaments.TournamentID, TournamentName, TournamentGame, Status, DATE_FORMAT(tournament_details.TSched,"%Y-%m-%d") AS tDate, DATE_FORMAT(tournament_details.TSched,"%H:%i") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, tournament_details.registration_fee, tournament_details.Tpic FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    //con.query('SELECT COUNT(tourna.ID) AS teams FROM (SELECT Team1ID AS ID FROM game WHERE TournaID = ? UNION SELECT Team2ID AS ID FROM game WHERE TournaID = ?) AS tourna', [index, index], function(err, rows2, fields) {
      response.render('tdetails', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
        //data2: rows2,
        TournamentID: index,
        tomorrow: tomorrow,
        edit: parseInt(0)
      });
    //});
  });
});

//UPDATES TOURNAMENT DETAILS
app.post('/updatetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  var TournamentName = request.body.TournamentName;
  var TournamentGame = request.body.TournamentGame;
  var TSched = request.body.tDate + " " + request.body.tTime;
  var TVenue = request.body.TournamentVenue;
  var MaxParticipants = request.body.MaxParticipants;
  var registration_fee = request.body.Price;

  if(request.body.TournamentPicture) {
    var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
    var filetype = path.extname(request.body.TournamentPicture);

    if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
      con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, index], function(err, rows, fields) {
        con.query('UPDATE tournament_details SET TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ?, Tpic = ? WHERE TournamentID = ?', [TSched, TVenue, MaxParticipants, registration_fee, image, index], function(err, rows, fields) {
          response.redirect('/tournaments');
        });
      });
    } else {
      response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
    }
  } else {
    con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, index], function(err, rows, fields) {
      con.query('UPDATE tournament_details SET TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ? WHERE TournamentID = ?', [TSched, TVenue, MaxParticipants, registration_fee, index], function(err, rows, fields) {
        response.redirect('/tournaments');
      });
    });
  }
});

//CLOSES TOURNAMENT
app.post('/closetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('UPDATE tournaments SET status = "Closed" WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    response.redirect('/tournaments');
  });
});

//REMOVES TOURNAMENT
app.post('/removetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('DELETE FROM tournaments WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    response.send("<script type='text/javascript'>alert('Tournament has been removed.'); window.location.replace(\"/tournaments\");</script>");
  });
});

//DISPLAYS ANNOUNCEMENTS PAGE
app.get('/announcements', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  
  if(user && accountType == 'Admin') {
    con.query('SELECT announcementID, announcementTitle, announcementMessage, DATE_FORMAT(announcementDate,"%M %d, %Y") AS aDate, DATE_FORMAT(announcementDate,"%l:%i %p") AS aTime FROM announcements', function(err, rows, fields) {
      response.render('announcements', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
      });
    });
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ADD TOURNAMENT PAGE
app.get('/addannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    response.render('addannouncement', {
      user: user,
      accountType: accountType
    });
  } else {
    response.redirect('/');
  }
});

//ADDS ANNOUNCEMENT
app.post('/addannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    if(request.body.announcementPic) {
      var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.announcementPic));
      var filetype = path.extname(request.body.announcementPic);
      
      if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
        var values = [
          [request.body.announcementTitle, request.body.announcementMessage, new Date(), image]
        ];

        con.query('INSERT INTO announcements (announcementTitle, announcementMessage, announcementDate, announcementPic) VALUES ?',[values], function(err, rows, fields) {
          response.redirect('/announcements');
        });
      } else {
        response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/announcements\");</script>");
      }
    } else {
      var values = [
        [request.body.announcementTitle, request.body.announcementMessage, new Date()]
      ];

      con.query('INSERT INTO announcements (announcementTitle, announcementMessage, announcementDate) VALUES ?',[values], function(err, rows, fields) {
        response.redirect('/announcements');
      });
    }
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ANNOUNCEMENT DETAILS
app.post('/viewadetails', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  con.query('SELECT announcementID, announcementTitle, announcementMessage, DATE_FORMAT(announcementDate,"%M %d, %Y") AS aDate, DATE_FORMAT(announcementDate,"%l:%i %p") AS aTime FROM announcements WHERE announcementID = ?', index, function(err, rows, fields) {
    response.render('adetails', {
      user: request.session.user,
      accountType: request.session.accountType,
      data: rows,
      announcementID: index,
      edit: parseInt(0)
    });
  });
});

//UPDATES ANNOUNCEMENT DETAILS
app.post('/updateannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  var announcementTitle = request.body.announcementTitle;
  var announcementMessage = request.body.announcementMessage;

  if(request.body.announcementPic) {
    var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.announcementPic));
    var filetype = path.extname(request.body.announcementPic);

    if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
      con.query('UPDATE announcements SET announcementTitle = ?, announcementMessage = ?, announcementPic = ? WHERE announcementID = ?', [announcementTitle, announcementMessage, image, index], function(err, rows, fields) {
        response.redirect('/announcements');
      });
    } else {
      response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/announcements\");</script>");
    }
  } else {
    con.query('UPDATE announcements SET announcementTitle = ?, announcementMessage = ? WHERE announcementID = ?', [announcementTitle, announcementMessage, index], function(err, rows, fields) {
      response.redirect('/announcements');
    });
  }
});

//REMOVES ANNOUNCEMENT
app.post('/removeannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  con.query('DELETE FROM announcements WHERE announcementID = ?', index, function(err, rows, fields) {
    response.redirect('/announcements');
  });
});

//DISPLAYS PROFILE PAGE
app.get('/profile', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  
  if(user && accountType == 'Admin') {
    con.query('SELECT Username, Firstname, Lastname, Email, AccountType FROM accounts WHERE AccountType = "Admin" AND Username = ?', user, function(err, rows, fields) {
      response.render('profile', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
        edit: parseInt(0)
      });
    });
  } else {
    response.redirect('/');
  }
});

//DESTROYS SESSION, LOGS USER OUT, AND DISPLAYS HOME PAGE
app.get('/logout', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    request.session.destroy();
    response.send("<script type='text/javascript'>alert('Successfully logged out.'); window.location.replace(\"/\");</script>");
  } else {
    response.redirect('/');
  }
});