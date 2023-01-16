import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, NavigationEnd, NavigationStart, PRIMARY_OUTLET, Router, RouterEvent, UrlSegment, UrlSegmentGroup, UrlTree} from '@angular/router';
import {filter, skipWhile, take} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  readonly home = {icon: 'pi pi-home', url: 'home'};
  menuItems: MenuItem[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menuItems = []
        this.menuItems = [...this.menuItems]
        const tree: UrlTree = this.router.parseUrl(this.router.url);
        const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
        const s: UrlSegment[] = g.segments;
      
        s.forEach(element => {
          this.menuItems.push({label:element.path,url:"#/" +((this.menuItems.length > 0 ? this.menuItems[this.menuItems.length-1].url : "") +"/"+element.path)})
          this.menuItems = [...this.menuItems]
        });
      
      });
  
  }


}
