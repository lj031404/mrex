import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PromptChoice } from '@app-models/prompt-choice.interface';
import { CordovaEventService } from '@app/core/services/cordova-event.service';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

export interface DialogData {
	title: string
	leases: any
	dialogBtn: PromptChoice[]
}


@Component({
  selector: 'app-lease-date-apply-dlg',
  templateUrl: './lease-date-apply-dlg.component.html',
  styleUrls: ['./lease-date-apply-dlg.component.scss']
})
export class LeaseDateApplyDlgComponent implements OnInit {
  btnProperties: any
	btnOkContent: string
	btnCancelContent: string
	ngBtnOk: string
  ngBtnCancel: string
  leases = [];
  subScription: Subscription = new Subscription()

  constructor(
    public dialogRef: MatDialogRef<LeaseDateApplyDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cordovaEventService: CordovaEventService
  ) {
    this.subScription.add(
      this.cordovaEventService.cordovaEvent.subscribe((evento: CordovaEvent) => {
        if (evento == CordovaEvent.BackButton) {
          this.onCancel()
        }
      })
    )
  }

  ngOnInit() {
    this.btnProperties = this.data.dialogBtn
		this.btnOkContent = this.btnProperties[0].label
		this.ngBtnOk = this.btnProperties[0].class
		if (Object.keys(this.btnProperties).length > 1) {
			this.btnCancelContent = this.btnProperties[1].label
			this.ngBtnCancel = this.btnProperties[1].class
		}
    this.leases = _.cloneDeep(this.data.leases)

    history.pushState({
			modal: true
		}, null)
  }

  onCancel(): void {
		this.dialogRef.close()
  }
  
  applyDate() {
    this.dialogRef.close(this.leases)
  }

  leaseChange(lease) {
    lease.state = !lease.state;
  }

  ngOnDestroy() {
		if (window.history.state.modal) {
			history.back()
		}
		this.subScription.unsubscribe()
	}

}
