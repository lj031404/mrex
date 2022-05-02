import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

import { ModalRef } from '@app-models/modal-ref'
import { PropertyFormConfig } from '@app/helper/property-form-config'
import { LayoutService } from '@app/layout/service/layout.service'
import { _translate } from '@app/core/utils/translate.util'
import { StepperComponent } from '@app/shared/components/stepper/stepper/stepper.component';
import { takeWhile, take, debounceTime } from 'rxjs/operators'
import { PromptService } from '@app/shared/services/prompt.service'
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';
import { CordovaEventService } from '@app-services/cordova-event.service';
import { GlobalService } from '@app/core/services/global.service';
import { Location } from '@angular/common';
import { SpinnerService } from '@app/shared/services/spinner.service'
import { PropertiesService } from '@app/core/localDB/properties.service'

@Component({
	selector: 'app-property-add',
	templateUrl: './property-add.component.html',
	styleUrls: ['./property-add.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyAddComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	@Input() modalRef: ModalRef
	@Input() data: any
	@Input() config: PropertyFormConfig
	@Output() complete: EventEmitter<any>

	propertyAddForm: FormGroup
	propertyId: string
	hypothesisId: string
	step = 0

	isBaseModel: boolean

	initialRentIncreaseRates: number[]
	sub: Subscription = new Subscription()
	@ViewChild('stepper', { static: true }) stepper: StepperComponent
	@ViewChild('modalContent', { static: true }) modalContent: ElementRef
	mobileOperators = [
		'Windows Phone',
		'Android',
		'iOS'
	]
	constructor(
		private fb: FormBuilder,
		private layoutService: LayoutService,
		private translate: TranslateService,
		private promptService: PromptService,
		private cd: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private cordovaEventService:CordovaEventService,
		private globalService: GlobalService,
		private location: Location,
		private spinnerService: SpinnerService,
		public propertiesService: PropertiesService
	) {
		this.config = new PropertyFormConfig()
	}

	ngOnInit() {
		this.actionForBackBtn()
		this.propertyId = this.config.property.id
		this.hypothesisId = this.config.property.hypothesisId
		this.propertyAddForm = this.fb.group({})

		this.stepper.changed$.pipe(takeWhile(() => Boolean(this.propertyAddForm))).subscribe((step) => {
			this.router.navigate([], {
				queryParams: {
					step
				},
				// replaceUrl: true 		// do not save to history the new state
			} )
			this.modalContent.nativeElement.scrollTo(0, 0)
		})

		// show a popup to the user that he can't choose other bank than SCHL on master model
		this.canChooseAnyBank()

		this.isBaseModel = !this.config.property.parent
		

	}

	actionForBackBtn() {
		const os = this.globalService.getMobileOperatingSystem()
		if (this.mobileOperators.includes('Android')) {
			this.sub.add(
				this.route.queryParams.pipe(
					debounceTime(500)
				).subscribe((params) => {
					const newStep = +params['step']
					if (newStep < this.step) {
						this.stepper.prev()
					} else if(newStep > this.step) {
						this.stepper.next()
					} 
	
					if (!params.hasOwnProperty('step')) {
						this.modalRef.closeModal()
					}
				})
			)
		} else {

			this.sub.add(
				this.cordovaEventService.cordovaEvent.subscribe((evento: CordovaEvent) => {
					
					if (evento == CordovaEvent.BackButton) {
						if (this.step > 0) {
							this.stepper.prev()
						} else {
							this.modalRef.closeModal()
						}
					}
				})
			)
		}
	}

	ngOnChanges() {
		this.sub.unsubscribe()
	}

	async ngOnDestroy() {
		this.sub.unsubscribe()
	}

	ngAfterViewInit() {
		// rent increase initial rates
		this.initialRentIncreaseRates = this.propertyAddForm.getRawValue().cashflow.itemizedRent.items.map(x => x.amount)
	}

	get isMasterModel() {
		return !this.propertyAddForm.getRawValue().property.parent
	}

	disableRefinancingIfMasterModel() {
		if (this.isMasterModel && this.propertyAddForm.getRawValue().cashflow.refinancingParameters.enabled) {
			this.propertyAddForm.get('cashflow.refinancingParameters.enabled').setValue(false)
			this.cd.detectChanges()
		}
	}

	// show a popup to the user that he can't choose other bank than SCHL on master model
	canChooseAnyBank() {
		this.stepper.clicked$.pipe(takeWhile(() => Boolean(this.propertyAddForm))).subscribe((res) => {
			const selectedBankFinancing = this.propertyAddForm.getRawValue().purchase.financingType
			const selectedBankReFinancing = this.propertyAddForm.getRawValue().cashflow.refinancingParameters.refinancingType
			if (this.isMasterModel && (selectedBankFinancing !== 'CHMC' || selectedBankReFinancing !== 'CHMC')) {
				const choices = [
					{key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green'},
					{key: 'no',  label: this.translate.instant('literals.no'),  class: 'btn btn-outline-light'},
				]
				const title = this.translate.instant('helper.property-add.selected-bank-warning.title')
				const message = selectedBankFinancing !== 'CHMC'
					? this.translate.instant('helper.property-add.selected-bank-warning.message.financing')
					: this.translate.instant('helper.property-add.selected-bank-warning.message.refinancing')
				this.promptService.prompt(title, message, choices)
					.pipe(take(1))
					.subscribe(async (answer) => {
						if (answer === 'yes') {
							this.propertyAddForm.get('purchase.financingType').setValue('CHMC')
							this.cd.detectChanges()
						}
					})
			}
		})
	}

	async completePropertyForm() {
		this.validate('cashflow')

		// disable the refinancing checkbox if we're creating a master model
		this.disableRefinancingIfMasterModel()

		await this.canChangeIncreaseRate()

		if (this.propertyAddForm.get('cashflow').valid) {
			if (this.complete) {
				this.propertiesService.addingWatchListData.next(true)
				this.spinnerService.text = this.translate.instant('spinner.calculatingFinancials')
				this.spinnerService.show()

				const formData = this.propertyAddForm.getRawValue()
				formData.property.id = this.propertyId
				formData.property.hypothesisId = this.hypothesisId

				this.complete.emit(formData)

			} else {
				console.error('No complete emitter??')
				this.modalRef.closeModal()
			}
		}

	}

	// show a popup to the user that he can't modify the rent increase rates on master model
	canChangeIncreaseRate(): Promise<any> {
		const _items = this.propertyAddForm.getRawValue().cashflow.itemizedRent.items
		const isRentIncreaseChanged =  _items[0].amount !== this.initialRentIncreaseRates[0]
									|| _items[1].amount !== this.initialRentIncreaseRates[1]
									|| _items[2].amount !== this.initialRentIncreaseRates[2]

		if (this.isMasterModel && isRentIncreaseChanged) {
			const choices = [
				{key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn btn-outline-green'},
				{key: 'no',  label: this.translate.instant('literals.no'),  class: 'btn btn-outline-light'},
			]
			const title   = this.translate.instant('helper.property-add.selected-bank-warning.title')
			const message = this.translate.instant('helper.property-add.rent-increase-warning.message.financing')
			return this.promptService.prompt(title, message, choices).toPromise()
				.then(answer => {
					if (answer === 'yes') {
						const items = this.propertyAddForm.get('cashflow.itemizedRent.items') as FormArray
						items.at(0).get('amount').setValue(this.initialRentIncreaseRates[0])
						items.at(1).get('amount').setValue(this.initialRentIncreaseRates[1])
						items.at(2).get('amount').setValue(this.initialRentIncreaseRates[2])
						this.cd.detectChanges()
					}
				})
			}
			else {
				return Promise.resolve()
			}
	}

	validate(field: string) {
		console.log(`[Property Add Form Validate: ${field}]`, this.propertyAddForm.getRawValue())

		const form = this.propertyAddForm.get(field) as FormGroup

		// array of invalid fields
		const invalids: { fieldname: string, formControl: any }[] = []

		if (form && form.controls) {

			Object.keys(form.controls).forEach(fd => {
				const fc: any = form.get(fd)
				if (fc.invalid) {
					// nested form group
					try {
						if (fc.controls) {
							if (fc.controls.items) {							
								Object.values(Object.values(fc.controls.items.controls)).forEach((fd2, i) => {
									let fc2 = form.get([fd, 'items', i])
									if (fc2.invalid) {
										const name = fc2.value.name
										const fieldname = `watchlist.validation.field.${fd}.${name}`
										console.log(`Invalid field: ${fieldname}`, fc2)
										invalids.push({ fieldname, formControl: fc })
									}

									fc2 = form.get([fd, 'total'])
									if (fc2 && fc2.invalid) {
										const fieldname = `watchlist.validation.field.${fd}.total`
										console.log(`Invalid field: ${fieldname}`, fc2)
										invalids.push({ fieldname, formControl: fc })
									}
								})
							}
							else {
								Object.keys((form.get(fd) as any).controls).forEach(fd2 => {
									const fc2 = form.get([fd, fd2])
									if (fc2.invalid) {
										const fieldname = `watchlist.validation.field.${fd}.${fd2}`
										console.log(`Invalid field: ${fieldname}`, fc2)
										invalids.push({ fieldname, formControl: fc })
									}
								})
							}
						}
						// not nested
						else {
							const fieldname = 'watchlist.validation.field.' + fd
							invalids.push({ fieldname, formControl: fc })
						}					
					}
					catch (err) {
						console.error(err)
					}
				}
			})
		}

		invalids.reverse().forEach(x => {
			this.layoutService.openSnackBar(_translate(this.translate.instant('validation.badField', { fieldname: _translate(this.translate.instant(x.fieldname)) })), null, 3000, 'error', false)

			// mark the invalid fields as touched in order to highlight them
			try {
				let value

				x.formControl.markAsTouched()
				x.formControl.markAsDirty()

				// Ugly walk arround. The field attributes (touched, dirty, etc.) doesn't propagate to nested ngControls!
				// So we need to set the field to the same value to trigger the subscribe
				value = x.formControl.value
				x.formControl.setValue(value)

				x.formControl.controls[x.fieldname.split('.').splice(-1)[0]].markAsTouched()
				x.formControl.controls[x.fieldname.split('.').splice(-1)[0]].markAsDirty()

				// Ugly walk arround. The field attributes (touched, dirty, etc.) doesn't propagate to nested ngControls!
				// So we need to set the field to the same value to trigger the subscribe
				value = x.formControl.controls[x.fieldname.split('.').splice(-1)[0]].value				
				x.formControl.controls[x.fieldname.split('.').splice(-1)[0]].setValue(value)
			}
			catch (err) {
			}
		})
	}

}
