import { Pipe, ChangeDetectorRef, PipeTransform } from '@angular/core';
import { parse, distanceInWordsToNow } from 'date-fns';
import * as frLocale from 'date-fns/locale/fr'
import * as enLocale from 'date-fns/locale/en'
import { AsyncPipe } from '@angular/common';
import { timer, Observable } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { TranslateService } from '@ngx-translate/core';

const ONE_DAY = 86400
@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {

    private time: Date

    constructor(
        private translate: TranslateService,
        private settingsMiddleware: UserSettingsMiddlewareService,
        ) {
    }

    transform(input: any, args?: any): any {
        this.time = parse(input)
        let now = new Date().getTime();

        let delta = (now - this.time.getTime()) / 1000;

        if (delta < ONE_DAY / 2) {
            return this.translate.instant('time_ago.just_now');
        } 
        else if (delta < ONE_DAY) {
            return this.translate.instant('time_ago.today');
        }
        else if (delta < ONE_DAY * 2) {
            return this.translate.instant('time_ago.yesterday')
        }
        else {
            return distanceInWordsToNow(this.time, { addSuffix: true, includeSeconds: true, locale: this.settingsMiddleware.language === 'fr-CA' ? frLocale : enLocale});
        }
	}
}
