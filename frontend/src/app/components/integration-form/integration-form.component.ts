import { DBService } from 'src/app/db.service';
import { Integration, Step } from 'src/app/integration';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import Swal from 'sweetalert2';
import { MenuItem } from 'primeng/api';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-integration-form',
  templateUrl: './integration-form.component.html',
  styleUrls: ['./integration-form.component.scss']
})
export class IntegrationFormComponent implements OnInit {

  public initialData: any;

  goBack(stepper: MatStepper){
      stepper.previous();
  }
  
  goForward(stepper: MatStepper){
      stepper.next();
  }
  @Input() _id: string;
  @Input() formType: "Create" | "Update";

  @Input() integrationSteps = new Integration

  authenticationOptions = [
    "None",
    "Basic",
    "Bearer"
  ];

  extractCurlyStrings(json: any): string[] {
    let results: string[] = [];
    if (!(json == undefined || json == null))  {
      for (const key of Object.keys(json)) {
        const value = json[key];
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            results.push(value.substring(1, value.length-1));
        }
        if (typeof value === 'object') {
            results = results.concat(this.extractCurlyStrings(value));
        }
      }
    }

    return results;
  }

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
    // {
    //   name: "{random:NUMBER}",
    //   description: "Generate a random alphanumeric string if needed. NUMBER is the length of that string. Eg: {random:10}."
    // },
    { 
      name: "{key}",
      description: "Parameter keys"
    },
    {
      name: "{value}",
      description: "Parameter values"
    }
  ]
  makeVariables(step){
    let out = this.integrationSteps.steps.slice(0,step).map(data=>(this.extractCurlyStrings(data.outputs)))
    let newOut = out.reduce((acc, val) => acc.concat(val), []).map(data=>{return {"name":"{"+data+"}",description:""}});
    return this.options.concat(
      newOut
    )
  }
  pushCopy(){
    this.integrationSteps.steps.push({
      type: 'post',
      parsing: false,
      mode: 'payload',
      authentication: 'None',
      retryDelay: 5,
      retryCount: 0,
      parsingTimeout: 300,
      parsingDelay: 1,
      outputs: {},//{ "result": "{result}" },
      retryUntil: {},//{ "result": "SUCCESS" },
      failWhen: {},//{ "result": "FAILURE" },
      splitMultiChoice: true,
      authenticationData: [],
      headers: [{ "key": "Content-Type", "value": "application/json" }],
      payload: { "parameter": ['{parameter}'] },
      ignoreSSL: false,
      parameter: { "name": "{key}", "value": "{value}" },
    })
  }
  constructor(private dbService: DBService,
    private router: Router) {

     }
  items: MenuItem[];
  ngOnInit() {
    this.items = [
      {label: 'Trigger'},
    ];
    if (this.integrationSteps.steps?.length == 0)
    {
      this.pushCopy()
    }
  }
  setAuthData(event,step){
    console.log(event.value)
    if (event.value == "None")
    {
      this.integrationSteps.steps[step].authenticationData = []
    }
    if (event.value == "Basic")
    {
      this.integrationSteps.steps[step].authenticationData = [{"key":"Username", "value": ""},{"key":"Password", "value": ""}]
    }
    if (event.value == "Bearer")
    {
      this.integrationSteps.steps[step].authenticationData = [{"key":"Token", "value": ""}]
    }
  }
  addHeader(step)
  {
   this.integrationSteps.steps[step].headers.push({'key':'','value':''});
   this.integrationSteps.steps = [...this.integrationSteps.steps]
  }
  removeHeader(step,i,head)
  {
    if ((head["key"] == "Content-Type") && (head["value"] == "application/json") && (this.integrationSteps.steps[step].mode == 'payload') && (this.integrationSteps.steps[step].type == 'post'))
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'If Payload mode is enabled, the [Content-Type=application/json] header must be present.',
      })
    } else {
      this.integrationSteps.steps[step].headers.splice(i,1)
    }

  }
  setTable(event,step)
  {
    switch (event.value) {
      case 'get':
      case 'query':
        this.options = [
          {
            name: "{job}",
            description: "The Name/ID of the job that will be triggered through the query"
          }
        ]        
        if (this.integrationSteps.steps[step].headers.some(elem =>{
          return JSON.stringify({"key":"Content-Type", "value": "application/json"}) === JSON.stringify(elem);
           })) {
          this.integrationSteps.steps[step].headers.splice(this.integrationSteps.steps[step].headers.indexOf({"key":"Content-Type", "value": "application/json"}),1)
        }
        break;
      case 'post':
      case 'payload':
        if (!this.integrationSteps.steps[step].headers.some(elem =>{
          return JSON.stringify({"key":"Content-Type", "value": "application/json"}) === JSON.stringify(elem);
           })) {
          this.integrationSteps.steps[step].headers.push({"key":"Content-Type", "value": "application/json"});
        }
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
    if (this.formType == "Create")
    {
      this.dbService
      .createObject("integrations",this.integrationSteps).subscribe(data => {
        this.integrationSteps = new Integration();
        this.gotoList();
      }, 
      error => console.log(error));
    } 
    else if (this.formType == "Update")
    {
      this.dbService.updateObject("integrations",this._id, this.integrationSteps)
      .subscribe(data => {
        console.log(data);
        this.integrationSteps = new Integration();
        this.gotoList();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}