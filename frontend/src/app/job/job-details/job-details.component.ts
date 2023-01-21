import { Job } from 'src/app/job';
import { Component, OnInit, Input } from '@angular/core';
import { DBService } from 'src/app/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonEditorOptions } from '@maaxgr/ang-jsoneditor';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  _id: string;
  job: Job[];

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

  ngOnInit() {
    this.job = [new Job()];

    this._id = this.route.snapshot.params['_id'];
    this.dbService.getObject("jobs",this._id)
      .subscribe(data => {
        this.job = data;
      }, error => console.log(error));
  }
  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'code';
    return editorOptions
  }
  list(){
    this.router.navigate(['jobs']);
  }
}