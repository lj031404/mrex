import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '@app/core/services/i18n.service';
import moment from 'moment';
import 'moment-locale-fr';

@Pipe({
	name: 'dateLang'
})
export class DateLangPipe implements PipeTransform {

	constructor(
		private i18nService: I18nService
	) {}

	transform(value: any, ...args: any[]): any {
		const current = this.i18nService.language
		return current === 'en-US' ? moment(value).locale('en').format('MMMM Do YYYY') : moment(value).locale('fr').format('Do MMMM YYYY')
	}

}
