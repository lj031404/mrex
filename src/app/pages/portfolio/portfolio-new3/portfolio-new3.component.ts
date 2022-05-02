import { Component, OnDestroy, OnInit, ViewChild, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Location } from '@angular/common'

import { FormArray, FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { PortfolioConfig } from '@app/helper/configs/portfolio.info-config';
import { PropertyFormHelper } from '@app/helper/property-form-helper';

import { catchError, flatMap, map, switchMap, take, takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { PropertyType } from '@app-models/property.interface'
import { ReceiveOfferStatusType, Portfolio } from '@app-models/portfolio.interface'

import { LayoutService } from '@app/layout/service/layout.service'
import { _translate } from '@app/core/utils/translate.util'
import { PortfolioLocalService } from '@app/core/localDB/portfolio.service'
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@app/shared/services/prompt.service';
import { PromptChoice } from '@app/core/models/prompt-choice.interface'
import { SpinnerService } from '@app/shared/services/spinner.service';
import { of, Subscription, throwError } from 'rxjs';
import { ActionDrawerComponent } from '@app/layout/component/action-drawer/action-drawer.component'
import { ActionDrawerOutletComponent } from '@app/layout/component/action-drawer-outlet/action-drawer-outlet.component'
import { PortfolioService as ApiPortfolioService, PortfolioService } from '@app/api_generated/api/portfolio.service'
import { PropertiesMiddlewareService } from '@app/api-middleware/properties-middleware.service'
import { PropertySearchDrawerEvent } from '@app-models/property-search.interface'
import { Currency, Lease } from '@app/api_generated';
import { PortfolioFormConfig } from '@app/helper/portfolio-form-config';
import { PortfolioFormConfigAdapter } from '@app/helper/adapters/portfolio-form-config.adapter';
import { DropdownChoice } from '@app/helper/configs/property-itemize-config';
import { LoanTypeEnum } from '@app/core/models/property-add.constants';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { LeaseDateApplyDlgComponent } from '../components/lease-date-apply-dlg/lease-date-apply-dlg.component';
import moment from 'moment'
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service'
import { AssistanceService } from '@app/api_generated/api/assistance.service'
import { UserAssistanceRequestType } from '@app/api_generated/model/userAssistanceRequestType'
import { HttpErrorResponse } from '@angular/common/http';
import { AddUnregisterPropertyDlgComponent } from '../../../helper/add-unregister-property-dlg/add-unregister-property-dlg.component';
import { RouterMap } from '@app/core/utils/router-map.util';
import { UnregisterTypes } from '@app/core/models/unregister.interface';
import { PropertiesService } from '@app/api_generated/api/properties.service'
import { EventType } from '@app/api_generated/model/eventType';
import { Event } from '@app/api_generated/model/event';
import * as lodash from 'lodash'
import { yearValidation } from '@app-core/validators/custom.validator';

@Component({
	selector: 'app-portfolio-new3',
	templateUrl: './portfolio-new3.component.html',
	styleUrls: ['./portfolio-new3.component.scss']
})
export class PortfolioNew3Component implements OnInit {
	step = 1
	@ViewChild('mainDrawer', { static: true }) mainDrawer: ActionDrawerComponent
	@ViewChild('propertySearchDrawerWrapper', { static: true }) propertySearchDrawer: ActionDrawerComponent
	@ViewChild('drawerOutlet', { static: true }) drawerOutlet: ActionDrawerOutletComponent

	activePropertySearchDrawer = false

	portfolioId: string
	propertyId: string

	PortfolioMap = RouterMap.Portfolio

	PropertyType = PropertyType
	propertyOptionKeys = Object.keys(PropertyType)
	ReceivePurchaseToOfferTypes = ReceiveOfferStatusType
	ReceivePurchaseToOfferKeys = Object.keys(ReceiveOfferStatusType)

	form: FormGroup
	itemizeUnitsCheck = false
	_residentialUnits: any = null
	itemizeUnitsArray: FormArray
	_financingType = 'CHMC'
	incomesCheck: boolean
	PropertyFormHelper = PropertyFormHelper
	financingType: AbstractControl

	public inclusions = [
		'internet',
		'furnished',
		'heating',
		'firstMonthFree',
		'lighting',
		'parking'
	]

	// Secondary financing section
	enabled = false
	secondFinancingType: string
	monthlyPayments = 0

	featureName: string

	showAmortization = true

	termValues = [
		{ value: 1, label: 'literals.1year' },
		{ value: 2, label: 'literals.2years' },
		{ value: 3, label: 'literals.3years' },
		{ value: 4, label: 'literals.4years' },
		{ value: 5, label: 'literals.5years' }
	]

	loanTypes = [
		{ value: LoanTypeEnum.FULLY_AMORTIZED, label: 'literals.loanTypes.FULLY_AMORTIZED' },
		{ value: LoanTypeEnum.INTEREST_ONLY, label: 'literals.loanTypes.INTEREST_ONLY' },
		// Not for now 0 this is too complicated for most users
		/*{ value: LoanTypeEnum.PARTLY_AMORTIZING, label: 'literals.loanTypes.PARTLY_AMORTIZING' },*/
		{ value: LoanTypeEnum.ZERO_COUPON, label: 'literals.loanTypes.ZERO_COUPON' }
	]

	amortizationValues: DropdownChoice[] = [
		{ value: 25, label: 'literals.25years' },
		{ value: 30, label: 'literals.30years' },
		{ value: 35, label: 'literals.35years' },
		{ value: 40, label: 'literals.40years' }
	]
	// AppLanguage = AppLanguage
	isDisableContactUs: boolean
	listPropertyEvents: Event[] = []

	initialCloneForm: FormGroup;
	isChanged
	sub: Subscription = new Subscription()
	unitTypes = [
		{ title: this.translate.instant('page.portfolio.portflio-new.room_1'), value: 1 },
		{ title: this.translate.instant('page.portfolio.portflio-new.room_2'), value: 2 },
		{ title: this.translate.instant('page.portfolio.portflio-new.room_3'), value: 3 },
		{ title: this.translate.instant('page.portfolio.portflio-new.room_4'), value: 4 },
		{ title: this.translate.instant('page.portfolio.portflio-new.room_5'), value: 5 },
		{ title: this.translate.instant('page.portfolio.portflio-new.room_6'), value: 6 },
	]
	yearsAmortizedOptions = [
		{ title: 5, value: 5 },
		{ title: 10, value: 10 },
		{ title: 15, value: 15 },
		{ title: 20, value: 20 },
		{ title: 25, value: 25 },
		{ title: 30, value: 30 },
	]
	constructionYears = []

	constructor(
		private fb: FormBuilder,
		private translate: TranslateService,
		private portfolioLocalService: PortfolioLocalService,
		private layoutService: LayoutService,
		private route: ActivatedRoute,
		private spinnerService: SpinnerService,
		private promptService: PromptService,
		private apiPortfolioService: ApiPortfolioService,
		private propertyMiddleware: PropertiesMiddlewareService,
		private formConfigAdapter: PortfolioFormConfigAdapter,
		public location: Location,
		public dialog: MatDialog,
		private settingsMiddleware: UserSettingsMiddlewareService,
		private router: Router,
		private translateService: TranslateService,
		private assistanceService: AssistanceService,
		private portfolioService: PortfolioService,
		private propertiesService: PropertiesService
	) {
		this.portfolioId = this.route.snapshot.paramMap.get('portfolioId')
		if (this.portfolioId) {
			this.getPortfolioData()
		} else {
			this.portfolioLocalService.portfolioPropertyDetailData = null
		}

		this.initFormValues()
	}

	ngOnInit() {
		this.route.queryParams.subscribe(async (param) => {
			const propertyId = param.propertyId
			try {
				if (propertyId) {
					const propertyEvents = await this.propertiesService.listPropertyEvents(propertyId).toPromise()	
					this.listPropertyEvents = lodash.sortBy(propertyEvents.filter(event => event.type ===  EventType.Sold), 'date').reverse()
					
				}
			} catch (error) {
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			}


			let propertyData
			if (param.propertyData) {
				propertyData = JSON.parse(param.propertyData)
			}

			// A MREX property was found
			if (propertyId) {
				this.spinnerService.text = ''
				this.spinnerService.show()
				const property = await this.propertyMiddleware.getProperty(propertyId).toPromise()
					.catch((err) => {
						this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error', false)
						console.error(err)
					})
				if (!property) {
					return
				}
				const config = new PortfolioConfig()
				config.init(property)
				config.propertyId = propertyId
				config._id = null
				this.spinnerService.hide()
				this.initForm(config)
				if (this.listPropertyEvents.length) {
					this.form.patchValue({
						purchaseDate: this.listPropertyEvents[0].date
					})
				}
			}
		})
	}

	initFormValues() {
		for(let i = 1900; i <= new Date().getFullYear() ; i++) {
			this.constructionYears.push(i)
		}
	}

	initForm(config: PortfolioConfig) {
		this.form = this.fb.group({
			_id: config._id,
			propertyId: [config.propertyId],
			placeId: [config.placeId],
			address: this.fb.group({
				civicNumber: [{ value: config.address.civicNumber, disabled: config._id ? true : false }, Validators.required],
				civicNumber2: [{ value: config.address.civicNumber2, disabled: config._id ? true : false }],
				street: [{ value: config.address.street, disabled: config._id ? true : false }, [Validators.required]],
				city: [{ value: config.address.city, disabled: config._id ? true : false }, [Validators.required]],
				state: [{ value: config.address.state, disabled: config._id ? true : false }],
				postalCode: [{ value: config.address.postalCode, disabled: config._id ? true : false }, [Validators.required, Validators.minLength(3)]],
				stateCode: [{ value: config.address.stateCode, disabled: config._id ? true : false }, [Validators.required, Validators.minLength(2)]],

			}),
			propertyType: [config.propertyType, [Validators.required, yearValidation]],
			yearOfConstruction: [config.yearOfConstruction, Validators.required],
			floors: [config.floors, Validators.required],
			floorArea: [config.floorArea, Validators.required ],
			residentialUnits: [{ value: config.residentialUnits, disabled: this.itemizeUnitsCheck ? true : false }, [Validators.required, Validators.min(1), Validators.max(200)]],
			leases: config._id ? this.fb.array(this.setLeaseFrom(config.leases.leases)) : this.fb.array(this.buildLeaseForm(config.residentialUnits, false)),
			expenses: this.fb.group({				
				currency: [config.expenses.currency],
				municipalTax: [config.expenses.municipalTax, [Validators.required, Validators.min(0)]],
				insurance: [config.expenses.insurance, [Validators.required, Validators.min(0)]],
				schoolTax: [config.expenses.schoolTax, [Validators.required, Validators.min(0)]],
				totalUtilities: [config.expenses.totalUtilities, [Validators.required, Validators.min(0)]],
				year: [config.expenses.year],
				totalTaxes: [config.expenses.totalTaxes]
			}),
			purchasePrice: [config.purchasePrice, Validators.required],
			purchaseDate: [config.purchaseDate, Validators.required],
			primaryFinancing: this.fb.group({
				financingType: [config.primaryFinancing.financingType, Validators.required],
				initialAmount: [config.primaryFinancing.initialAmount, Validators.required],
				insured: [config.primaryFinancing.insured],
				firstPaymentDate: [config.primaryFinancing.firstPaymentDate, Validators.required],
				term: [config.primaryFinancing.term, Validators.required],
				amortization: [config.primaryFinancing.amortization, Validators.required],
				interestRate: [config.primaryFinancing.interestRate, Validators.required]
			}),
			secondaryFinancing: this.fb.group({
				firstPaymentDate: [config.secondaryFinancing.firstPaymentDate, Validators.required],
				interestRate: [config.secondaryFinancing.interestRate, Validators.required],
				initialAmount: [config.secondaryFinancing.initialAmount, Validators.required],
				term: [config.secondaryFinancing.term, Validators.required],
				loanType: [config.secondaryFinancing.loanType, Validators.required],
				amortization: [config.secondaryFinancing.amortization, Validators.required],
				description: [config.secondaryFinancing.description, Validators.required],
				enabled: [config.secondaryFinancing.enabled, Validators.required],
			}),
			otherIncome: this.fb.group({
				laundry: [
					config.otherIncome && config.otherIncome.find(income => income.type === 'laundry') ?
						config.otherIncome.find(income => income.type === 'laundry').amount : null ],
				parking: [
					config.otherIncome && config.otherIncome.find(income => income.type === 'parking') ?
						config.otherIncome.find(income => income.type === 'parking').amount : null ],
				internet: [
					config.otherIncome && config.otherIncome.find(income => income.type === 'internet') ?
						config.otherIncome.find(income => income.type === 'internet').amount : null ],
				other: [
					config.otherIncome && config.otherIncome.find(income => income.type === 'other') ?
						config.otherIncome.find(income => income.type === 'other').amount : null ]
			}),
			receiveOfferStatus: [config.receiveOfferStatus, Validators.required],

		}, {
			validators: this.primaryFirstPaymentValidator('purchaseDate', 'primaryFinancing')
		})
		this.setupResidentialUnitRelation()
		this.setSecondaryFinancingForm()
		this.setSecondaryFinancingValidators()

		const initialValue = lodash.cloneDeep(this.form.value)

		console.log('FORM===>', this.form)
		this.form.controls.expenses['controls'].municipalTax.valueChanges.subscribe(v => {
			this.form.controls.expenses.patchValue({
				totalTaxes: v + this.form.controls.expenses.value.schoolTax
			})
		})

		this.form.controls.expenses['controls'].schoolTax.valueChanges.subscribe(v => {
			this.form.controls.expenses.patchValue({
				totalTaxes: v + this.form.controls.expenses.value.municipalTax
			})
		})

		this.sub.add(
			this.form.valueChanges.pipe(
				map(value => lodash.isEqual(initialValue, value))
			).subscribe(res => {
				this.isChanged = !res
			})
		)
		
	}

	primaryFirstPaymentValidator(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];

			if (matchingControl.errors && !matchingControl.errors.mustAfter) {
				// return if another validator has already found an error on the matchingControl
				return;
			}

			if (control.value >= matchingControl.value.firstPaymentDate) {
				// set error on matchingControl if validation fails
				matchingControl.get('firstPaymentDate').setErrors({ mustAfter: true });
			} 
		}
	}

	setupResidentialUnitRelation() {
		this.form.controls.residentialUnits.valueChanges
			.pipe(
				takeWhile(() => Boolean(this.form))
			)
			.subscribe(units => {
				if (units !== null && units !== this._residentialUnits) {
					this._residentialUnits = units
					const prevCount = this.form.controls.leases.value.length
					if (prevCount >= units) {
						this.form.controls.leases = this.fb.array(
							this.form.controls.leases['controls'].splice(0, units)
						)
					} else {
						this.form.controls.leases = this.fb.array(
							this.form.controls.leases['controls'].concat(this.buildLeaseForm(units - prevCount, true))
						)
					}
				}
			})
	}

	updateFinancingParameters(financingType?: string) {
		this._financingType = financingType
		this.form.get('primaryFinancing').patchValue({
			financingType
		})
	}

	reset() {
		this._financingType = 'CHMC'
		this.form.get('primaryFinancing').patchValue({
			financingType: this._financingType
		})
	}

	// TODO: Should be a form array??
	setLeaseFrom(leases: Lease[]) {
		let leaseForms = []
		leaseForms = leases.map(lease => {
			const inclusionForm = this.inclusions.map(item => this.fb.group({
				[item]: [lease.inclusion.includes(item as any) ? true : false]
			}))
			return this.fb.group({
				from: [lease.from, Validators.required],
				to: [lease.from, Validators.required],
				rooms: [lease.rooms, Validators.required],
				inclusion: this.fb.array(inclusionForm),
				rent: [lease.rent, Validators.required],
				suite: [lease.suite,  Validators.required],
				currency:Currency.CAD
			})
		})
		return leaseForms
	}

	// TODO: Should be a form array??
	buildLeaseForm(units: number, updated = false) {
		const prevCount =  this.form && this.form.controls.leases['controls'].length
		const inclusionForm = this.inclusions.map(item => this.fb.group({
			[item]: [false]
		}))
		const leaseForms = []
		for (let unit = 0; unit < units; unit++) {
			leaseForms.push(
				this.fb.group({
					from: [null, Validators.required],
					to: [null, Validators.required],
					rooms: [null, Validators.required],
					inclusion: this.fb.array(inclusionForm),
					rent: [null, Validators.required],
					suite: updated ? [`Unit ${prevCount + unit + 1}`,  Validators.required] : [`Unit ${unit + 1}`,  Validators.required],
					currency: Currency.CAD
				})
			)
		}
		return leaseForms
	}

	get getLeaseForm() {
		return this.form.get('leases') as FormArray
	}

	getInclusion(form: FormGroup) {
		return form.controls.inclusion['controls'];
	}

	getLeases(form) {
		return form.controls.leases.controls;
	}

	getInclusionTitle(j) {
		return this.translate.instant(`page.portfolio.unit.${this.inclusions[j]}`)
	}

	getInclusionsName(i) {
		return this.inclusions[i];
	}

	get residentialUnits() {
		return this.form.get('residentialUnits')
	}

	submitPortfolio() {

		const message = this.translate.instant('page.portfolio.confirm_new_portfolio')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]

		this.validate()

		let redirectUrl

		if (this.form.valid) {
			this.promptService.prompt('', message, promptChoices)
				.pipe(
					take(1),
					map(async (res) => {
						if (res === 'yes') {
							this.spinnerService.text = this.translate.instant('spinner.savingPortfolio')
							this.spinnerService.show()
							this.form.controls.expenses.patchValue({
								totalTaxes: this.form.controls.expenses.value.municipalTax + this.form.controls.expenses.value.schoolTax
							})

							const portfolioAddForm: FormGroup = new FormGroup({})
							portfolioAddForm.addControl(
								'property',
								this.form
							)
							const rawData = portfolioAddForm.getRawValue() as PortfolioFormConfig
							if (rawData.property._id) {
								this.layoutService.openSnackBar(this.translateService.instant('page.portfolio.portfolio-new.successfully_updated'), null, 3000, 'info')
								redirectUrl = this.PortfolioMap.url([ this.PortfolioMap.PROPERTIES, rawData.property._id ])
								console.log(redirectUrl)
							}
							else {
								this.layoutService.openSnackBar(this.translateService.instant('page.portfolio.portfolio-new.successfully_added'), null, 3000, 'info')
								redirectUrl = this.PortfolioMap.path
								console.log(redirectUrl)
							}
							// remove the _id to create a new portfolio
							if (this.router.url.includes(this.PortfolioMap.UPDATE)) {
								delete rawData.property._id
							}
							await this.portfolioLocalService.saveFormData(rawData)
						} else {
							return
						}
					}),
					map(async () => {
						await this.portfolioLocalService.getPortfolioSummary(true)
					})
				)
				.subscribe(async () => {
					await this.router.navigateByUrl(redirectUrl)
					this.spinnerService.hide()
				}, err => {
					if (err.name === 'TypeError') {
						console.error(err)
						this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error', false)
					}
					else {
						let msg = err.error && err.error.message
						if (err.error.code) {
							msg = this.translate.instant(`errorCodes.${err.error.code}`)
						}
						this.layoutService.openSnackBar(msg, null, 3000, 'error', false)
					}
					this.spinnerService.hide()
				})
		}

	}

	validate() {
		const form = this.form

		// array of invalid fields
		const invalids: { fieldname: string, formControl: any, index?: number }[] = []

		if (form && form.controls) {
			Object.keys(form.controls).forEach(fd => {
				const fc: any = form.get(fd)
				if (fc.invalid) {
					console.log(`${fd} is invalid`)
					// nested form group
					if (fc.controls) {
						// Form Array
						if (Array.isArray(fc.controls)) {
							(fc as any).controls.forEach((fg, i) => {
								if (fg.invalid) {
									Object.keys(fg.controls).forEach((fd2: any) => {
										const fc2 = form.get([fd, i, fd2])
										if (fc2.invalid) {
											const fieldname = `portfolio.validation.field.${fd}.${fd2}`
											invalids.push({ fieldname, formControl: fc, index: i })
											console.log(fieldname)

											// Ugly walk arround. The field attributes (touched, dirty, etc.) doesn't propagate to nested ngControls!
											// So we need to set the field to the same value to trigger the subscribe
											fc2.markAsTouched()
											fc2.markAsDirty()
											const value = fc2.value
											if (fc2.get('total')) {
												fc2.get('total').setValue(value.total)
												fc2.get('total').markAsDirty()
												fc2.get('total').markAsTouched()
											}
											else {
												fc2.setValue(value)
												fc2.markAsDirty()
												fc2.markAsTouched()
											}
										}
									})
								}
							})
						}
						// Form group
						else {
							Object.keys((form.get(fd) as any).controls).forEach(fd2 => {
								const fc2 = form.get([fd, fd2])
								if (fc2 && fc2.invalid) {
									const fieldname = `portfolio.validation.field.${fd}.${fd2}`
									if (fc2.errors && fc2.errors.mustAfter) {
										this.layoutService.openSnackBar(
											this.translate.instant('page.portfolio.portfolio_new.primary_first_payment_date_validation'),
											null,
											3000,
											'error',
											false
										)
									} else {
										invalids.push({ fieldname, formControl: fc })
									}

									console.log(fieldname)

									// Ugly walk arround. The field attributes (touched, dirty, etc.) doesn't propagate to nested ngControls!
									// So we need to set the field to the same value to trigger the subscribe
									fc2.markAsTouched()
									fc2.markAsDirty()
									const value = fc2.value
									if (fc2.get('total')) {
										fc2.get('total').setValue(value.total)
										fc2.get('total').markAsDirty()
										fc2.get('total').markAsTouched()
									}
									else {
										fc2.setValue(value)
										fc2.markAsDirty()
										fc2.markAsTouched()
									}
								}
							})
						}
					}
					// not nested
					else {
						const fieldname = 'portfolio.validation.field.' + fd
						invalids.push({ fieldname, formControl: fc })
						fc.setValue(fc.value)
						fc.markAsDirty()
						fc.markAsTouched()
					}
				}
			})
		}

		invalids.reverse().forEach(x => {
			this.layoutService.openSnackBar(
				this.translate.instant('validation.badField', {
					fieldname: this.translate.instant(x.fieldname, { index: x.index })
				}),
				null,
				3000,
				'error',
				false
			)
		})
	}

	async getPortfolioData() {
		try {
			this.spinnerService.show()
			this.spinnerService.text=''

			if (!this.portfolioLocalService.portfolioPropertyDetailData || (this.portfolioLocalService.portfolioPropertyDetailData._id !== this.portfolioId)) {
				this.portfolioLocalService.portfolioPropertyDetailData = await this.apiPortfolioService.getPortfolioProperty(this.portfolioId)
					.toPromise()
					.catch((err) => {
						console.error(err)
						this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 3000, 'error', false)
					}) as Portfolio
			}

			this.spinnerService.hide()

			const portfolioForm = this.formConfigAdapter.adapt(this.portfolioLocalService.portfolioPropertyDetailData)

			const portfolioConfig = new PortfolioConfig()
			portfolioConfig.init(portfolioForm.getData())

			this.initForm(portfolioConfig)

		} catch (error) {
			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}
		
	}

	closePropertySearchDrawer() {
		this.drawerOutlet.closeDrawers();
	}

	onPropertySearchDrawerWrapperClosed() {
		this.removePropertySearchDrawer();
	}

	// TODO: Add or Remove Component by using ViewContainerRef
	addPropertySearchDrawer() {
		this.activePropertySearchDrawer = true
		this.drawerOutlet.openDrawer()
	}

	removePropertySearchDrawer() {
		this.activePropertySearchDrawer = false
	}

	async onPropertySearchDrawerEventEmitted(event: PropertySearchDrawerEvent) {
		this.closePropertySearchDrawer()

		if (event && event.data.id) {
			this.spinnerService.show()
			this.spinnerService.text = ''
			try {
				const property = await this.propertyMiddleware.getProperty(event.data.id).toPromise()
				const config = this.formConfigAdapter.adapt(property).property
				config.propertyId = event.data.id
				config._id = null
				this.spinnerService.hide()
				this.form.get('address').patchValue({
					civicNumber: config.address.civicNumber
				})

				this.form.get('address').patchValue({
					stateCode: config.address.stateCode
				})

				this.form.get('address').patchValue({
					civicNumber2: config.address.civicNumber2
				})

				this.form.get('address').patchValue({
					street: config.address.street
				})

				this.form.get('address').patchValue({
					city: config.address.city
				})

				this.form.get('address').patchValue({
					state: config.address.state
				})

				this.form.get('address').patchValue({
					postalCode: config.address.postalCode
				})
			} catch (err) {
				console.error(err)
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
			}

		}
	}

	setSecondaryFinancingForm() {
		this.featureName = this.translate.instant('helper.property-add.components.purchase-info.secondary-financing.featureName')
		this.enabled = this.form.getRawValue().secondaryFinancing.enabled
		this.showAmortization = this.hasAmortization(this.form.getRawValue().secondaryFinancing.loanType)
		this.form.get(['secondaryFinancing', 'loanType']).valueChanges
			.pipe(takeWhile(() => Boolean(this.form)))
			.subscribe((val) => {
				this.showAmortization = this.hasAmortization(val)
			})
	}

	hasAmortization(loanType: string) {
		// do not show amortization for Zeron Coupon and interest only
		return ![LoanTypeEnum.ZERO_COUPON, LoanTypeEnum.INTEREST_ONLY].includes(Number(loanType))
	}

	toggleCheck(evt) {
		this.enabled = evt.checked
		this.form.get(['secondaryFinancing', 'enabled']).patchValue(this.enabled)
		this.setSecondaryFinancingValidators()
	}

	setSecondaryFinancingValidators() {
		// If second financing is is enabled, set the validatores to their original value, otherwise no validators are required
		Object.keys((this.form.get(['secondaryFinancing']) as any).controls)
			.forEach(controlName => {
				const validators = (this.enabled) ? secondaryFinancingValidators[controlName] : []
				this.form.get(['secondaryFinancing', controlName]).setValidators(validators)
				this.form.get(['secondaryFinancing', controlName]).updateValueAndValidity()
			})
	}

	leaseDateChange(evt: MatDatepickerInputEvent<any>, lease, idx) {
		moment.locale(this.settingsMiddleware.language === 'en-US' ? 'en' : 'fr')
		const leases = this.getLeases(this.form)
		const dateDuration = `${moment(lease.value.from).format('MMM DD, YYYY')} - ${moment(lease.value.to).format('MMM DD, YYYY')}`
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]
		if (lease.value.from && lease.value.to) {
			this.dialog.open(LeaseDateApplyDlgComponent, {
				data: {
					title: this.translate.instant('page.portfolio.relase_date_apply', {
						date: dateDuration
					}),
					leases: this.getLeases(this.form).map((lease, index) => ({
						idx: index,
						title: `${this.translate.instant('page.portfolio.unit')} ${index + 1}`,
						state: true
					})),
					dialogBtn: promptChoices,
				},
				panelClass: 'lease-date-apply'
			})
			.afterClosed()
			.subscribe(res => {
				if (res) {
					this.getLeases(this.form).forEach((form: FormGroup, index) => {
						if (res.find(item => item.idx === index).state) {
							form.patchValue({
								from: lease.value.from,
								to: lease.value.to
							})
						}
					});
				}
			})
		}
	}

	contactUs() {
		const message = this.translate.instant('page.portfolio.new_portfolio.contact_message')
		const promptChoices: PromptChoice[] = [
			{ key: 'ok', label: this.translate.instant('literals.ok'), class: 'btn' },
			{ key: 'cancel', label: this.translate.instant('literals.cancel'), class: 'btn btn-outline-light' },
		]
		this.promptService.prompt('', message, promptChoices).pipe(
			take(1),
			flatMap((res) => {
				if (res === 'yes') {
					this.spinnerService.show()
					this.spinnerService.text = ''

					const portfolioAddForm: FormGroup = new FormGroup({})
					portfolioAddForm.addControl(
						'property',
						this.form
					)
					let rawData = portfolioAddForm.getRawValue()
					
					let param  = {
						...rawData.property,
						isDraft: true
					}

					delete param._id
					return this.portfolioService.addDraftPropertyToPortfolio(param)
				} else {
					return of('no')
				}
			}),
			flatMap(async (res) =>{
				if (res !== 'no') {
					await this.portfolioLocalService.getPortfolioDraftPros(true)
					return this.assistanceService.sendAssistanceRequest({
						messageType: UserAssistanceRequestType.PortfolioHelp,
						propertyId: this.form.value.propertyId
					})
				}
				
			}),
			catchError((error: HttpErrorResponse) => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
				return throwError(error)
			})
		).subscribe(res => {
			this.spinnerService.hide()
			if (res) {
				this.isDisableContactUs = true;
				this.router.navigate([RouterMap.Portfolio.url([RouterMap.Portfolio.SUMMARY])])
			}
		})
	}

	uploadProperty() {
		this.layoutService.openModal(AddUnregisterPropertyDlgComponent, {
			data:  {
				title: this.translate.instant('helper.add_unregister_property.send_property_document'),
				descriptiveText: this.translate.instant('helper.add_unregister_property.send_property_document_description'),
				goBack: {
					label: this.translate.instant('helper.add_unregister_property.confirm_dlg.go_back_portfolio'),
					route: `/${RouterMap.Portfolio.path}`
				},
				type: UnregisterTypes.Portfolio,
				submit: {
					label: this.translate.instant('helper.add_unregister_property.confirm_dlg.portfolio_add_another'),
				},
				isHideAddress: true,
			}
		}).closed$.subscribe(
			(res: Array<any>) => {
				if (res && res.length) {
					let files = res
					const portfolioAddForm: FormGroup = new FormGroup({})
					portfolioAddForm.addControl(
						'property',
						this.form
					)
					let rawData = portfolioAddForm.getRawValue()
					
					let param  = {
						...rawData.property,
						isDraft: true
					}
					if(!param._id) {
						
						const message = this.translate.instant('pages.portfolio.save_draft_before_document')
						const promptChoices: PromptChoice[] = [
							{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
							{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
						]

						setTimeout(() => {
							this.promptService.prompt('', message, promptChoices).pipe(
								take(1),
								flatMap(async (res) => {
									if (res === 'yes') {
										delete param._id
										const res = await this.portfolioService.addDraftPropertyToPortfolio(param).toPromise()
										this.form.patchValue({
											_id: res['_id']
										})
										this.isChanged = false
									
										return of(res)
									}
								}),
								flatMap(res => {
									if (res) {
										this.layoutService.openSnackBar(this.translate.instant('pages.portfolio.draft_saved'), null, 5000, 'info')
										
										return this.assistanceService.sendAssistanceRequest({
											messageType: UserAssistanceRequestType.PortfolioHelp,
											propertyId: this.form.value.propertyId,
											portfolioId: this.form.value._id,
											fileIds: files.map(file => file.id)
										})
									} else {
										return of(null)
									}
									
								}),
								catchError((error: HttpErrorResponse) => {
									this.spinnerService.hide()
									this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
									return throwError(error)
								})
								).subscribe(async (res) => {
									if (res) {
										await this.portfolioLocalService.getPortfolioDraftPros(true)
										await this.portfolioLocalService.getPortfolioSummary(true)
									}
								}
							)
						}, 500)
					} else {
						this.sub.add(
							this.assistanceService.sendAssistanceRequest({
								messageType: UserAssistanceRequestType.PortfolioHelp,
								propertyId: this.form.value.propertyId,
								portfolioId: this.form.value._id,
								fileIds: files.map(file => file.id)
							}).subscribe()
						)
						
					}
				}
				
			}
		)
	}

	async draftPortfolio() {

		try {
			this.spinnerService.text = ''
			this.spinnerService.show()
			const portfolioAddForm: FormGroup = new FormGroup({})
			portfolioAddForm.addControl(
				'property',
				this.form
			)
			let rawData = portfolioAddForm.getRawValue()
			
			let param  = {
				...rawData.property,
				isDraft: true
			}
			if(!param._id) {
				delete param._id
				const draft = await this.portfolioService.addDraftPropertyToPortfolio(param).toPromise()
				this.form.patchValue({
					_id: draft['_id']
				})
			} else {
				await this.portfolioService.updateDraftPortfolioProperty(param, param._id).toPromise()
			}

			await this.portfolioLocalService.getPortfolioDraftPros(true)
			this.spinnerService.hide()

			this.layoutService.openSnackBar(this.translate.instant('pages.portfolio.draft_saved'), null, 5000, 'info')
			await this.portfolioLocalService.getPortfolioSummary(true)
			
			this.isChanged = false

		} catch (error) {
			this.spinnerService.hide()

			this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
		}
		
	}

	back = () => {
		const portfolioAddForm: FormGroup = new FormGroup({})
		portfolioAddForm.addControl(
			'property',
			this.form
		)
		let rawData = portfolioAddForm.getRawValue()
		let param  = {
			...rawData.property,
		}
		if (this.isChanged || !param._id) {
			this.updateDraft()
		} else {
			this.router.navigate([RouterMap.Portfolio.url([RouterMap.Portfolio.SUMMARY])])
		}
	}

	updateDraft() {
		const message = this.translate.instant('page.portfolio.new_portfolio.draft_portfolio')
		const promptChoices: PromptChoice[] = [
			{ key: 'yes', label: this.translate.instant('literals.yes'), class: 'btn' },
			{ key: 'no', label: this.translate.instant('literals.no'), class: 'btn btn-outline-light' },
		]

		this.promptService.prompt('', message, promptChoices).pipe(
			take(1),
			flatMap(async (res) => {
				if (res === 'yes') {
					this.spinnerService.text = ''
					this.spinnerService.show()
					const portfolioAddForm: FormGroup = new FormGroup({})
					portfolioAddForm.addControl(
						'property',
						this.form
					)
					let rawData = portfolioAddForm.getRawValue()

					let param  = {
						...rawData.property,
						isDraft: true
					}
					if(!param._id) {
						delete param._id
						const res = await this.portfolioService.addDraftPropertyToPortfolio(param).toPromise()
						this.form.patchValue({
							_id: res['_id']
						})

						return of(res)

					} else {
						await this.portfolioService.updateDraftPortfolioProperty(param, param._id).toPromise()
						return of(param) 
					}
					
				} else {
					this.location.back()
					return null
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.spinnerService.hide()
				this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
				return throwError(error)
			})
		)
		.subscribe(async (res) => {
			if (res) {
				this.layoutService.openSnackBar(this.translate.instant('pages.portfolio.draft_saved'), null, 5000, 'info')
				await this.portfolioLocalService.getPortfolioDraftPros(true)
				await this.portfolioLocalService.getPortfolioSummary(true)
	
				this.isChanged = false
				this.location.back()
			}
			this.spinnerService.hide()
		})
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	updateProprtyFormValue(updateValue) {
		this.form.patchValue({
			propertyType: updateValue
		})
		console.log('UPDATE FORM', this.form)
	}

}

export const secondaryFinancingValidators = {
	loanAmount: [Validators.required, Validators.min(1)],
	interestRate: [Validators.required, Validators.min(0.01), Validators.max(100)],
	firstPaymentDate: [Validators.required, Validators.min(0)],
	term: [Validators.required, Validators.min(1)],
	loanType: [Validators.required, Validators.min(0)],
	amortization: [Validators.required, Validators.min(1)],
	description: [Validators.required, Validators.min(1)],
	initialAmount: [Validators.required]
}