 var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  authCtrl = require('../controllers/auth.controller'),
  userCtrl = require('../controllers/user.controller'),
  //sessionCtrl = require('../controllers/session.controller'),
  expert = require('../controllers/expert.controller'),
  AdminController = require('../controllers/Admin.Controller');
  
 
var isAuthenticated = function(req, res, next) {
  // Check that the request has the JWT in the authorization header
  var token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      error: null,
      msg: 'You have to login first before you can access your lists.',
      data: null
    });
  }
  // Verify that the JWT is created using our server secret and that it hasn't expired yet
  jwt.verify(token, req.app.get('secret'), function(err, decodedToken) {
    if (err) {
      return res.status(401).json({
        error: err,
        msg: 'Login timed out, please login again.',
        data: null
      });
    }
    req.decodedToken = decodedToken;
    next();
  });
};

var isNotAuthenticated = function(req, res, next) {
  // Check that the request doesn't have the JWT in the authorization header
  var token = req.headers['authorization'];
  if (token) {
    return res.status(403).json({
      error: null,
      msg: 'You are already logged in.',
      data: null
    });
  }
  next();
};

// all the methods below are all routers where we specify a route for api.service to 
// call and what method in the backend to go with the specefied route 
//-----------------------------Authentication Routes-------------------------
router.post('/auth/login' , isNotAuthenticated , authCtrl.login);
router.post('/auth/signup' , isNotAuthenticated , authCtrl.signup);
//----------------------------Admin Routes ----------------------------------
router.post('/Tags/AddTag', AdminController.AddTag);
router.get('/Tags/getTags' , AdminController.getTags);
router.patch('/Tag/editTags/:tagId', AdminController.editTag);
router.delete('/Tags/deleteTags/:tagId' , AdminController.deleteTags);
router.patch('/User/blockUser/:userId', AdminController.blockUser);
router.patch('/User/downgradeExpert/:userId', AdminController.downgradeExpertToUser);
router.get('/User/getUsers',AdminController.getUsers);
//----------------------------User Routes -----------------------------------
router.post('/auth/updateEmail', isAuthenticated , userCtrl.updateEmail);
router.post('/auth/updatePassword', isAuthenticated , userCtrl.updatePassword);
router.post('/auth/updateDescription', isAuthenticated , userCtrl.updateDescription);

//-----------------------------User Role Expert Routes-------------------------
router.post('/expert/chooseSlot',expert.chooseSlot);
router.patch('/expert/editSlotRequest/:requestId', isAuthenticated , expert.editSlotRequest);
router.post('/expert/addSpeciality', isAuthenticated , expert.addSpeciality); 
router.delete('/expert/editSpeciality/:tagId',isAuthenticated,expert.editSpeciality);


router.post('/expert/createSchedule',isAuthenticated,expert.createSchedule);
router.get('/expert/viewSchedule',expert.viewSchedule);
router.get('/expert/viewScheduledSlots',isAuthenticated,expert.viewScheduledSlots);
router.get('/expert/viewRequestedSlots',isAuthenticated,expert.viewRequestedSlots);
//router.post('/expert/acceptRequest',isAuthenticated,expert.acceptRequest);
//router.post('/expert/rejectRequest',isAuthenticated,expert.rejectRequest);
//router.post('/expert/rejectallRequest',isAuthenticated,expert.rejectAllRequests);
//-------------------------------------------------------------------
/*router.post('/session/create' , isNotAuthenticated, sessionCtrl.createSession);
router.post('/session/addCandidate' , isNotAuthenticated, sessionCtrl.addCandidate);
router.post('/session/updateCandidate' , isNotAuthenticated, sessionCtrl.updateCandidate);
router.post('/session/getCandidatesRTCDes/:sessionId' , isNotAuthenticated, sessionCtrl.getCandidatesRTCDes);*/

router.post('/photo', isAuthenticated , userCtrl.uploadimage);
router.get('/getphoto', isAuthenticated , userCtrl.getimage);
router.get('/loadStatus', isAuthenticated , userCtrl.loadStatus);
router.post('/auth/changeUserStatus' , isAuthenticated , userCtrl.changeUserStatus);

//-----------------------------User Routes-------------------------
router.post('/user/updateRating', isAuthenticated , userCtrl.updateRating);

router.get('/getExpertSchedule/:expertEmail', isAuthenticated, userCtrl.getExpertSchedule);

router.post('/user/upgradeToexpert', isAuthenticated , userCtrl.upgradeToExpert);

//to get offered slots:
router.get('/user/getOfferedSlots', isAuthenticated, userCtrl.getOfferedSlots);
//to choose slot
router.post('/user/reserveSlot', isAuthenticated, userCtrl.reserveSlot);
router.post('/user/chooseSlot/:expertEmail', isAuthenticated, userCtrl.chooseSlot);
router.get('/user/viewSuggestedExperts/:tagName', isAuthenticated, userCtrl.viewSuggestedExperts);
router.get('/user/userViewScheduledSlots',isAuthenticated, userCtrl.userViewScheduledSlots);
router.get('/user/viewEmployees', userCtrl.viewEmployees);
router.post('/user/addEmployee', userCtrl.addEmployee);
router.post('/user/updateEmployee', userCtrl.updateEmployee);
router.delete('/user/deleteEmployee/:email', userCtrl.deleteEmployee);

module.exports = router;