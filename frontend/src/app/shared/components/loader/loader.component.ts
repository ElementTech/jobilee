import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public show: boolean = false;

  constructor() {
    // setTimeout(() => {
    //   this.show = false;
    // }, 3000);
  }

  ngOnInit() { }

  ngOnDestroy() { }

}
