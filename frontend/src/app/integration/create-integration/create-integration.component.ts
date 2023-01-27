import { Integration } from 'src/app/integration';
import { Component } from '@angular/core';
@Component({
  selector: 'app-create-integration',
  templateUrl: './create-integration.component.html',
  styleUrls: ['./create-integration.component.css']
})
export class CreateIntegrationComponent {


  integration: Integration = {
    name: "",
    url: "",
    steps: [],
    authentication: "None",
    authenticationData: []
  };
  
}