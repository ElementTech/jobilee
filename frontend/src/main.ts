import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SelectItem } from 'primeng/api';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

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

export function ensureVarIsSet(item, timeout=10000) {
  console.log(item)
  var start = Date.now();
  return new Promise(waitForVar); // set the promise object within the ensureVarIsSet object

  // waitForVar makes the decision whether the condition is met
  // or not met or the timeout has been exceeded which means
  // this promise will be rejected
  function waitForVar(resolve, reject) {
      if (item)
          resolve(item as any);
      else if (timeout && (Date.now() - start) >= timeout)
          reject(new Error("timeout"));
      else
          setTimeout(waitForVar.bind(this, resolve, reject), 30);
  }
}