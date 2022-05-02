import { Component, OnInit, Input } from '@angular/core';
import { Indicator } from '../../property-compare.component';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {
  @Input() indicator: Indicator

  diff: number

  constructor() { }

  ngOnInit() {
	  this.diff = Math.abs(this.indicator.diff)
  }

  isNumber(value) {
    return Number.isFinite(+value)
  }

}
