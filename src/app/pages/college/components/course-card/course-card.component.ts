import { Component, OnInit, Input } from '@angular/core';
import { CourseCard } from '@app/core/models/course.interface';

@Component({
	selector: 'app-course-card',
	templateUrl: './course-card.component.html',
	styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
	@Input() course: CourseCard
	constructor() { }

	ngOnInit() {
	}

}
