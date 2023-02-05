import { Dashboard } from 'src/app/dashboard';
import { Component } from '@angular/core';
@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent {


  dashboard: Dashboard = {
    name: "",
  };
  
}