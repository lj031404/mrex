import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { CordovaEventService } from '@app/core/services/cordova-event.service';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import { environment } from '@env/environment';

@Component({
  selector: 'app-switch-api-dlg',
  templateUrl: './switch-api-dlg.component.html',
  styleUrls: ['./switch-api-dlg.component.scss']
})
export class SwitchApiDlgComponent implements OnInit {
  sub: Subscription = new Subscription()
  currentAPI = 'qa'
  apiOptions = [
    { id: 'qa', label: 'QA API' },
    { id: 'prod', label: 'PROD API' }
  ]
  constructor(
    public dialogRef: MatDialogRef<SwitchApiDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cordovaEventService: CordovaEventService
  ) {
    this.sub.add(
      this.cordovaEventService.cordovaEvent.subscribe((evento: CordovaEvent) => {
        if (evento == CordovaEvent.BackButton) {
          this.onCancel()
        }
      })
    )
  }

  ngOnInit() {
    const savedApiServer = localStorage.getItem('apiServer')
    this.currentAPI = savedApiServer ? savedApiServer : environment.serverUrl.includes('qa') ? 'qa' : 'prod'
  }

  onCancel(): void {
		this.dialogRef.close()
  }

  onOk() {
    this.dialogRef.close(this.currentAPI)
  }
}
