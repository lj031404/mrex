import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notice-of-interest-button',
  templateUrl: './notice-of-interest-button.component.html',
  styleUrls: ['./notice-of-interest-button.component.scss']
})
export class NoticeOfInterestButtonComponent implements OnInit {

  @Input() onClick: Function
  @Input() enabled: boolean

  constructor() { }

  ngOnInit() {
  }

}
