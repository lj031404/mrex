import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @Input() Cwidth;
  @Input() Cheight;
  @Input() circle: boolean
  constructor() { }

  ngOnInit() {
  }

  getMyStyles() {
    const myStyles = {
      'width': this.Cwidth ? this.Cwidth : '',
      'height.px': this.Cheight ?  this.Cheight : '',
      'border-radius': this.circle ? '50%' : ''
    }

    return myStyles;
  }

}
