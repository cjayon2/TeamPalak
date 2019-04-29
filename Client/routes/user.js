var array;
//==========================| LOGIN |=============================
exports.login = function(req, res) {
    var message = '';
    req.session.message = "";
    if(req.method == "POST"){
        if (req.body.user) {
            db.query('SELECT * FROM accounts WHERE username = ?', [req.body.user], function(err, rows, fields) {
                if (rows.length > 0) {
                    db.query('SELECT * FROM accounts WHERE username = ?', [req.body.user], function(err, rows, fields) {
                        if (bcrypt.compareSync(req.body.password, rows[0].Password)) {
                            req.session.user = req.body.user;
                            req.session.userID = rows[0].AccID;
                            console.log(req.session.userID);
                            res.redirect('/client');
                        } else {
                            var message = 'Incorrect username/password.';
                            console.log(message);
                            res.render('login.ejs', {message: message});
                        }
                    });
                } else {
                    var message = 'No account registered.';
                    res.render('login.ejs', {message: message});
                }
            });
        }
    }
};

//==========================| HOME |=============================
exports.home = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userID;
		req.session.message = "";
	var payload = {
		from: 'TEAMPALAK',
		to: '+639175749214',
		number: '+639176780038',
		message: 'SAMPLE',
		user:'jdmallari@weavetech.com.ph',
		account_id :4756,
		account: 'Weavetech Networks Inc'
	};
	sms.sendsms(payload, function(error, result) {
	if (!error) {
		console.log("result"+result);
	} else
		console.log("error"+error);
	}); 
	    var sql = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID order by TSched desc";
	    db.query(sql, function(err, result){
	        console.log(result);
		    var sql1 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'lol%\' order by TSched desc";
		    db.query(sql1, function(err, result1){
		        console.log("result");
		        var sql2 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'dota%\' order by TSched desc";
			    db.query(sql2, function(err, result2){
			        console.log("result");
					var sql3 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'cs%\' order by TSched desc";
				    db.query(sql3, function(err, result3){
				        console.log("result");
						var sql4 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'lol%\'";
					    db.query(sql4, function(err, result4){
					        console.log("result");
							var sql5 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'dota%\'";
						    db.query(sql5, function(err, result5){
						        console.log("result");
								var sql6 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'cs%\'";
							    db.query(sql6, function(err, result6){
							        console.log("result");
									var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
								    db.query(sql7, function(err, result7){
								        console.log("result");
								        var sql8 = "SELECT * FROM teampalak.announcements";
									    db.query(sql8, function(err, result8){
									        console.log("result");
									            res.render('home.ejs', {data:result,data1:result1,data2:result2,data3:result3, user: userId, message:req.session.message, lol:result4, dota:result5, cs:result5, all:result7, announcements:result8});
									            req.session.message = "";
									    })
								    })
							    })
						    })
					    })
				    })
			    })
		        })
	    });
};
//==========================| Clinet home |=============================
exports.client = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userID;
		req.session.message = "";
	var payload = {
		from: 'TEAMPALAK',
		to: '+639175749214',
		number: '+639176780038',
		message: 'SAMPLE',
		user:'jdmallari@weavetech.com.ph',
		account_id :4756,
		account: 'Weavetech Networks Inc'
	};
	sms.sendsms(payload, function(error, result) {
	if (!error) {
		console.log("result"+result);
	} else
		console.log("error"+error);
	}); 
	    var sql = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID order by TSched desc";
	    db.query(sql, function(err, result){
	        console.log(result);
		    var sql1 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'lol%\' order by TSched desc";
		    db.query(sql1, function(err, result1){
		        console.log("result");
		        var sql2 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'dota%\' order by TSched desc";
			    db.query(sql2, function(err, result2){
			        console.log("result");
					var sql3 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'cs%\' order by TSched desc";
				    db.query(sql3, function(err, result3){
				        console.log("result");
						var sql4 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'lol%\'";
					    db.query(sql4, function(err, result4){
					        console.log("result");
							var sql5 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'dota%\'";
						    db.query(sql5, function(err, result5){
						        console.log("result");
								var sql6 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'cs%\'";
							    db.query(sql6, function(err, result6){
							        console.log("result");
									var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
								    db.query(sql7, function(err, result7){
								        console.log("result");
								        var sql8 = "SELECT * FROM teampalak.announcements";
									    db.query(sql8, function(err, result8){
									        console.log("result");
									            res.render('client.ejs', {data:result,data1:result1,data2:result2,data3:result3, user: userId, message:req.session.message, lol:result4, dota:result5, cs:result5, all:result7, announcements:result8});
									            req.session.message = "";
									    })
								    })
							    })
						    })
					    })
				    })
			    })
		        })
	    });
};

//==========================| Clinet home |=============================
exports.results = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userId;

	if (user == null) {
		res.redirect("/login");
		return;
	}

	res.render('results.ejs', {
		user: user
	});
};

//==========================| Register Team |=============================
exports.tournaments = function(req, res, next) {
console.log("a");
	var user = req.session.user,
		userId = req.session.userId;
    console.log("b");
    var dasa = req.body.dasa;
    if(req.session.message === undefined)
    	req.session.message = "";
	    var sql = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID order by TSched desc";
	    db.query(sql, function(err, result){
	        console.log(result);
		    var sql1 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'lol%\' order by TSched desc";
		    db.query(sql1, function(err, result1){
		        console.log("result");
		        var sql2 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'dota%\' order by TSched desc";
			    db.query(sql2, function(err, result2){
			        console.log("result");
					var sql3 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'cs%\' order by TSched desc";
				    db.query(sql3, function(err, result3){
				        console.log("result");
						var sql4 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'lol%\'";
					    db.query(sql4, function(err, result4){
					        console.log("result");
							var sql5 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'dota%\'";
						    db.query(sql5, function(err, result5){
						        console.log("result");
								var sql6 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'cs%\'";
							    db.query(sql6, function(err, result6){
							        console.log("result");
									var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
								    db.query(sql7, function(err, result7){
								        console.log("result");
								            res.render('tournaments.ejs',{data:result,data1:result1,data2:result2,data3:result3, user: userId, message:req.session.message, lol:result4, dota:result5, cs:result5, all:result7});
								            req.session.message = "";
								    })
							    })
						    })
					    })
				    })
			    })
		        })
	    });
};
//==========================| Login Tournaments Team |=============================
exports.login_tournaments = function(req, res, next) {
console.log("a");
	var user = req.session.user,
		userId = req.session.userId;
    console.log("b");
    var dasa = req.body.dasa;
    if(req.session.message === undefined)
    	req.session.message = "";
	    var sql = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID order by TSched desc";
	    db.query(sql, function(err, result){
	        console.log(result);
		    var sql1 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'lol%\' order by TSched desc";
		    db.query(sql1, function(err, result1){
		        console.log("result");
		        var sql2 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'dota%\' order by TSched desc";
			    db.query(sql2, function(err, result2){
			        console.log("result");
					var sql3 = "SELECT * FROM teampalak.tournaments inner join teampalak.tournament_details on tournaments.TournamentID = tournament_details.TournamentID where TournamentGame like \'cs%\' order by TSched desc";
				    db.query(sql3, function(err, result3){
				        console.log("result");
						var sql4 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'lol%\'";
					    db.query(sql4, function(err, result4){
					        console.log("result");
							var sql5 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'dota%\'";
						    db.query(sql5, function(err, result5){
						        console.log("result");
								var sql6 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'cs%\'";
							    db.query(sql6, function(err, result6){
							        console.log("result");
									var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
								    db.query(sql7, function(err, result7){
								        console.log("result");
								            res.render('login_tournaments.ejs',{data:result,data1:result1,data2:result2,data3:result3, user: userId, message:req.session.message, lol:result4, dota:result5, cs:result5, all:result7});
								            req.session.message = "";
								    })
							    })
						    })
					    })
				    })
			    })
		        })
	    });
};
//==========================| Register Team |=============================
exports.userProfile = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	var name = "";
	var team = "";
	var imageProfile = "";
	var imageHistory = "";

	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		//Change database personal_info ID to auto incremtent
		db.query('SELECT * FROM teampalak.members inner join teams ON teams.TeamID = members.TeamID Inner join accounts ON accounts.AccID = members.MemID where username = ?', user, function(err, rows1, fields) {
			if (rows1.length == 1) {	
				name = rows1[0].Firstname +" "+ rows1[0].Lastname;
				let sql = 'SELECT * FROM registered_teams INNER JOIN tournaments ON registered_teams.TournamentID = tournaments.TournamentID INNER JOIN tournament_details ON  tournament_details.TournamentID = tournaments.TournamentID INNER JOIN accounts INNER JOIN teams ON teams.TeamID = accounts.AccID where username = ? AND tournaments.Status = "closed" ';
				let data = [user];
					db.query(sql, data, function(err, rows, fields){
						
						res.render('userProfile.ejs', {
											user: user,
											name: name,
											data: rows1,
											imageHistory: imageHistory,
											ctr: rows
					});
				});
			} else {
				res.send("<script type='text/javascript'>alert('No account registered.'); window.location.replace(\"/login\");</script>")
			}
		});
		
	}

};
//==========================| Registration |=============================
exports.editProfile = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	var message = "";
	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		db.query('SELECT * FROM accounts WHERE username = ?', user, function(err, rows, fields) {
			if (rows.length == 1) {
				if(bcrypt.compareSync(req.body.password, rows[0].Password)){
					if (req.body.newPwd == req.body.conPwd) {
						let sql = 'UPDATE accounts SET Password = ? WHERE Username = ?';
						let hash = bcrypt.hashSync(req.body.conPwd, 10);
						let data = [hash, user];
						db.query(sql, data, function(err, result){
							console.log(result);
						});
					}else{
						res.send("<script type='text/javascript'>alert('New Password and Confirm Password do not match.'); window.location.replace(\"/editProfile\");</script>")
					}

				}else{
						res.send("<script type='text/javascript'>alert('Old Password do not match.'); window.location.replace(\"/editProfile\");</script>")

				}
			}

		});
	}
		res.render('editProfile.ejs', {user: user});
};

//==========================| Registration |=============================
exports.registration = function(req, res) {
	var user = req.session.user,
		userId = req.session.userId;

			if (user == null) {
		res.redirect("/login");
		return;
	}
    if(req.method == "POST"){
        console.log("fdsfsfsdfds");
        var post = req.body;
        var tourna = post.tourna;
        var tname = post.tname;
        var memb1 = post.memb1;
        var memb2 = post.memb2;
        var memb3 = post.memb3;
        var memb4 = post.memb4;
        sql = "INSERT INTO `teampalak`.`teams` (`CaptainID`, `TeamName`) VALUES ('"+userId+"', '"+tname+"')";
        db.query(sql, function(err, result){ 
            console.log(err);
        });
        var sql = "SELECT * FROM teampalak.tournament_details inner join teampalak.tournaments";
        db.query(sql, function(err, result){
        console.log("result");
            message = "Team registered";
                    var sql = "select distinct teampalak.members.TeamID,TeamName from teampalak.members inner join teampalak.teams inner join teampalak.accounts where teams.teamid = members.teamid and accounts.accid = members.memid and captainID ="+userId+"";
        db.query(sql2, function(err, result2){
                    console.log(userId);
                    var sql3 = "select * from teampalak.members inner join teampalak.teams inner join teampalak.accounts where teams.teamid = members.teamid and accounts.accid = members.memid and captainID ="+userId+"";
                    db.query(sql3, function(err, result3){
                                console.log(result2);
                                res.render('registerTeam.ejs',{data:result, user: userId, message:message, teams: result2, members:result3});
                    });
        });
        });

    } else {
    var sql = "SELECT * FROM teampalak.tournament_details inner join teampalak.tournaments";
    db.query(sql, function(err, result){
        console.log("result");
        message = "";
        message = "Team registered";
                    var sql2 = "select distinct teampalak.members.TeamID,TeamName from teampalak.members inner join teampalak.teams inner join teampalak.accounts where teams.teamid = members.teamid and accounts.accid = members.memid and captainID ="+userId+"";
        db.query(sql2, function(err, result2){
                    console.log(userId);
                    var sql3 = "select * from teampalak.members inner join teampalak.teams inner join teampalak.accounts where teams.teamid = members.teamid and accounts.accid = members.memid and captainID ="+userId+"";
                    db.query(sql3, function(err, result3){
                                console.log(result2);
                                res.render('registerTeam.ejs',{data:result, user: userId, message:message, teams: result2, members:result3});
                    });
        });
    });
    }
};

exports.registrations = async function(req, res) {
	var user = req.session.user,
		userId = req.session.userID;
        console.log("fdsfsfsdfds");
        var get = req.query;
        var tname = get.tname;
		var tID = req.tID
        var capname = get.capname;
        var memb1 = get.memb1;
        var memb2 = get.memb2;
        var memb3 = get.memb3;
        var memb4 = get.memb4;
		var rewardPoints = 0;

        var sql1 = "SELECT * FROM teampalak.accounts where Username =\'"+memb1+"\'";
	    db.query(sql1, function(err, result){
	        message = "";
	        message = "Team registered";
	        console.log("PAT TABA taba"+result.length==0);
	        if(result.length==0){
	        	message = "User not found";
	        	req.session.message = message;
	        	res.redirect("/tournaments");
	        	console.log("PAT TABA"+result);
	        	console.log(1);
	        	return;
	        }
		    var sql111 = "SELECT * FROM teampalak.accounts where Username =\'"+memb2+"\'";
		    db.query(sql111, function(err, result1){
		        message = "";
		        message = "Team registered";
		        if(result1.length==0){
		        	message = "User not found";
		        	req.session.message = message;
		        	res.redirect("/tournaments");
		        	console.log(2);
		        	return;
		        }
		        var sql2 = "SELECT * FROM teampalak.accounts where Username =\'"+memb3+"\'";
			    db.query(sql2, function(err, result2){
			        message = "";
			        message = "Team registered";
			        if(result2.length==0){
			        	message = "User not found";
			        	req.session.message = message;
			        	res.redirect("/tournaments");
			        	console.log(3);
			        	return;
			        }
					var sql3 = "SELECT * FROM teampalak.accounts where Username =\'"+memb4+"\'";
				    db.query(sql3, function(err, result3){
				        message = "";
				        message = "Team registered";
				        if(result3.length==0){
				        	message = "User not found";
				        	req.session.message = message;
				        	res.redirect("/tournaments");
				        	console.log(4);
				        	return;
				        }
				        if(result[0].AccID==result1[0].AccID||result[0].AccID==result2[0].AccID||result[0].AccID==result3[0].AccID||result1[0].AccID==result[0].AccID||result1[0].AccID==result2[0].AccID||result1[0].AccID==result3[0].AccID||result2[0].AccID==result[0].AccID||result2[0].AccID==result1[0].AccID||result2[0].AccID==result3[0].AccID||result3[0].AccID==result[0].AccID||result3[0].AccID==result1[0].AccID||result3[0].AccID==result2[0].AccID){
				        	message = "Member username should be unique";
				        	req.session.message = message;
				        	res.redirect("/tournaments");
				        	console.log(4);
				        	return;
				        }
				        sql = "INSERT INTO `teampalak`.`teams` (`CaptainID`, `TeamName`) VALUES ('"+userId+"', '"+tname+"')";
				        db.query(sql, function(err, result56){ 
				        	console.log(result56);
				            console.log(err);
				        var sql4 = "SELECT max(TeamID) as teamID FROM teampalak.teams where CaptainID = "+userId;
				        db.query(sql4, function(err, result4){
					        console.log("cj tabat taba"+result4[0].AccID);
					        message = "";
					        message = "Team registered";
					        console.log(result[0].AccID);
					        var sql5 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result[0].AccID+"\')";
					        db.query(sql5, function(err, result5){
						        console.log(err);
						        message = "";
						        message = "Team registered";
						        var sql6 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result1[0].AccID+"\')";
						        db.query(sql6, function(err, result6){
							        console.log("result6");
							        message = "";
							        message = "Team registered";
							        var sql7 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result2[0].AccID+"\')";
							        db.query(sql7, function(err, result7){
								        console.log("result7");
								        message = "";
								        message = "Team registered";
								        var sql8 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result3[0].AccID+"\')";
								        db.query(sql8, function(err, result8){
									        console.log("result8");
									        message = "";
									        message = "Team registered";
									        var sql9 = "INSERT INTO `teampalak`.`registered_teams` (`registeredteamID`, `TournamentID`) VALUES (\'"+result4[0].teamID+"\', \'"+tID+"\')";
									        db.query(sql9, function(err, result9){
										        console.log(err);
										        message = "";
										        message = "Team registered";
										        
										        db.query(sql10, function(err, result10){
											        console.log(err);+5
											        message = "";
											        message = "Team registered";
											       
											        db.query(sql11, function(err, result11){
												        console.log(err);
												        message = "";
												        message = "Team registered";

												        db.query(sql12, function(err, result12){
													        console.log(err);
													        message = "";
													        message = "Team registered";

													        db.query(sql13, function(err, result13){
														        console.log(err);
														        message = "";
														        message = "Team registered";

														        db.query(sql14, function(err, result14){
															        console.log(err);
															        message = "";
															        message = "Team registered";

															        db.query(sql15, function(err, result15){
																        console.log(err);
																        message = "";
																        message = "Team registered";
																        res.redirect("/tournaments");
															    	})
														    	})	
													    	})										    	
													    })
											    	})										    	
											    })	
									    		})	
									    	})								    	
								    	})
							    	})
						    	})
					    	})
				    	})
				    })
			    })
		        })
	    });

};

//==========================| LOGOUT |=============================
exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		res.redirect("/home");
	})
};

//==========================| REGISTER |=============================
exports.register = function(req, res) {
	if (req.body.user) {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, [req.body.user], function(err, rows, fields) {
			if (rows.length > 0) {
				res.send("<script type='text/javascript'>alert('Username is already taken.'); window.location.replace(\"/register\");</script>");
			} else {
				if (req.body.password != req.body.repassword) {
					res.send("<script type='text/javascript'>alert('Passwords do not match.'); window.location.replace(\"/register\");</script>");
				} else {
					var insert = "INSERT INTO accounts (username, password, firstname, lastname, email) VALUES ?";
					let hash = bcrypt.hashSync(req.body.password, 10);
					var values = [
						[req.body.user, hash, req.body.firstName, req.body.lastName, req.body.email]
					];
					db.query(insert, [values], function(err, rows, fields) {
						res.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/register\");</script>");
					});
				}
			}
		});
	}
};
//==========================| Display Brackets |=============================
exports.bracket = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userId;

	

	res.render('/bracket.ejs', {
		user: user
	});
};

// //==========================| Display Brackets |=============================
// exports.brackets = async function(req, res, next) {
// 	var sql1 = "SELECT max(Round) as max from teampalak.game";
// 	var sql2 = "SELECT max(GameID) as max from teampalak.game";
// 	var sql3 = "";
// 	var arrayko = [];
// 	var roundsMax = 0;
// 	var gameIDMax = 0;
// 	await db.query(sql1, function(err, result) {
// 		roundsMax = getMax(result);
// 		db.query(sql2, async function(err, result) {
// 			gameIDMax = await getMax(result);
// 			console.log("1:"+roundsMax, gameIDMax)
// 			arrayko = await una(gameIDMax, roundsMax);
// 			console.log("send"+JSON.stringify(arrayko));
// 			await render();
// 			await console.log("7:"+"ds");
// 		});
// 	});
// 	async function una(gameIDMax, roundsMax){
// 					for (var i = 1; i <= roundsMax; i++) {
// 						var x = []
// 					x.push( falalala(i, gameIDMax, roundsMax));

// 			};
// 			await console.log("dsdsdadsadasdsadasdsadgfdsg"+JSON.stringify(x));
// 			return x;
// 	};
// 	function getMax(result){return result[0].max;};
// 	async function falalala(i, gameIDMax, roundsMax){
// 					console.log("2:"+i);
// 					console.log("3:"+gameIDMax);
// 					await forLoop(i, gameIDMax, roundsMax);
// 	};
// 	async function forLoop(i, gameIDMax, roundsMax){
// 							var arraymo = [];
// 								for (var j = 1; j <= gameIDMax; j++) {
// 							console.log("4:"+j);
// 							await (function(j, gameIDMax, roundsMax) {
// 								sql3 = "SELECT * FROM teampalak.tournaments INNER JOIN teampalak.game ON teampalak.tournaments.TournamentID = teampalak.game.TournaID INNER JOIN teampalak.teams ON teampalak.game.Team1ID =teampalak.teams.TeamID where Round = " + j + " and GameID = " + i + " UNION SELECT * FROM teampalak.tournaments INNER JOIN teampalak.game ON teampalak.tournaments.TournamentID = teampalak.game.TournaID INNER JOIN teampalak.teams ON teampalak.game.Team2ID =teampalak.teams.TeamID where Round = " + j + " and GameID = " + i + " Order by GameID, Round";
// 								db.query(sql3, async function(err, result) {
//                                     console.log("alyzza");
// 									if (j < gameIDMax){
// 										await arraymo.push(result);
// 										console.log("heyosss");}
// 									else{
// 										await arraymo.push(result);

// 																		console.log("5:"+JSON.stringify(arraymo));
// 																	 return await arraymo;}

// 								});
// 							})(j, gameIDMax, roundsMax);
// 						}
// 	};
// 	function render(){res.render('bracket.ejs', {});};
// };

