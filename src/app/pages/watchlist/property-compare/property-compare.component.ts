import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyLocalData } from '@app/core/models/property.interface';
import { PropertiesService } from '@app/core/localDB/properties.service';
import { takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Hypothesis, SummaryCashOnCashInner } from '@app/api_generated';
import { LayoutService } from '@app/layout/service/layout.service';
import { ModalRef } from '@app/core/models/modal-ref';
import { PropertiesSelectComponent } from '../components/properties-select/properties-select.component';

@Component({
	selector: 'app-property-compare',
	templateUrl: './property-compare.component.html',
	styleUrls: ['./property-compare.component.scss']
})
export class PropertyCompareComponent implements OnInit, OnDestroy {

	propertyId = ''
	propertyDoc1: PropertyLocalData
	propertyDoc2: PropertyLocalData

	property1: any
	property2: any

	header1: any
	header2: any

	propertiesDoc: PropertyLocalData[]
	subscription = true

	group1: any = []
	group2: any = []
	group3: any = []
	group4: any = []

	propertiesListComplete = new EventEmitter<any>()
	modalRef: ModalRef

	constructor(private route: ActivatedRoute,
		private translate: TranslateService,
		private layoutService: LayoutService,
		private router: Router,
		private propertiesService: PropertiesService) { }

	async ngOnInit() {
		this.propertyId = this.route.snapshot.paramMap.get('modelId')

		this.propertyDoc1 = this.propertiesService.getByPropertyId(this.propertyId)
		this.buildGroups()

		this.propertiesListComplete
			.pipe(takeWhile(_ => Boolean(this.modalRef)))
			.subscribe(res => {
				const slot = res.slot
				const propertyDoc = res.propertyDoc
				if (propertyDoc) {
					this.modalRef.closeModal()

					if (slot === 1) {
						this.propertyDoc1 = propertyDoc
					}
					else {
						this.propertyDoc2 = propertyDoc
					}
					this.buildGroups()
				}
				else {
					console.error('No property selected')
				}
			})
	}

	buildGroups() {

		if (this.propertyDoc1) {
			const property1 = this.propertyDoc1.propertyData
			this.header1 = this.buildHeader(property1)
		}
		if (this.propertyDoc2) {
			const property2 = this.propertyDoc2.propertyData
			this.header2 = this.buildHeader(property2)
		}

		const comparison = [
			this.buildComparisonObj(this.propertyDoc1),
			this.buildComparisonObj(this.propertyDoc2)
		]

		this.group1 = this.buildGroup(comparison, [
			[ 'units' ],
			[ 'totalAcquisitionCost', '$' ],
			[ 'totalDownPayment', '$' ],
			[ 'askingCapRate', '%' ],
			[ 'pricePerUnit', '$' ],
		])

		this.group2 = this.buildGroup(comparison, [
			[ 'preTaxIRR', '%'],
			[ 'preTaxNPV', '$' ],
			[ 'annualCashOnCash', '%'],
			[ 'cashOnCashPlusFirstYearPrincipal', '%' ],
		])

		// These properties are in the spreadsheet but Nikolai didn't specify where he wants it
		/*
		[ 'financingCapRate', '%' ],
		[ 'leverageCapRate', '%' ],
		*/

		this.group3 = this.buildGroup(comparison, [
			[ 'averagePretaxCashFlow', '$' ],
			[ 'averageMortgagePayDown', '$' ],
			[ 'averageUnitsRent', '$' ],
			[ 'thirdMethodCurrentGrossIncome', '$' ],
			[ 'operationExpensesRate', '%' ],
			[ 'netOperatingIncome', '$' ],
		])

		this.group4 = this.buildGroup(comparison, [
			[ 'projectedFutureSaleValue', '$' ],
			[ 'exploitableLeverage', '$' ],
			[ 'saleEquity', '$' ],
		])

	}

	buildHeader(property) {
		const address = property.address
		const header = {
			image: property.image,
			line1: `${address.civicNumber}${address.civicNumber2 ? ' - ' + address.civicNumber2 : ''} ${address.street}`,
			line2: `${address.city} (${address.stateCode || address.state || (address as any).province})`
		}

		return header
	}

	buildComparisonObj(propertyDoc) {

		if (propertyDoc) {

			const property = propertyDoc.propertyData
			const hypothesis = propertyDoc.hypothesisData as Hypothesis

			const financingCompany = hypothesis.input.financingCompany
			const economicValue = hypothesis.output.economicValues
									.find(x => x.financingCompany === financingCompany)

			const financingDetails = hypothesis.output.summaryOverview.financingDetails
									.find(x => x.financingCompany === financingCompany)

			return {
				// group 1
				units: property.residentialUnits,
				askingCapRate: economicValue.askingCapRate,
				totalRentableArea: null,
				totalAcquisitionCost: economicValue.totalAcquisitionCost,
				totalDownPayment: financingDetails.totalDownPayment,
				averagePretaxCashFlow: hypothesis.output.summaryOverview.averagePretaxCashFlow,
				averageMortgagePayDown: hypothesis.output.propertyComparison.averageMortgagePayDown,
				annualCashOnCash: (hypothesis.output.summaryCashOnCash[0] as SummaryCashOnCashInner).annualCashOnCash,
				cashOnCashPlusFirstYearPrincipal: hypothesis.output.propertyComparison.cashOnCashPlusFirstYearPrincipal,

				// group 2
				financingCapRate: economicValue.financingCapRate,
				leverageCapRate: economicValue.leverageCapRate,
				thirdMethodCurrentGrossIncome: hypothesis.input.thirdMethodCurrentGrossIncome,
				operationExpensesRate: hypothesis.output.expenses.operationExpensesRate,
				netOperatingIncome: economicValue.netOperatingIncome,
				pricePerUnit: hypothesis.output.summaryOverview.pricePerUnit,
				averageUnitsRent: hypothesis.output.cashFlowEdit.averageUnitsRent,
				preTaxIRR: hypothesis.output.profitability[0].preTaxIRR,
				preTaxNPV: hypothesis.output.profitability[0].preTaxNPV,
				projectedFutureSaleValue: hypothesis.output.summaryOverview.projectedFutureSaleValue,

				// group 3
				exploitableLeverage: hypothesis.output.summaryOverview.exploitableLeverage,
				saleEquity: hypothesis.output.propertyComparison.saleEquity
			}
		}
		else {

			return {
				// group 1
				units: null,
				askingCapRate: null,
				totalRentableArea: null,
				totalAcquisitionCost: null,
				totalDownPayment: null,
				averagePretaxCashFlow: null,
				averageMortgagePayDown: null,
				annualCashOnCash: null,
				cashOnCashPlusFirstYearPrincipal: null,

				// group 2
				financingCapRate: null,
				leverageCapRate: null,
				thirdMethodCurrentGrossIncome: null,
				operationExpensesRate: null,
				netOperatingIncome: null,
				pricePerUnit: null,
				averageUnitsRent: null,
				preTaxIRR: null,
				preTaxNPV: null,
				projectedFutureSaleValue: null,

				// group 3
				exploitableLeverage: null,
				saleEquity: null
			}
		}
	}

	buildGroup(comparison, items): Indicator[] {

		return items.map((item: any) => {
			const key  = item[0]
			const unit = item[1]
			const tooltip = item[2]

			let value1, value2
			if (comparison && comparison[0]) {
				value1 = comparison[0][key]
			}
			else {
				value1 = null
			}

			if (comparison && comparison[1]) {
				value2 = comparison[1][key]
			}
			else {
				value2 = null
			}

			const obj: Indicator = {
				label: this.translate.instant('compare.' + key),
				value: value1,
				unit: unit,
				tooltip: tooltip,
				align: 'right'
			}

			obj.isCurrency = unit === '$'

			if (unit === '$') {
				obj.currencyCode = 'CAD'
				obj.display = 'symbol-narrow'
				obj.digitsInfo = '1.0-0'
			}
			else if (unit === '%') {
				obj.digitsInfo = '1.1-1'
			}
			else {
				obj.digitsInfo = '1.0-0'
			}

			if (typeof(obj.value) === 'number') {
				obj.diff = value1 - value2
			}
			else {
				obj.diff = 0
			}

			const indicator1 = obj
			const indicator2 = { ...indicator1 }
			indicator2.diff = -obj.diff
			indicator2.value = value2
			indicator2.align = 'left'

			// Indicators that can be red or green
			const allowedColorfulIndicators = [
				'askingCapRate',
				'preTaxIRR',
				'preTaxNPV',
				'annualCashOnCash',
				'cashOnCashPlusFirstYearPrincipal'
			]

			if (allowedColorfulIndicators.includes(key)) {
				indicator1.className = indicator1.diff > 0 ? 'green bold' : 'red bold'
				indicator2.className = indicator2.diff > 0 ? 'green bold' : 'red bold'
			}

			return [ indicator1, indicator2 ]

		})
	}

	// slot = 1 => left
	// slot = 2 => right
	changeProperty(slot: number, propertyDoc: PropertyLocalData) {
		this.modalRef = this.layoutService.openModal(PropertiesSelectComponent, {
			propertyDoc: propertyDoc,
			slot: slot,
			complete: this.propertiesListComplete,
			subtitle: this.translate.instant('page.watchlist.property-compare.subtitle' )
		})
	}

	back = () => {
		this.router.navigateByUrl(this.router.url.split('/compare')[0])
	}

	ngOnDestroy() {
		this.subscription = false
	}

}

export interface Indicator {
	label: string
	value?: number | string
	unit?: string | null | undefined
	tooltip?: any | null | undefined
	isCurrency?: boolean
	currencyCode?: string | null | undefined
	display?: string | null | undefined
	digitsInfo?: string | null | undefined
	diff?: number | null
	align: string
	className?: string | undefined
}

