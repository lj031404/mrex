import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-steps',
  templateUrl: './header-steps.component.html',
  styleUrls: ['./header-steps.component.scss']
})
export class HeaderStepsComponent implements OnInit {

  @Input() step: number
  @Input() total: number

  steps

  constructor() { }

  ngOnInit() {
	this.steps = Array(this.total)
  }

}
