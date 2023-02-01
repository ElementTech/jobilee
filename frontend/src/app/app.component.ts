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
              { label: 'Catalog', icon: 'pi pi-fw pi-play', routerLink: ['/catalog'] }
          ]
      },
      {
        label: 'Jobs',
        items: [
            {
                label: 'List',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/jobs']
            },
            {
                label: 'Add',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/jobs/add']
            }
        ]
      },
      {
                label: 'Integrations',
                items: [
                    {
                        label: 'List',
                        icon: 'pi pi-fw pi-share-alt',
                        routerLink: ['/integrations']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/integrations/add']
                    }
                ]
      }
  ];

  }

}
