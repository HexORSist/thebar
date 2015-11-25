'use strict';

var yelpnode = require('yelp');
var Bars = require('../models/bar.model.js');
var qs = require('qs')
var path = process.cwd();

function barHandler () {
	
	this.barAttend=function(req,res){
		var found = false;
		Bars.findOne({url:req.body.url},function(err,data){
			if (err) { throw err; }
			var idx = data.attending.indexOf(req.user.github.id.toString())
			if(idx!=-1){
				data.attending.splice(idx,1);
				found = true;
				
			} else {
				data.attending.push(req.user.github.id);
			}
			data.save();
			return res.json(data);
		})
		
	}
	
	this.barStart=function(req,res){
		
		var yelp = new yelpnode({
	      consumer_key: "qXHtGS14FEUgQCaQx1NLhQ",
	      consumer_secret: "QaXUu07XYss4ZBPujXNysQPKVwo",
	      token: "hEqj3vGFdvISd5zTGYHsQ-ttUWLzts6O",
	      token_secret: "_a4x-PfQVoOMV9ZLxalZSEazZHU"
	    });
	    yelp.search({category_filter: "bars", location: req.user.location}, function(error, data) {

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
					return res.json(extBars);
				}
				currtask--;
			})
		});
		
	};
	

	function handleError(res, err) {
		console.log(err);
	  return res.send(500, err);
	}

}

module.exports = barHandler;
