import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jobilee';

  model: any[] = [];
  constructor(){
    
  }

  ngOnInit() {
    this.model = [
      {
          label: 'Actions',
          items: [
              { label: 'Run', icon: 'pi pi-fw pi-play', routerLink: ['/run'] }
          ]
      },
      {
        label: 'Job',
        items: [
            {
              label: 'Jobs',
              icon: 'pi pi-fw pi-cog',
              items: [
                  {
                      label: 'List',
                      icon: 'pi pi-fw pi-list',
                      routerLink: ['/jobs']
                  },
                  {
                      label: 'Add',
                      icon: 'pi pi-fw pi-plus',
                      routerLink: ['/jobs/add']
                  }
              ]
            }
        ]
      },
      {
          label: 'Settings',
          items: [
              {
                label: 'Integrations',
                icon: 'pi pi-fw pi-share-alt',
                items: [
                    {
                        label: 'List',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/integrations']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/integrations/add']
                    }
                ]
              }
          ]
      }
  ];

  }

}
