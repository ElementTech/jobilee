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


  public editorOptions: JsonEditorOptions;
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
      name: "{key}",
      description: "Parameter keys"
    },
    {
      name: "{value}",
      description: "Parameter values"
    }
  ]

  _id: string;
  integration: Integration;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
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

  onSubmit() {
    this.updateIntegration();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}