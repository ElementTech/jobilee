import { Integration } from 'src/app/integration';
import { Component, OnInit, Input } from '@angular/core';
import { DBService } from 'src/app/db.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.css']
})
export class IntegrationDetailsComponent implements OnInit {
  _id: string;
  integration: Integration[];

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

  ngOnInit() {
    this.integration = [new Integration()];

    this._id = this.route.snapshot.params['_id'];
    this.dbService.getObject("integrations",this._id)
      .subscribe(data => {
        this.integration = [data];
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['integrations']);
  }
}