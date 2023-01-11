import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jobilee';

  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
          label:'Jobs',
          icon:'pi pi-fw pi-play',
          items:[
              {
                  label:'List',
                  icon:'pi pi-fw pi-list',
                  routerLink: 'integrations'
              },
              {
                  separator:true
              },
              {
                  label:'Create',
                  icon:'pi pi-fw pi-plus',
                  routerLink: 'add'
              }
          ]
      },
      {
        label:'Integrations',
        icon:'pi pi-fw pi-cog',
        items:[
            {
                label:'List',
                icon:'pi pi-fw pi-list',
                routerLink: 'integrations'
            },
            {
                separator:true
            },
            {
                label:'Create',
                icon:'pi pi-fw pi-plus',
                routerLink: 'add'
            }
        ]
      }
  ];
  }

}
