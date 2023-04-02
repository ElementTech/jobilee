import { map, Observable, tap } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from "src/app/shared/data/job/job";
@Component({
  selector: "app-create-jobs",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class JobCreateComponent implements OnInit {

  // private _id: any = "";

  constructor(public dbService: DBService,private route: ActivatedRoute,
    private router: Router) {
  }
  job: Job = new Job();
  ngOnInit(){
    // this._id = this.route.snapshot.params["_id"];
    this.job.parameters = []
  }



}