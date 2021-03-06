var mongoose = require('mongoose'),
  config = require('../config/appconfig'),
  dbUrl = config.MONGO_URI;
  
  require('../models/Tag.model');
  require('../models/attendance.model');
  require('../models/employee.model');
  require('../models/user.model');
  require('../models/request.model');
  //require('../models/session.model');
  require('../models/request.model');
  require('../models/slot.model');
  require('../models/slotsOffered.model');
  require('../models/schedule.model');
  

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
var gracefulShutdown = function(callback) {
  mongoose.connection.close(function(err) {
    callback(err);
  });
};

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('nodemon restart');
    }
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', function() {
  gracefulShutdown(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('App termination (SIGINT)');
    }
    process.exit(0);
  });
});

// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('App termination (SIGTERM)');
    }
    process.exit(0);
  });
});

mongoose.connect(dbUrl, function(err) {
  if (!err) {
    return console.log('Successfully connected to mongoDB');
  }
  console.error(err);
  gracefulShutdown(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Could not connect to mongoDB');
    }
    process.exit(1);
  });
});