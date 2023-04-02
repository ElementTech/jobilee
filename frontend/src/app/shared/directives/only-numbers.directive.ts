import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
  @HostBinding('autocomplete') public autocomplete;

  constructor() {
    this.autocomplete = 'off';
  }

  @HostListener('keypress', ['$event']) public disableKeys(e) {
    document.all ? e.keyCode : e.keyCode;
    return (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57));
  }
}
