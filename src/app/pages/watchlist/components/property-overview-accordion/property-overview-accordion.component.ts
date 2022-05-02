import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-property-overview-accordion',
  templateUrl: './property-overview-accordion.component.html',
  styleUrls: ['./property-overview-accordion.component.scss']
})
export class PropertyOverviewAccordionComponent implements OnInit {
  @Input() label
  @Input() value
  @Input() precision
  @Input() unit
  @Input() tooltip
  @Input() sub ? = []

  format: string

  expanded = false

  get isNumber() {
    return typeof this.value === 'number'
  }

  constructor() { }

  ngOnInit() {
	this.format = this.precision ? `1.${this.precision}-${this.precision}` : '1.0-0'
  }

}
