import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { APIData , User } from '../../@core/service/models/api.data.structure';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

 @Component({
  selector: 'app-AdminPage-User',
  templateUrl: './AdminPageUser.component.html',
  styleUrls: ['./AdminPageUser.component.css']
})

export class AdminPageUserComponent implements OnInit {
  private Email;
  private Role;
  private Blocked;
  
   
  ngOnInit() {
    this.refresh();
  }
  settings = {
    actions:{

      custom: [{
        name:'block', 
        title: "Block  "
      } ,
       {name:'downgrade', 
       title: "Downgrade"}]
      
      },
    columns: {
      email: {
        title: 'Email',
        type: 'string',
        editable: false,
        addable: false,
        
      },
      role: {
        title: 'Role',
        type:'string',
        editable: false,
        addable: false,
        default: 'Regular',
      },
      blocked: {
        title: 'Blocked',
        type: 'Boolean',
        editable: false,
        addable: false,
        default: 'False',
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  config: ToasterConfig;

  constructor(private _apiService: APIService) {
    
  }
refresh(): void {
  this._apiService.getUsers().subscribe((apiresponse: APIData)=>{
    
    for (var i = 0 ; i < apiresponse.data.length ; i++ )
      
      console.log(apiresponse.data);
    this.source.load(apiresponse.data);
  });
}

/*public onCustom(event):void{
  
  if(event.action == 'block'){
    this.OnBlock(event)
  }else{
   
    this.OnDown(event)
  }
}


OnBlock(event): void {

  var Users = <User>{};
  Users = event.data;
  if(Users.blocked != true){
    Users.blocked = true;
    this._apiService.blockUser(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This User is Already Blocked")
  }
}

OnDown(event): void {
  var Users = <User>{};
  Users = event.data;
  if(Users.role == 'expert'){
    Users.role = 'regular';
    this._apiService.downgradeExpert(Users).subscribe((apiresponse: APIData)=>{
    // this.showToast( 'default' , 'Message', apiresponse.msg.toString());
      this.refresh();
    });
  }else{
    console.log("This User is Already Regular")
  }
}
*/
}

