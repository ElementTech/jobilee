import { Dashboard } from 'src/app/dashboard';
import { Component, OnInit, Input } from '@angular/core';
import { DBService } from 'src/app/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JsonEditorOptions } from '@maaxgr/ang-jsoneditor';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.css']
})
export class DashboardDetailsComponent implements OnInit {
  _id: string;
  dashboard: Observable<any>;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.dbService.getObject("dashboards",this._id).subscribe(data=>{
      this.dashboard = data
    })
  }
  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'code';
    return editorOptions
  }
  list(){
    this.router.navigate(['dashboards']);
  }
}