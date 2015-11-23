'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BarSchema = new Schema({
  //name: String,
  url: String,
  //image_url: String,
  //snippet: String,
  attending: Array,
  //active: Boolean
});

module.exports = mongoose.model('Bar', BarSchema);