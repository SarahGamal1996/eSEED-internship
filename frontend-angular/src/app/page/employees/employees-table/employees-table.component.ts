import { Component,OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { SmartTableService } from '../../../@core/data/smart-table.service';

import { APIService } from '../../../@core/service/api.service';
import { APIData, Employee } from '../../../@core/service/models/api.data.structure';
@Component({
  selector: 'ngx-employees-table',
  templateUrl: './employees-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class EmployeesTableComponent implements OnInit{

  ngOnInit() {
  }
  settings = {
    add: {
      addButtonContent: ' + ',
      createButtonContent: ' create ',
      cancelButtonContent: ' cancel ',
    },
    edit: {
      editButtonContent: ' edit ',
      saveButtonContent: ' save ',
      cancelButtonContent: ' cancel ',
    },
    delete: {
      deleteButtonContent: ' delete ',
      confirmDelete: true,
    },
    columns: {
     
      name: {
        title: 'Name',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      mobile: {
        title: 'Mobile Number',
        type: 'number',
      },
      hiredDate: {
        title: 'Hired Date',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

    constructor(private _apiService: APIService) {
      this.source.onAdded().subscribe((employee :Employee)=>{
       
        this._apiService.addEmployee(employee).subscribe((apiresponse: APIData)=>{
          console.log(apiresponse);
        });
      });

      this._apiService.viewEmployees().subscribe((apiresponse: APIData)=>{
        for (var i = 0 ; i < apiresponse.data.length ; i++ )
          apiresponse.data[i].id = (i+1);

        console.log(apiresponse.data[0]);
        this.source.load( apiresponse.data);
      });
      this.source.onRemoved().subscribe((employee :Employee)=>{
        
                this._apiService.deleteEmployee(employee).subscribe((apiresponse: APIData)=>{
                  console.log(apiresponse);
                });
              });

      this.source.onUpdated().subscribe((employee :Employee)=>{
                
                        this._apiService.updateEmployee(employee).subscribe((apiresponse: APIData)=>{
                          console.log(apiresponse);
                        });
                      });
        
    }

    onDeleteConfirm(event): void {
      if (window.confirm('Are you sure you want to delete this employee ?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    }


}
