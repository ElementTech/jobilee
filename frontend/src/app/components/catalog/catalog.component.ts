import { Observable } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Job } from "src/app/shared/data/job/job";
import { Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { Paginator } from "primeng/paginator";
import { orderBy } from 'lodash';
import { PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';


@Pipe({
  name: "orderBy"
 })
 export class OrderByPipe implements PipeTransform {
  transform(array: any, sortBy: string, order?: string): any[] {
  const sortOrder = order ? order : 'asc'; // setting default ascending order
 
   return orderBy(array, [sortBy], [sortOrder]);
   }
 }
@Component({
  selector: "app-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
})
export class CatalogComponent implements OnInit {
  jobs: any;
  loading: boolean = true;
  search= "";
  sortOrder: number;
  public isFilter: boolean = false;
  public isLocation: boolean = false;
  public isJob_Title: boolean = false;
  public isIndustry: boolean = false;
  public isSpecific_skills: boolean = false;
  sortField: string;
  page = 1;
  sortOptions: SelectItem[];
  jobsPaginated: any;
  AllJobs: any;
  integrations: any[];
  integrationIcons: any = {};
  constructor(private dbService: DBService, private router: Router) { }
  @ViewChild("paginator", { static: true }) paginator: Paginator;

  pageSize = 20;
  ngOnInit(): void {
    this.reloadData();
    this.sortOptions = [
      { label: "Integration: A - Z", value: "integration" },
      { label: "Integration: Z - A", value: "!integration" },
      { label: "Name: A - Z", value: "name" },
      { label: "Name: Z - A", value: "!name" },
    ];
  }

  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    useBothWheelAxes : false
  };

  public configBothSideScroll : PerfectScrollbarConfigInterface ={
    suppressScrollX: false,
  }
  
  public configX: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY:true,
  };

  public configY: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    suppressScrollY:false,
  };
  reloadData() {
    this.dbService.getJobsCatalog().subscribe((data) => {
      this.AllJobs = data;
      this.jobs = data;
      this.paginate()
      this.integrations = this.countIntegrations(this.jobs);
      // setTimeout(() => {
      //   this.paginator?.changePage(0);
      // });
    });
    this.loading = false;
    this.dbService.getObjectList("integrations").subscribe((data) => {
      data.forEach((element) => {
        this.integrationIcons[element.name] = {
          icon: element.icon,
          checked: true,
        };
      });
    });
  }
  clear()
  {
    this.search = '';
    Object.entries(this.integrationIcons).forEach(([key, val]) => this.integrationIcons[key]["checked"] = true);
    this.filter();
  }

  countIntegrations(arr) {
    const integrationCounts = {};

    arr.forEach(function (dict) {
      const integration = dict.integration;

      if (!integrationCounts[integration]) {
        integrationCounts[integration] = 1;
      } else {
        integrationCounts[integration]++;
      }
    });

    const result = [];

    Object.keys(integrationCounts).forEach(function (key) {
      result.push({
        integration: key,
        count: integrationCounts[key],
      });
    });
    Object.keys(this.integrationIcons).forEach(function (key) {
      if (!(key in integrationCounts))
      {
        result.push({integration:key,count:0})
      }
    });
    return result;
  }

  filter() {
    this.jobs = this.AllJobs.filter((item) =>
      item.name.toLowerCase().includes(this.search.toLowerCase()) && this.integrationIcons[item.integration]?.checked
    );
    this.paginate();
  }
  editJob(_id: string) {
    this.router.navigate(["jobs/update", _id]);
  }
  jobHistory(_id: string) {
    this.router.navigate(["jobs/history", _id]);
  }
  runJob(_id: string) {
    this.router.navigate(["jobs/run", _id]);
  }
  paginate() {
    this.jobsPaginated = this.jobs.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
    this.integrations = this.countIntegrations(this.jobs)
  }

  
  onSortChange(event) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
