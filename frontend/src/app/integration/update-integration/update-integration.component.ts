import { Component, OnInit } from '@angular/core';
import { Integration } from 'src/app/integration';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from 'src/app/db.service';
import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor"

@Component({
  selector: 'app-update-integration',
  templateUrl: './update-integration.component.html',
  styleUrls: ['./update-integration.component.css']
})
export class UpdateIntegrationComponent implements OnInit {


  public initialData: any;

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
  _id: string;
  integration: Integration;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 
    }

  ngOnInit() {
    this.integration = new Integration();

    this._id = this.route.snapshot.params['_id'];
    
    this.dbService.getObject("integrations",this._id)
      .subscribe(data => {
        this.integration = data;
      }, error => console.log(error));
  }

  updateIntegration() {
    this.dbService.updateObject("integrations",this._id, this.integration)
      .subscribe(data => {
        console.log(data);
        this.integration = new Integration();
        this.gotoList();
      }, error => console.log(error));
  }

  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'code';
    return editorOptions
  }

  onSubmit() {
    this.updateIntegration();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}