import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeComponent } from './college/college.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from '@app/shared/components/buttons/buttons.module';
import { LayoutModule } from '@app/layout/layout.module';
import { CollegeRoutingModule } from './college-routing.module';
import { CourseCardComponent } from './components/course-card/course-card.component';

@NgModule({
  declarations: [CollegeComponent, CourseCardComponent],
  imports: [
	CommonModule,
	CollegeRoutingModule,
	LayoutModule,
	ButtonsModule,
	TranslateModule
  ]
})
export class CollegeModule { }
