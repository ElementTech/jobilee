import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowOptions]'
})
export class ShowOptionsDirective {

  public options = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }
  
  @HostListener('click')
  public openOptions() {
    this.options = !this.options;
  }

  setStyle() {
    this.options = (this.options === true) ? false : true;
    if (this.options) {
      this.renderer.setStyle(this.elRef.nativeElement, 'width', '230px');
    } else {
      this.renderer.setStyle(this.elRef.nativeElement, 'width', '35px');
    }
  }
  
}
