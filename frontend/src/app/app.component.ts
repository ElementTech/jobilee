import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jobilee';
  model: any[] = [];
  hideMenu = false;
  constructor(){
    
  }

  
  ngOnInit() {
    this.model = [
      {
          label: 'Actions',
          items: [
              { label: 'Catalog', icon: 'fa-solid fa-circle-play', routerLink: ['/catalog'] }
          ]
      },
      {
        label: 'Jobs',
        items: [
            {
                label: 'Manage',
                icon: 'fa-solid fa-list-check',
                routerLink: ['/jobs']
            },
            {
                label: 'Create',
                icon: 'fa-solid fa-plug-circle-plus',
                routerLink: ['/jobs/add']
            }
        ]
      },
      {
        label: 'Visualize',
        items: [
            {
                label: 'Components',
                icon: 'fa-solid fa-magnifying-glass-chart',
                routerLink: ['/charts']
            },
            {
                label: 'Dashboards',
                icon: 'fa-solid fa-chart-column',
                routerLink: ['/dashboards']
            },
            {
                label: 'Create',
                icon: 'fa-solid fa-plus',
                items: [
                    {
                        label: 'Component',
                        icon: 'fa-solid fa-magnifying-glass-plus',
                        routerLink: ['/charts/add']
                    },
                    {
                        label: 'Dashboard',
                        icon: 'fa-solid fa-square-poll-vertical',
                        routerLink: ['/dashboards/add']
                    }
                ]
            }
        ]
      },      
      {
                label: 'Integrations',
                items: [
                    {
                        label: 'Manage',
                        icon: 'fa-solid fa-list-ol',
                        routerLink: ['/integrations']
                    },
                    {
                        label: 'Create',
                        icon: 'fa-solid fa-diagram-predecessor',
                        routerLink: ['/integrations/add']
                    }
                ]
      }
  ];

  }

}
