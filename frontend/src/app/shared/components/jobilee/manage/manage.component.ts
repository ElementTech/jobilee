// import { JobDetailsComponent } from '../job-details/job-details.component';
import { Observable, of } from "rxjs";
import { DBService } from "../../../services/db.service";
// import { Job } from "src/app/shared/data/job/job";
import { Component, Input, OnInit, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { Router } from '@angular/router';
const Swal = require('sweetalert2')
import { NgbdSortableHeader, SortEvent } from '../../../directives/NgbdSortableHeader';
import {FormControl} from '@angular/forms'
import {
  switchMap,
  debounceTime,
  tap,startWith,
  distinctUntilChanged,
  delay,
  take
} from "rxjs/operators";
import { merge, BehaviorSubject } from "rxjs";
@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"]
})
export class ManageComponent implements OnInit {

  @Input() title: String = "";
  @Input() tableHeaders: Array<String> = [];
  @Input() tableProperties: Array<String> = [];
  @Input() customTemplates: any = {};
  @Input() templateContext: any = {};
  @Input() pageSize:number=10;
  @Input() data:any[] = []; 

  constructor(private dbService: DBService,
    private router: Router) {
  }

  total: number;
  filter = new FormControl();
  page:number=1;
  elements$:Observable<any>

  pag:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  paginator$=this.pag.asObservable();

  sort:any={active:"position",direction:'desc'};
  isLoadingResults = true;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  getLength(filter:string)
  {
    return of(this.getElement(filter).length)
    .pipe(tap(_=>{console.log("getTotal")}));
  }

  initTable()
  {
    const obsFilter=this.filter.valueChanges.pipe(
      debounceTime(200),
      startWith(null),
      switchMap((res: string) => this.getLength(res)),
      tap((res: number) => {
        this.total = this.data.length;
      })
    );

    this.elements$=merge(obsFilter, this.paginator$)
      .pipe(
        distinctUntilChanged(),
        tap(_=>{this.isLoadingResults=true}),
        switchMap(res => {
          return this.getData(
            this.page,
            this.pageSize,
            this.filter.value,
            this.sort.active,
            this.sort.direction
          );
        }),
        tap(_ => (this.isLoadingResults = false))
      )

  }

  ngOnInit()
  {
    this.initTable()

  }
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.sort={active:column,direction:direction}
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.pag.next(this.sort)
  }

  getData(page:number,pageSize:number,filter:string,sortField:string,sortDirection:string)
  {
    const factor=sortDirection=='desc'?-1:sortDirection=='asc'?1:0
    return factor?of(this.getElement(filter)
    .sort((a:any,b:any)=>a[sortField]>b[sortField]?-factor:factor)
    .slice((page-1)*pageSize,page*pageSize)).pipe(
      tap(_=>{console.log("get elements")})):
      of(this.getElement(filter)
    .slice((page-1)*pageSize,page*pageSize)).pipe(
      tap(_=>{console.log("get elements")}))
    
  }

  getElement(filter:string)
  {
     return !filter?[...this.data]:this.data.filter(x=>x.name.indexOf(filter)>=0)
  }

  deleteItem(element) {
    console.log(element)
    Swal.fire({
      title: 'Are you sure?',
      // text: "This will break jobs that depend on this job.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject(`${this.title}`,element._id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              `${this.title} have been deleted.`,
              'success'
            )
            this.initTable()
          },
          error => console.log(error));
      }
    })


  }


}