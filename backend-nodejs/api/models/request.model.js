
var mongoose = require('mongoose');
var requestSchema = mongoose.Schema( {
  sender: {                                 
    type: String,
    required: true,
    lowercase: true,
  },
  recipient: {                    
    type: String,
    required: true,
  },
  status: {                               
    type :String,
    default : 'pending'
  },
  createdAt: {                          
    type: Date,
    default: Date.now,
  },
  viewed: {                             
    type: Boolean,
    default : 'false'
  },
  type: {                                
    type: String,
    required :true
  }
  
},{ collection: 'Requests' } );

mongoose.model('Request', requestSchema);