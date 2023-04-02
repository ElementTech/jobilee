import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  public openMessageBox: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMessageBox() {
    this.openMessageBox = !this.openMessageBox;
  }

}
