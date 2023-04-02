import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public config = {
    settings: {
      layout: 'Dubai',
      layout_type: 'ltr',
      layout_version: 'light-only',
      sidebar_type: 'default-sidebar',
      icon: 'fill-svg'
    },
    color: {
      primary_color: '#7366ff', 
      secondary_color: '#f73164'
    }
  }

  constructor() { 
    if(this.config.settings.layout_type == 'rtl')
      document.getElementsByTagName('html')[0].setAttribute('dir', this.config.settings.layout_type);

    document.documentElement.style.setProperty('--theme-default', this.config.color.primary_color);
    document.documentElement.style.setProperty('--theme-secondary', this.config.color.secondary_color);

  }


}
