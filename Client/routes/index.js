exports.index = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;
  db.query('SELECT * FROM accounts WHERE username = ?', [user], function(err, rows, fields) {
    res.redirect('/home');
  });
};

exports.login = function(req, res){
    var message = '';
  res.render('login',{message: message});
};

exports.register = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;

  if (user) {
    res.redirect('/');
  } else {
    res.render('register', {
      user: user,
      accountType: accountType
    });
  }
};
