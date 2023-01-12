import { DBService } from 'src/app/db.service';
import { Integration } from 'src/app/integration';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
@Component({
  selector: 'app-create-integration',
  templateUrl: './create-integration.component.html',
  styleUrls: ['./create-integration.component.css']
})
export class CreateIntegrationComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;

  integration: Integration = {
    type: 'post'
  };
  submitted = false;
  optionsURL = [
    {
      name: "{token}",
      description: "An optional Token to be Inserted as an Authentication method to the query"
    }
  ]
  options = [
    {
      name: "{job}",
      description: "The Name/ID of the job that will be triggered through the query"
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
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
      this.editorOptions.mode = 'code';
      this.editorOptions.expandAll = true

  
      this.initialData = {"parameter": [{"name": "{key}", "value": "{value}"}]}

     }

  ngOnInit() {
  }

  newIntegration(): void {
    this.submitted = false;
    this.integration = new Integration();
  }

  save() {
    this.dbService
    .createObject("integrations",this.integration).subscribe(data => {
      console.log(data)
      this.integration = new Integration();
      this.gotoList();
    }, 
    error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}