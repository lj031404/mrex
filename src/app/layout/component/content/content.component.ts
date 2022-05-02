import { Component, HostBinding, Input, OnInit } from '@angular/core'

@Component({
	selector: 'app-content',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
	@HostBinding('class.app-content') hostClassName = true
	@Input() noPadding = false
	@Input() customClassName? = ''
	ngOnInit() {
	}

}
