'use strict';
//var path = require('path');

var path = process.cwd();
//var path = require('path');
var handler = require(path + '/app/controllers/Handler.server.js');
var barhandler = require(path + '/app/controllers/bar.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var Handler = new handler();
	var BarHandler = new barhandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/api/:id/comments')
		.get(isLoggedIn, Handler.getComments)
		.post(isLoggedIn, Handler.postComments);
		
	app.route('/api/:id/location')
		.post(isLoggedIn, Handler.putLocation)
		.get(isLoggedIn, Handler.getLocation);
		
	app.route('/api/:id/bars/start/')
		.get(isLoggedIn, BarHandler.barStart);

		
};
