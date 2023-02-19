import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import JSONEditor from 'jsoneditor'
import { SelectItem } from 'primeng/api';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  
export function getStringBeforeSubstring(str: string, substring: string): string | undefined {
  if (str !== undefined){
    const index = str.indexOf(substring);
    if (index === -1) {
        return undefined;
    }
    return str.slice(0, index);
  }
}

export function getStringAfterSubstring(str: string, substring: string): string | undefined {
  if (str !== undefined){
    const index = str.indexOf(substring);
    if (index === -1) {
        return undefined;
    }
    return str.slice(index + substring.length);
  }
}

export function toSelectItem(arr: Array<string>) {
  return (arr||[]).map((item) => ({ label: item, value: item } as SelectItem));
}