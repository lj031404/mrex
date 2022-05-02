import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';
import { AppLanguage } from '@app-models/language.enum';

@Component({
  selector: 'app-language-change-dlg',
  templateUrl: './language-change-dlg.component.html',
  styleUrls: ['./language-change-dlg.component.scss']
})
export class LanguageChangeDlgComponent implements OnInit {
	AppLanguage = AppLanguage
  language = AppLanguage.English
  
  constructor(
    public dialogRef: MatDialogRef<LanguageChangeDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public settingsMiddleware: UserSettingsMiddlewareService,
  ) { }

  ngOnInit() {
    this.language = this.settingsMiddleware.language as AppLanguage
  }

  switchLanguage(language: AppLanguage) {
    this.language = language
    this.settingsMiddleware.userLanguageSettingEvent.next(this.language)
    this.settingsMiddleware.language = this.language
    this.dialogRef.close()
  }

}
