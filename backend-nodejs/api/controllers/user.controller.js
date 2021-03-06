var mongoose = require('mongoose'),
moment = require('moment'),
jwt = require('jsonwebtoken'),
Validations = require('../utils/Validations'),
Encryption = require('../utils/encryption'),
EMAIL_REGEX = require('../config/appconfig').EMAIL_REGEX,
User = mongoose.model('User'),
Request = mongoose.model('Request'),
OfferedSlot = mongoose.model('OfferedSlot'),
schedule = mongoose.model('Schedule'),
Employee = mongoose.model('Employee'),
moment = require('moment');
var Binary = require('mongodb').Binary;
var fs = require('fs');
// Nour Nounou: I implemented the update email, update password, and update description methods.
module.exports.changeUserStatus = function(req, res, next) {
  /* Add Validations */
  delete req.body.email;
  console.log(req.body);
  User.findByIdAndUpdate(req.decodedToken.user._id,{ $set: req.body },{ new: true }).exec (function(err, updatedUser) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({
      err: null,
      msg: 'Online Status Successfully Toggled.',
      data: updatedUser
    });
  });
};

module.exports.loadStatus = function(req, res) {
  User.findById(req.decodedToken.user._id).exec (function(err, User) {
    if (err) {
       return next(err);
     }
     res.status(201).json({
       err: null,
       msg: 'i.',
       data: User.onlineStatus
     });
     //res.end();
   });
};

module.exports.getimage = function(req, res) {
  User.findById(req.decodedToken.user._id).exec (function(err, user) {
    if (err) {
       return next(err);
     }
    return res.status(201).json({
       err: null ,
       msg: null ,
       data: { buffer : user.img.data , contentType : user.img.contentType }
    });
   });
};

module.exports.uploadimage = function(req, res) {
  User.findByIdAndUpdate(req.decodedToken.user._id,{ $set: { img: { data : req.file.buffer , contentType: req.file.mimetype } } } , 
    { new: true } ).exec ( function(err, updatedUser) {
      /* Checks For File Type */
    if (err) {
       return next(err);
     }
     return res.status(201).json({
       err: null,
       msg: 'image got updated.',
       data: { buffer : updatedUser.img.data , contentType : updatedUser.img.contentType } /* Hnn3ml load el new Image From El Browser B3d El Checks 
       Only Confirmation Message Is Needed*/ 
     });
   });
  
};

module.exports.updateEmail = function(req, res, next) {
  if (!Validations.matchesRegex(req.body.email, EMAIL_REGEX)) {
    return res.status(422).json({
      err: null,
      msg: 'Email must be in correct format.',
      data: null
    });
  }
  delete req.body.updatedAt;
  req.body.updatedAt = moment().toDate();

  User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }

    //exec method returns the matched text if it finds a match, otherwise it returns null.

    User.findOne({ email: req.body.email.trim().toLowerCase()}).exec(function(err, updatedUser) {
      // If an err occurred, call the next middleware in the app.js which is the error handler
      if (err) {
        return next(err);
      }
      // If there is a user with this email don't continue
      if (updatedUser) {
        return res.status(422).json({
          err: null,
          msg:'A user with this email address already exists, please try another email address.',
          data: null
        });
      }
      User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
        if (err) {
          return next(err);
        }
        res.status(201).json({
          err: null,
          msg: 'Email updated successfully.',
          data: updatedUser
        });
      });
    });
  });
};

module.exports.updatePassword = function(req, res, next) {

    var valid =
   req.body.password &&     //enno dakhalhom
    Validations.isString(req.body.password) &&
    req.body.confirmPassword &&
    Validations.isString(req.body.confirmPassword);

  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'password(String) and confirmPassword(String) are required fields.',
      data: null
    });
  }

  var password = req.body.password.trim();

  if (password.length < 8) {
    return res.status(422).json({
      err: null,
      msg: 'Password must be of length 8 characters or more.',
      data: null
    });
  }

  if (password !== req.body.confirmPassword.trim()) {
    return res.status(422).json({
      err: null,
      msg: 'password and confirmPassword does not match.',
      data: null
    });
  }

  delete req.body.updatedAt;

  Encryption.hashPassword(password, function(err, hash) {
    if (err) {
      return next(err);
    }
    req.body.password = hash;
    User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        err: null,
        msg: 'Password updated successfully.',
        data: updatedUser
      });
    });
  });
  
};

module.exports.updateDescription = function(req, res, next) {
 if (!(Validations.isString(req.body.description))){
  return res.status(422).json({
    err: null,
    msg:'Description must be of String format',  
    data: null
  });
 }
 User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
  if (err) {
     return next(err);
  }
  return res.status(201).json({
      err: null,
      msg: 'Description updated successfully.',
      data: updatedUser
    });
  }); 
};

module.exports.updateRating = function(req, res, next) {
    // console.log("hi")
    //  console.log(req.body);
    //  console.log(req.email);
    //  console.log(req.decodedToken);
    // console.log("hi1");
  User.findByIdAndUpdate(req.decodedToken.user._id,{$set: req.body},{ new: true }).exec (function(err, updatedUser) {
    console.log("hi2");
    delete updatedUser.img;
    return res.status(201).json({
      err: null,
      msg: 'Rating updated successfully.',
      data: updatedUser
    });
  });    
};
   
module.exports.getExpertSchedule = function(req, res, next) {
  /* if (!Validations.isObjectId(req.params.userId)) {
    return res.status(422).json({
      err: null,
      msg: 'user parameter must be a valid ObjectId.',
      data: null
    });
  }  */

 // User.findById('5ad66d9564a0b6360cee1120').exec(function(err, user) {
  User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: null, msg: 'User not found.', data: null });
    }
  //  console.log(req.decodedToken.user._id);
    //console.log(req);
   // console.log(req.params.expertID);
    schedule.find({
    //  expertID:'5ad5bee364a0b6360cee111b',
        expertEmail: req.params.expertEmail ,
      
    }).exec(function(err, slots) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:' slots defined by expert retrieved successfully.',
        data: slots
      });
    });


  });
// dummy data for testing to display a schedule 

/*
const schedule = ["Monday: 12pm - 1pm",
"Tuesday: 2pm - 3pm",
,
"Friday: 9am - 10am",
"Sunday: 10pm - 11pm"];


res.status(200).json({
  err: null,
  msg: 'Schedule retrieved successfully.',
  data: schedule
});

*/
};


module.exports.upgradeToExpert = function(req, res, next){
  var valid = req.body.type && Validations.isString(req.body.type) && 
              // req.body.sender && Validations.isString(req.body.sender) &&
              req.body.recipient && Validations.isString(req.body.recipient) 
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'The sender, the recipent and the type of the request are required string fields.',
      data: null
      });
    }
    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({ err: null, msg: 'User not found.', data: null });
      }
      req.body.sender = req.decodedToken.user.username;
      delete req.body.createdAt;
      delete req.body.status;
      delete req.body.viewed;
      Request.create(req.body, function(err, request) {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        err: null,
        msg: 'Your request to being an expert has been sent to the admin.',
        data: request
      });
    });
  });
};

module.exports.getOfferedSlots = function(req, res, next) {
  OfferedSlot.find({user_email : req.decodedToken.user.email}).exec(function(err, OfferedSlotsTable) {
    if (err) {
      return next(err);
    }
    if (!OfferedSlotsTable) {
      return res.status(404).json({ err: null, msg: 'You are still not offered any slots', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'Here are your offered appointments',
      data: OfferedSlotsTable
    });
  });
};

module.exports.reserveSlot = function(req, res, next) {
  OfferedSlot.findOneAndUpdate({ $and: [ { user_email: req.decodedToken.user.email }, { expert_email: req.body.expert_email } ] }, { $set:{ status : req.body.status } },function( err, updatedTable ) {
    if (err) {
      return next(err);       
    }
    if (!updatedTable) {
      return res.status(404).json({ err: null, msg: 'Record not found.', data: null });
    }
    return res.status(200).json({
      err: null,
      msg: 'Successfully reserved/declined slot.',
      data: updatedTable
    });
  });
};

module.exports.viewSuggestedExperts = function(req, res, next) {
  User.find({"createdTags": req.params.tagName, "role" : "expert"}).exec(function(err, User) {
  if (err) {
    return next(err);
  }   
  res.status(200).json({
    err: null,
    msg: 'Experts retrieved successfully.',
    data: User
  });
});
};


module.exports.userViewScheduledSlots = function(req, res, next) {
  // Check that the body keys are in the expected format and the required fields are there

  var valid = req.body.userId && Validations.isObjectId(req.body.userId);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'userId is Not Valid',
      data: null
    });
  } else
  
  
  { 


      User.findById(req.decodedToken.user._id).exec(function(err, user) {
          if (err) 
              return next(err);
          if(user){
              req.body.expertID = user._id;

         console.log("hena");
              Request.find({sender: user.email,}).exec(function(err,request){

                if (! request){
                 
                  
                    if(err)
                        return next(err);
                    return res.status(201).json({
                      err: null ,
                       msg: 'no request slots sent by this user id' ,
                       data: null
                      });    
                
              }

                 else{ 
                  console.log("found a request");

                  User.find({email: request.recipient}).exec(function(err, User) {
                    if (err) {
                      return next(err);
                    }   
                    const expert = User._id;

                    res.status(200).json({
                      err: null,
                      msg: 'Experts retrieved successfully.',
                      data: User
                    });
                  });
                  



      Schedule.find(  
        { expertID : { $eq : expert } }  ,  

         { slots :{ Date : req.body.Date } } 
    ).exec(function(err, slots) {
      
        if (err) 
            return next(err);
        if(slots) {
            return res.status(201).json({
                err: null ,
                msg: 'slots retrieved Successfully' ,
                data: schedule
            });
        } else {
            return res.status(409).json({
                err: null ,
                msg: 'retrieving slots Failed' ,
                data: null
            });
             }
    });
                  }    })
                          
              } 

        //if not a user
        else {
              return res.status(404).json({
                  err: null,
                  msg: 'Unable to locate userWithId :' + req.body.userId,
                  data: null
              });
  }  } )};
};

module.exports.chooseSlot = function(req, res, next) {
  schedule.findOneAndUpdate({ expertEmail: req.params.expertEmail, 'slots.sessionId':req.body.sessionId     },  { $push: { 'slots.$.usersRequested': req.decodedToken.user.email}},function( err, updatedTable ) {
    if (err) {
      return next(err);       
    }
    if (!updatedTable) {
      return res.status(404).json({ err: null, msg: "Not able to request to attend this session.", data: null });
    }
    return res.status(200).json({
      err: null,
      msg: 'Successfully requested to reserve this slot.',
      data: updatedTable
    });
  });
};

module.exports.viewEmployees = function(req, res, next) {

  Employee.find({},function( err, employees ) {
    if (err) {
      return next(err);       
    }
    
    return res.status(200).json({
      err: null,
      msg: 'Employees successfully retrieved.',
      data: employees
    });
  });

};

module.exports.addEmployee = function(req, res, next) {
  var valid =
    req.body.name &&
    Validations.isString(req.body.name) &&
    req.body.mobile &&
    req.body.email &&
    req.body.hiredDate ;
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'name (String), mobile (String) and hired date (date) are required fields.',
      data: null
    });
  }
  
  Employee.create(req.body, function(err, employee) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Employee was added successfully.',
      data: employee
    });
  });
};

module.exports.updateEmployee = function(req, res, next) {

  Employee.findOneAndUpdate({ email: req.body.email},{$set: req.body},{ new: true }).exec (function(err, updatedEmployee) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Employee updated successfully.',
      data: updatedEmployee
    });
  });

};

module.exports.deleteEmployee = function(req, res, next) {

  Employee.findOne({ email: req.params.email}).exec(function(err, deletedEmployee) {
  
    if (err) {
      return next(err);
    }
    
    if (deletedEmployee) {

      Employee.deleteOne({email: req.params.email});
      return res.status(422).json({
        err: null,
        msg:'The employee was successfully deleted.',
        data: deletedEmployee
      });
    }
   return res.status(404).json({
      err: null,
      msg: 'Employee not found.',
      data: null
    });
  });


  //Employee.findOne()
  //Employee.remove({email: req.params.email})
   /* if (err) {
      return next(err);
    }
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ err: null, msg: 'Employee not found.', data: null });
    }
    res.status(200).json({
      err: null,
      msg: 'Employee was deleted successfully.',
      data: deletedEmployee
    });
  });*/
};
