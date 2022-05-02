import { Component, Input, OnInit} from '@angular/core'
import { Observable } from 'rxjs';

@Component({
	selector: 'app-expansion-panel',
	templateUrl: './expansion-panel.component.html',
	styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
	@Input() expanded = false
	@Input() disabled = false
	@Input() togglable = true

	@Input() expandEvents: Observable<boolean>

	constructor() {
	}

	ngOnInit() {
		if(this.expandEvents){
			this.expandEvents.subscribe((val) =>{
				this.expanded = val
			});
		}
	}

	toggle() {
		if (!this.disabled && this.togglable) {
			this.expanded = !this.expanded;
		}
	}

}
