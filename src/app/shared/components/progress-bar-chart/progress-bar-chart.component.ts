import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar-chart',
  templateUrl: './progress-bar-chart.component.html',
  styleUrls: ['./progress-bar-chart.component.scss']
})
export class ProgressBarChartComponent implements OnInit, OnChanges {
  @Input() data = []
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(data) {
  }

}
