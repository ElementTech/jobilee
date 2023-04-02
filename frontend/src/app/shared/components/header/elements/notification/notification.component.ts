import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public openNotification: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

}
