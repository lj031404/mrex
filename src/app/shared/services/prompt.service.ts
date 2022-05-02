import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map, delay } from 'rxjs/operators'
import { from } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'

import { PromptDialogComponent } from '../components/prompt-dialog/prompt-dialog.component'
import { PromptChoice } from '../../core/models/prompt-choice.interface'

@Injectable({
	providedIn: 'root'
})
export class PromptService {

	clickedBtn: string
	constructor(public dialog: MatDialog) { }

	prompt(title: string, message: any, dialogBtn: PromptChoice[], disableClose = false): Observable<any> {
		const dialogRef = this.dialog.open(PromptDialogComponent, {
			disableClose,
			data: { title, message, dialogBtn }
		});

		return from(dialogRef.afterClosed()).pipe(
			delay(100), // time for the animation to close the prompt
			map(res => res === true ? 'yes' : 'no')
		)

	}
}
