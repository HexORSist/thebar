'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var COMMENTS_FILE = path.join(__dirname, 'comments.json');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

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
	app.route('/api/comments')
		.get(isLoggedIn, function (req, res) {
		  fs.readFile(COMMENTS_FILE, function(err, data) {
		    if (err) {
		      console.error(err);
		      process.exit(1);
		    }
		    res.setHeader('Cache-Control', 'no-cache');
		    res.json(JSON.parse(data));
		  });
		})
		.post(isLoggedIn, function (req, res) {
			fs.readFile(COMMENTS_FILE, function(err, data) {
			    if (err) {
			      console.error(err);
			      process.exit(1);
			    }
			    var comments = JSON.parse(data);
			    // NOTE: In a real implementation, we would likely rely on a database or
			    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
			    // treat Date.now() as unique-enough for our purposes.
			    var newComment = {
			      id: Date.now(),
			      author: req.body.author,
			      text: req.body.text,
			    };
			    comments.push(newComment);
			    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
			      if (err) {
			        console.error(err);
			        process.exit(1);
			      }
			      res.setHeader('Cache-Control', 'no-cache');
			      res.json(comments);
			    });
			  });
		});
};
