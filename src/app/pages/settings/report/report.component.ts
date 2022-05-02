import { TabsStatesService } from './../../../shared/services/tabs-states.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService, UserCommentBody } from '@app/api_generated';
import { take } from 'rxjs/operators';
import { LayoutService } from '@app/layout/service/layout.service';
import { ConfirmationComponent } from '@app/shared/components/confirmation/confirmation.component';
import { _translate } from '@app/core/utils/translate.util';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { noWhitespaceValidator } from '@app-core/validators/custom.validator';
import { RouterMap } from '@app/core/utils/router-map.util';
import { filter } from 'rxjs/operators';
import { version, branch } from '../../../../app/git-version.json'
import { UserCommentType } from '@app/api_generated/model/userCommentType';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
	ReportType = UserCommentType
	isLoading = false
	error: string
	isSent: boolean

	formGroup: FormGroup

	constructor(
		private fb: FormBuilder,
		private commentsService: CommentsService,
		private layoutService: LayoutService,
		private router: Router,
		private translate: TranslateService,
		private tabsStatesService: TabsStatesService
	) {
		// Route leave subscriptions
		this.tabsStatesService.leave$.pipe(filter(url => url === `/${RouterMap.Settings.path}/${RouterMap.Settings.REPORT}`)).subscribe(url => {
			this.isSent = false
			this.formGroup.patchValue({
				type: '',
				subject: '',
				message: '',
			})
		})
	}

	ngOnInit() {
		this.initForm()
	}

	onFormGroupSubmit() {
		this.sendMessage(this.formGroup.value)
	}

	initForm() {
		this.formGroup = this.fb.group({
			type: ['', Validators.required],
			subject: ['', [Validators.required, noWhitespaceValidator]],
			message: ['', [Validators.required, noWhitespaceValidator]]
		})

	}

	sendMessage(value: { subject: string; message: string, type: UserCommentType }) {
		console.log(value)
		this.isLoading = true
		this.error = null
		const userComment: UserCommentBody = {
			subject: value.subject,
			message: value.message,
			type: value.type,
			version,
			branch
		}
		this.commentsService.sendComment(userComment)
			.pipe(take(1))
			.subscribe(() => {
				this.isLoading = false
				this.isSent = true
				this.layoutService.openModal(ConfirmationComponent, {
					icon: '<i class="fa fa-check"></i>',
					title: this.translate.instant('page.settings.report.title.sent'),
					text: this.translate.instant('page.settings.report.sent'),
					onConfirmClick: this.goto()
				})
			}, err => {
				this.isLoading = false
				this.isSent = true
				this.error = this.translate.instant('error.genericMessage')
				console.error(err)
			})
	}

	goto() {
		this.router.navigate(['/settings'])
	}
}
