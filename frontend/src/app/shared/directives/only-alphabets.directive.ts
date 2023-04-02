import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyAlphabets]'
})
export class OnlyAlphabetsDirective {
  @HostBinding('autocomplete') public autocomplete;

  constructor() {
    this.autocomplete = 'off';
  }

  @HostListener('keypress', ['$event']) public disableKeys(e) {
    document.all ? e.keyCode : e.keyCode;
    return (e.keyCode === 8 || (e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 65 && e.keyCode <= 90));
  }
}
