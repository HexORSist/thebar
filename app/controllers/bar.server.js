'use strict';

var yelpnode = require('yelp');
var Bars = require('../models/bar.model.js');
var qs = require('qs')
var path = process.cwd();

function barHandler () {
	
	this.barStart=function(req,res){
		
		var yelp = new yelpnode({
	      consumer_key: "qXHtGS14FEUgQCaQx1NLhQ",
	      consumer_secret: "QaXUu07XYss4ZBPujXNysQPKVwo",
	      token: "hEqj3vGFdvISd5zTGYHsQ-ttUWLzts6O",
	      token_secret: "_a4x-PfQVoOMV9ZLxalZSEazZHU"
	    });
	    //console.log(req);
	    yelp.search({category_filter: "bars", location: req.user.location}, function(error, data) {
	      //console.log(error);
	          if(error) { return handleError(res, error); }
	          var extBars = data.businesses.map(function(item){
	            return {
	                    name: item.name,
	                    url:item.url,
	                    image_url:item.image_url,
	                    snippet: item.snippet_text,
	                    attending: []
	                  };
	          });
	          mergeDB(extBars,res);
	    });
	}
	
	function mergeDB(extBars,res){
		var currtask = extBars.length-1
		extBars.forEach(function(elm,idx){
			Bars.findOne({url:elm.url},function(err,data){
				if(!err && data){
					
					extBars[idx].attending = data.attending;
					
				} else {
					var bar = new Bars({url:elm.url});
					bar.save();
				}
				
				if(currtask<=0){
					//console.log(extBars)
					return res.json(extBars);
				}
				currtask--;
			})
		});
		
	};
	
	
	/*this.getLocation=function(req,res){
		Bars.findOne({ 'github.id': req.user.github.id },function(err,data){
			if (err) { throw err; }
				res.json(data.location);
			}
		);
	}*/
	
	function handleError(res, err) {
		console.log(err);
	  return res.send(500, err);
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

module.exports = barHandler;
