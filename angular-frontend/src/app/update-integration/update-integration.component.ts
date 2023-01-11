import { Component, OnInit } from '@angular/core';
import { Integration } from '../integration';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from '../db.service';

@Component({
  selector: 'app-update-integration',
  templateUrl: './update-integration.component.html',
  styleUrls: ['./update-integration.component.css']
})
export class UpdateIntegrationComponent implements OnInit {

  _id: string;
  integration: Integration;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

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