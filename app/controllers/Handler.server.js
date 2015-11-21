'use strict';

var Users = require('../models/users.js');
var path = process.cwd();
var COMMENTS_FILE = path + '/comments.json';
var fs = require('fs');

function Handler () {
	
	this.getComments=function(req,res){
		fs.readFile(COMMENTS_FILE, function(err, data) {
		    if (err) {
		      console.error(err);
		      process.exit(1);
		    }
		    res.setHeader('Cache-Control', 'no-cache');
		    res.json(JSON.parse(data));
		});
	}
	
	this.postComments=function(req,res){
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

	}
	
}

/*function ClickHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = ClickHandler;*/

module.exports = Handler;
