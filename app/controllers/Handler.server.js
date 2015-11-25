'use strict';

var Users = require('../models/users.model.js');
//var qs = require('qs')
var path = process.cwd();

function Handler () {
	
	this.putLocation=function(req,res){
		Users.findOne({ 'github.id': req.user.github.id },function(err,data){
			if (err) { throw err; }
				data.location = req.body.text;
				data.save(function(err) {
    				if (err) throw err;
				});
			}
		);
	};
	
	this.getLocation=function(req,res){
		Users.findOne({ 'github.id': req.user.github.id },function(err,data){
			if (err) { throw err; }
				res.json(data.location);
			}
		);
	};
}


module.exports = Handler;
