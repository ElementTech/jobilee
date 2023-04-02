import { map, Observable, tap } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from "src/app/shared/data/job/job";
@Component({
  selector: "app-edit-jobs",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class JobEditComponent implements OnInit {


  _id: string;
  job: Observable<Job>;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 

    }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.job = this.dbService.getObject("jobs",this._id);
  }



}