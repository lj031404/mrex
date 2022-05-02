import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { PromptChoice } from '@app-models/prompt-choice.interface';
import { ModalRef } from '@app/core/models/modal-ref';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import { CordovaEventService } from '@app-services/cordova-event.service';
import { Subscription } from 'rxjs';

export interface DialogData {
	title: string
	message: any
	dialogBtn: PromptChoice[]
}

@Component({
	selector: 'app-prompt-dialog',
	templateUrl: './prompt-dialog.component.html',
	styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit, OnDestroy {

	btnProperties: any
	btnOkContent: string
	btnCancelContent: string
	ngBtnOk: string
	ngBtnCancel: string
	subScription: Subscription = new Subscription()
	constructor(
		public dialogRef: MatDialogRef<PromptDialogComponent>,
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

		history.pushState({
			modal: true
		}, null)
	}

	onCancel(): void {
		this.dialogRef.close()
	}

	ngOnDestroy() {
		if (window.history.state.modal) {
			history.back()
		}
		this.subScription.unsubscribe()
	}
}
