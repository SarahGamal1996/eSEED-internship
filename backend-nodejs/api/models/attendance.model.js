
var mongoose = require('mongoose');
var attendanceSchema = mongoose.Schema( {

  day: {                          
    type: Date,
    default: Date.now,
  },

  workingHours: {                                 
    type: Number,
    
  },
  employee:  { type: mongoose.Schema.Types.ObjectId , ref: 'employee' } ,
  
  present: {
    type:  Boolean,
    default: false
  },
 
  sick: {
    type:  Boolean,
    default: false
  },
  absent: {
    type:  Boolean,
    default: false
  },
  leave: {
    type:  Boolean,
    default: false
  },
  off: {
    type:  Boolean,
    default: false
  },

  
},{ collection: 'attendance' } );

module.exports = mongoose.model('attendance', attendanceSchema);