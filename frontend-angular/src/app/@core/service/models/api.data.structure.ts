export interface APIData {
    err,
    msg: String,
    data;
}

export interface Tags {
  _id:String;
  name: String;
  status: String;
  blocked: Boolean;
}

export interface User {
    _id:String;
    name : String;
    email:String;
    password:any;
}

export interface Employee{
    _id:String;
    name : String;
    email:String;
    mobile:String;
    hiredDate: Date;
}

export interface Tags {
    _id:String;
    name: String;
    status: String;
    blocked: Boolean;
  }

export interface Profile {
    email ,
    description,
    password,
    rating,
    confirmPassword;
}

export interface Request{
  _id:String;
  user: String;
  createdAt: String;
  status: String;
  viewed: boolean;
}

export interface FileData {
    file: File
}

export interface Session {
    sessionId : String;
    userId : String;
}

export interface CandicateSession extends Session {
    rtcDes : String;
}


export interface Slots {
    expertId : String;
    date : Date;
    slots: [oneSlot]
}

export interface oneSlot extends Slots {
    sessionId : String;
    date: Date;
    usersAccepted: [User];
    usersRequested: [User]

}

export interface SlotData{
    slotDate1: String;
    slotTime1: String;
    slotDate2: String;
    slotTime2: String;
    slotDate3: String;
    slotTime3: String;
}
    
export interface RequestData{
    sender: String;  
    recipient: String;
    status: String;
    createdAt: String;
    viewed:Boolean;
    type: String;   
  }
  
  export interface OfferedSlots{
    user_email: String;  
    expert_email: String;
    slots: [String];
    status: String;
  }
