import { DBService } from "src/app/db.service";
import { Dashboard } from "src/app/dashboard";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from "sweetalert2";
import { toSelectItem } from "src/main";
import { Observable } from "rxjs";
@Component({
  selector: "app-play-dashboard",
  templateUrl: "./play-dashboard.component.html",
  styleUrls: ["./play-dashboard.component.scss"]
})
export class PlayDashboardComponent implements OnInit {
  _id: string;
  dashboard: Observable<any>;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.dashboard = this.dbService.getObject("dashboards",this._id)
  }

  list(){
    this.router.navigate(['dashboards']);
  }
}