import { Component, OnInit, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { SignUpError } from '@app-core/models/signup-err.interface';
import { AppLanguage, AppLanguageCode } from '@app-models/language.enum';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { TranslateService } from '@ngx-translate/core'
@Component({
	selector: 'app-step1',
	templateUrl: './step1.component.html',
	styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
	AppLanguage = AppLanguage
	AppLanguageCode = AppLanguageCode
	selectValues = [...Array(100).keys()].filter(x => x >= 16)

	@Input() form: FormGroup
	@Input() step: number
	@Input() error_messages: SignUpError

	constructor(
		private translateService: TranslateService,
	) { }

	ngOnInit() {
	}

	onLanguageChange(event: Event) {
		if (event.type === 'change') {
			const language = (event.target as HTMLSelectElement).value as AppLanguageCode
			const lng = language === AppLanguageCode.English ? AppLanguage.English : AppLanguage.French_CA
			this.translateService.use(lng)
		}
	}
}
