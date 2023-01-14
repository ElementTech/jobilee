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

}