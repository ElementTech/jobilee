import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { RunService } from "src/app/run.service";
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
@Component({
  selector: "app-play-job",
  templateUrl: "./play-job.component.html",
  styleUrls: ["./play-job.component.scss"]
})
export class PlayJobComponent implements OnInit {
  _id: string;
  job: Job;
  response: any;
  editorOptions: JsonEditorOptions;
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { 
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

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
    const params = this.job.parameters.map(p=>{ return {"key": p.name, "value": p.default}}).reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
    this.runService.runJob(this._id,params).subscribe(result=>{
      console.log(result)
    })
  }
}