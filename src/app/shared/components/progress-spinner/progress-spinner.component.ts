import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
// Reference: https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons
export class ProgressSpinnerComponent implements OnInit {
  @Input() enabled = false
  @Input() align: string

  constructor() { }

  ngOnInit() {
  }

}
