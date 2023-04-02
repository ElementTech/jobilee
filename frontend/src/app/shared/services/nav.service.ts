import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      headTitle1: "Actions",
    },
    { path: "/catalog", icon: "job-search", title: "Catalog", type: "link", bookmark: true },
    {
      headTitle1: "Manage",
    },    
    {
      title: "Jobs",
      icon: "others",
      type: "sub",
      // badgeType: "light-primary",
      // badgeValue: "2",
      active: true,
      children: [
        { path: "/jobs/create", title: "Create Job", type: "link" },
        { path: "/jobs/manage", title: "Manage Jobs", type: "link" },
        // { path: "/simple-page/first-page", title: "First Page", type: "link" },
        // { path: "/simple-page/second-page", title: "Second Page", type: "link" },
      ],
    },
    {
      title: "Integrations",
      icon: "builders",
      type: "sub",
      active: true,
      children: [
        { path: "/integrations/create", title: "Create Integration", type: "link" },
        { path: "/integrations/manage", title: "Manage Integrations", type: "link" },
      ],
    },    
    // {
    //   title: "Charts",
    //   icon: "charts",
    //   type: "sub",
    //   active: true,
    //   children: [
    //     { path: "/charts/create", title: "Create Chart", type: "link" },
    //     { path: "/charts/manage", title: "Manage Charts", type: "link" },
    //   ],
    // },   
    // {
    //   title: "Dashboards",
    //   icon: "widget",
    //   type: "sub",
    //   active: true,
    //   children: [
    //     { path: "/dashboards/create", title: "Create Dashboard", type: "link" },
    //     { path: "/dashboards/manage", title: "Manage Dashboards", type: "link" },
    //   ],
    // }
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}


// this.model = [
//   {
//       label: 'Actions',
//       items: [
//           { label: 'Catalog', icon: 'fa-solid fa-circle-play', routerLink: ['/catalog'] }
//       ]
//   },
//   {
//     label: 'Jobs',
//     items: [
//         {
//             label: 'Manage',
//             icon: 'fa-solid fa-list-check',
//             routerLink: ['/jobs']
//         },
//         {
//             label: 'Create',
//             icon: 'fa-solid fa-plug-circle-plus',
//             routerLink: ['/jobs/create']
//         }
//     ]
//   },
//   {
//     label: 'Visualize',
//     items: [
//         {
//             label: 'Components',
//             icon: 'fa-solid fa-magnifying-glass-chart',
//             routerLink: ['/charts']
//         },
//         {
//             label: 'Dashboards',
//             icon: 'fa-solid fa-chart-column',
//             routerLink: ['/dashboards']
//         },
//         {
//             label: 'Create',
//             icon: 'fa-solid fa-plus',
//             items: [
//                 {
//                     label: 'Component',
//                     icon: 'fa-solid fa-magnifying-glass-plus',
//                     routerLink: ['/charts/create']
//                 },
//                 {
//                     label: 'Dashboard',
//                     icon: 'fa-solid fa-square-poll-vertical',
//                     routerLink: ['/dashboards/create']
//                 }
//             ]
//         }
//     ]
//   },      
//   {
//             label: 'Integrations',
//             items: [
//                 {
//                     label: 'Manage',
//                     icon: 'fa-solid fa-list-ol',
//                     routerLink: ['/integrations']
//                 },
//                 {
//                     label: 'Create',
//                     icon: 'fa-solid fa-diagram-predecessor',
//                     routerLink: ['/integrations/create']
//                 }
//             ]
//   }
// ];