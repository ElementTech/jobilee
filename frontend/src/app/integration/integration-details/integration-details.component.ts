import { Integration } from 'src/app/integration';
import { Component, OnInit, Input } from '@angular/core';
import { DBService } from 'src/app/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.css']
})
export class IntegrationDetailsComponent implements OnInit {
  _id: string;
  integration: Observable<any>;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.integration = this.dbService.getObject("integrations",this._id)
  }

  list(){
    this.router.navigate(['integrations']);
  }
}