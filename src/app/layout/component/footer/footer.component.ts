import { Component, HostBinding, OnInit } from '@angular/core'

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
	@HostBinding('class.app-footer') hostClassName = true

	ngOnInit() {
	}

}
