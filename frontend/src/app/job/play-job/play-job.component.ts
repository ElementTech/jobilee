import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { RunService } from "src/app/run.service";
@Component({
  selector: "app-play-job",
  templateUrl: "./play-job.component.html",
  styleUrls: ["./play-job.component.scss"]
})
export class PlayJobComponent implements OnInit {
  _id: string;
  job: Job;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { }

  ngOnInit() {
    this.job = new Job();

    this._id = this.route.snapshot.params['_id'];
    this.dbService.getObject("jobs",this._id)
      .subscribe(data => {
        this.job = data;
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['jobs']);
  }

  run(){
    this.runService.runJob(this._id).subscribe(result=>{
      console.log(result)
    })
  }
}