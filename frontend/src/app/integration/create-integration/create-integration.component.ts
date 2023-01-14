import { DBService } from 'src/app/db.service';
import { Integration } from 'src/app/integration';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
@Component({
  selector: 'app-create-integration',
  templateUrl: './create-integration.component.html',
  styleUrls: ['./create-integration.component.css']
})
export class CreateIntegrationComponent implements OnInit {

  public initialData: any;

  integration: Integration = {
    type: 'post',
    authentication: 'None',
    splitMultiChoice: true,
    authenticationData: [],
    headers: [{"key":"Content-Type", "value": "application/json"}],
    payload: {"parameter": ['{parameter}']},
    ignoreSSL: false,
    parameter: {"name": "{key}", "value": "{value}"}
  };
  authenticationOptions = [
    "None",
    "Basic",
    "Bearer"
  ];

  submitted = false;
  optionsURL = [
    {
      name: "{token}",
      description: "An optional hidden Token to be Inserted as an Authentication method to the query"
    }
  ]
  options = [
    {
      name: "{job}",
      description: "The Name/ID of the job that will be triggered through the query"
    },
    { 
      name: "{parameter}",
      description: "Defines a Parameter Object. This will be inserted inside the main payload into an array. If payload is only equal to the string \"{parameter}\", the parameters will be merged into a single key=value object."
    },
    { 
      name: "{key}",
      description: "Parameter keys"
    },
    {
      name: "{value}",
      description: "Parameter values"
    }
  ]

  constructor(private dbService: DBService,
    private router: Router) {
     }

  ngOnInit() {
  }
  setAuthData(event){
    console.log(event.value)
    if (event.value == "None")
    {
      this.integration.authenticationData = []
    }
    if (event.value == "Basic")
    {
      this.integration.authenticationData = [{"key":"Username", "value": ""},{"key":"Password", "value": ""}]
    }
    if (event.value == "Bearer")
    {
      this.integration.authenticationData = [{"key":"Token", "value": ""}]
    }
  }
  addHeader()
  {
   this.integration.headers.push({'key':'','value':''});
   this.integration.headers = [...this.integration.headers]
  }
  removeHeader(i)
  {
   this.integration.headers.splice(i,1)
   this.integration.headers = [...this.integration.headers]
  }
  setTable(event)
  {
    switch (event.value) {
      case 'get':
        this.options = [
          {
            name: "{job}",
            description: "The Name/ID of the job that will be triggered through the query"
          }
        ]        
        break;
      case 'post':
        this.options = [
          {
            name: "{job}",
            description: "The Name/ID of the job that will be triggered through the query"
          },
          { 
            name: "{parameter}",
            description: "Defines a Parameter Object. This will be inserted inside the main payload into an array. If payload is only equal to the string \"{parameter}\", the parameters will be merged into a single key=value object."
          },
          { 
            name: "{key}",
            description: "Parameter keys"
          },
          {
            name: "{value}",
            description: "Parameter values"
          }
        ]
      default:
        break;
    }
  }

  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'code';
    return editorOptions
  }
  save() {
    this.dbService
    .createObject("integrations",this.integration).subscribe(data => {
      this.integration = new Integration();
      this.gotoList();
    }, 
    error => console.log(error));
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}