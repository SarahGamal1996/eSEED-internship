var mongoose = require('mongoose');
var fs = require('fs');
var employeeSchema = mongoose.Schema( {

  name: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  mobile: {
    type: String,
    required: true,
    trim: true
  },


  hiredDate: {
    type: Date,
    default: Date.now
  },



},{ collection: 'employees' } );


module.exports = mongoose.model('Employee', employeeSchema);
