import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-steps',
  templateUrl: './header-steps.component.html',
  styleUrls: ['./header-steps.component.scss']
})
export class HeaderStepsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', {static: false}) headerContent: ElementRef

  @Input() step: number
  @Input() total: number

  steps

  constructor(private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit() {
	  this.steps = Array(this.total)
  }

  get headerWidth() {
    return this.headerContent && this.headerContent.nativeElement.offsetWidth
  }

  back(step: number) {
    if (step < this.step) {
      this.router.navigate([], {
        queryParams: {
          step
        },
        queryParamsHandling: 'merge'
      })
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges()
  }
}
