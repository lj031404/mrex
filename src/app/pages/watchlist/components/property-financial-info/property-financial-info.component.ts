import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core'
import { PropertyLocalData, Property } from '@app/core/models/property.interface';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { _translate } from '@app/core/utils/translate.util';
import { FinancingCompany, Hypothesis } from '@app/api_generated';
import { UserSettingsMiddlewareService } from '@app/api-middleware/user-settings-middleware.service';
import { environment } from '@env/environment';

@Component({
	selector: 'app-property-financial-info',
	templateUrl: './property-financial-info.component.html',
	styleUrls: ['./property-financial-info.component.scss']
})
export class PropertyFinancialInfoComponent implements OnInit, OnChanges {

	@Input() propertyDoc: PropertyLocalData
	@Input() change: Subject<PropertyLocalData>

	summaryOverview: any
	subscribe = true

	constructor(
		private translate: TranslateService,
		private userSettingsMiddlewareService: UserSettingsMiddlewareService
		) {}

	ngOnInit() {
		this.refresh()

		this.change
			.pipe(takeWhile(_ => this.subscribe))
			.subscribe(propertyDoc => {
				this.propertyDoc = propertyDoc as PropertyLocalData
				this.refresh()
			})
	}

	ngOnDestroy() {
		this.subscribe = false
	}

	buildOverviewItem(labelKey, value = null, unit = null, tooltip = null, precision = null): OverviewRowItem  {
		try {
			return {
				label: this.translate.instant(labelKey),
				value,
				unit,
				tooltip: tooltip ? this.translate.instant(tooltip) : null,
				precision
			}
		}
		catch(err) {
			console.error(`Error with label ${labelKey}: ${err.message}`)
			throw err
		}
	}

	refresh() {
		const hypothesis = this.propertyDoc.hypothesisData
		const property = this.propertyDoc.propertyData

		const summaryOverview = hypothesis && hypothesis.output && hypothesis.output.summaryOverview ? hypothesis.output.summaryOverview : {}

		const financingCompany = hypothesis.input.financingCompany
		const economicValuesOutput = hypothesis.output.economicValues
								.find(x => x.financingCompany === financingCompany)
		const economicValuesInput = hypothesis.input.economicValues
								.find(x => x.financingCompany === financingCompany)
		const financingDetails = hypothesis.output.summaryOverview.financingDetails
								.find(x => x.financingCompany === financingCompany)

		// unpublished debts
		let otherDebts = 0
		hypothesis.input.secondaryFinance
			.forEach(x => otherDebts += x.loanAmount)

		let totalDebt = 0
			hypothesis.input.secondaryFinance
			.forEach(x => totalDebt += x.loanAmount)
		totalDebt += economicValuesOutput.loanAmount

		const totalTaxes = hypothesis.input.totalTaxes ?
							hypothesis.input.totalTaxes :
							hypothesis.input.municipalTaxes + hypothesis.input.schoolTaxes

		const totalUtilities = hypothesis.input.totalUtilities ?
								hypothesis.input.totalUtilities :
								hypothesis.input.electricity + hypothesis.input.naturalGas

		const grossIncome = hypothesis.input.thirdMethodCurrentGrossIncome || 12 * hypothesis.input.monthlyRentsForFirstMethod.reduce((x, sum) => x + sum)

		const secondLoanAmount = hypothesis.input.secondaryFinance.length && hypothesis.input.secondaryFinance[0].loanAmount || 0

		this.summaryOverview = [
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.internalRateOfReturn'), hypothesis.output.profitability[0].preTaxIRR * 100, '%', 'tooltips.IRR.meaning', 1),
				sub: [
					this.buildOverviewItem(_translate('overview.discountRate'), isNaN(hypothesis.input.npvDiscountRate) ? 0 : hypothesis.input.npvDiscountRate * 100, '%', null, 1),
					this.buildOverviewItem(_translate('overview.npv'), isNaN(hypothesis.output.profitability[0].preTaxNPV) ? 0 : hypothesis.output.profitability[0].preTaxNPV, '$', 'tooltips.NPV.meaning'),
					this.buildOverviewItem(_translate('overview.mirr'), isNaN(hypothesis.output.profitability[0].preTaxMIRR) ? 0 : hypothesis.output.profitability[0].preTaxMIRR * 100, '%', 'tooltips.MIRR.meaning', 1),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.chosenFunding')),
				sub: [
					this.buildOverviewItem(_translate('overview.chosenBank'), hypothesis.input.bank, null, null, null),
					hypothesis.input.financingCompany === FinancingCompany.CHMC ? this.buildOverviewItem(_translate('overview.mortgageInsurance'), this.translate.instant('literals.financing.' + hypothesis.input.financingCompany), null, null, null) : 'overview.noMortgageInsurance',
					this.buildOverviewItem(_translate('overview.qualificationRate'), isNaN(economicValuesOutput.qualificationRate) ? 0 : economicValuesOutput.qualificationRate * 100, '%', null, 2),
					this.buildOverviewItem(_translate('overview.realRate'), isNaN(economicValuesInput.interestRate) ? 0 : economicValuesInput.interestRate * 100, '%', null, 2),
					this.buildOverviewItem(_translate('overview.yearsOfMortgage'), isNaN(economicValuesInput.amortization) ? 0 : economicValuesInput.amortization, this.translate.instant('literals.years'), null, 0),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.cashflow'), hypothesis.output.summaryOverview.averagePretaxCashFlow, 'literals._$PerYear'),
				sub: [
					this.buildOverviewItem(_translate('overview.coc'), hypothesis.output.summaryOverview.cashOnCashRate * 100, '%', 'tooltips.CoC.meaning', 1),
					this.buildOverviewItem(_translate('overview.principal'), hypothesis.output.summaryOverview.principal, 'literals._$PerYear'),
					this.buildOverviewItem(_translate('overview.principalOnCash'), hypothesis.output.summaryOverview.principalOnCash * 100, '%', null, 1),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.capRate'), economicValuesOutput.askingCapRate * 100, '%', 'tooltips.CapRate.meaning', 2),
				sub: [
					// this.buildOverviewItem(_translate('overview.adjustedCapRate', hypothesis.output.summaryOverview.cashOnCashRate, '%'),
					this.buildOverviewItem(_translate('overview.evCapRate'), economicValuesOutput.financingCapRate * 100, '%', 'tooltips.EVCapRate.meaning', 1),
					this.buildOverviewItem(_translate('overview.leverageCapRate'), economicValuesOutput.leverageCapRate * 100, '%', 'tooltips.leverageCapRate.meaning', 1),
					this.buildOverviewItem(_translate('overview.grm'), summaryOverview.grm, '', 'tooltips.GRM.meaning', 1),
					this.buildOverviewItem(_translate('overview.nrm'), summaryOverview.nrm, '', 'tooltips.NRM.meaning', 1),
					this.buildOverviewItem(_translate('overview.pricePerUnit'), summaryOverview.pricePerUnit, '$'),
				]
			},
			{
				type: 'chart-irr-histogram',
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.totalAcquisitionCosts'), economicValuesOutput.totalAcquisitionCost, '$'),
				sub: [
					this.buildOverviewItem(_translate('overview.ev'), economicValuesOutput.economicValue, '$'),
					this.buildOverviewItem(_translate('overview.purchasePrice'), property.askPrice, '$'),
					this.buildOverviewItem(_translate('overview.acquisitionFees'), economicValuesOutput.acquisitionCosts, '$'),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.totalMoneyDown'), financingDetails.totalDownPayment, '$'),
				sub: [
					this.buildOverviewItem(_translate('overview.downpayment'), economicValuesOutput.downPaymentAmount, '$'),
					this.buildOverviewItem(_translate('overview.acquisitionFees'), economicValuesOutput.acquisitionCosts, '$'),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.totalDebt'), totalDebt, '$'),
				sub: [
					this.buildOverviewItem(_translate('overview.mortgage1'), economicValuesOutput.loanAmount, '$'),
					this.buildOverviewItem(_translate('overview.mortgage2'), secondLoanAmount, '$'),
					this.buildOverviewItem(_translate('overview.otherDebts'), otherDebts, '$', 'tooltips.otherLoans.meaning'),
				]
			},
			{
				type: 'chart-money',
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.noi'), economicValuesOutput.netOperatingIncome, '$', 'tooltips.NOI.meaning'),
				sub: [
					// this.buildOverviewItem(_translate('overview.potentialNOI', hypothesis.output.summaryOverview.potentialNOI, '$', 'tooltips.PNOI.meaning'),
					// this.buildOverviewItem(_translate('overview.capex', hypothesis.input.otherExpenses, '$'),
					// this.buildOverviewItem(_translate('overview.netValueToCreate', hypothesis.input.otherExpenses, '$'),
					// this.buildOverviewItem(_translate('overview.exploitableLeverage', hypothesis.output.summaryOverview.exploitableLeverage, '$'),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.grossRevenue'), grossIncome, '$'),
				sub: [
					this.buildOverviewItem(_translate('overview.vacancyRate'), hypothesis.input.vacancyRate * 100, '%', null, 1),
					this.buildOverviewItem(_translate('overview.effectiveGrossIncome'), hypothesis.output.expenses.effectiveGrossIncome, '$'),
					this.buildOverviewItem(_translate('overview.averageRent'), hypothesis.output.cashFlowEdit.averageUnitsRent, '$'),
					// this.buildOverviewItem(_translate('overview.rentPerSqft'), rentPerSqft, '$/p2')
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.expenses'), hypothesis.output.summaryOverview.normalizedExpenses, '$'),
				sub: [
					this.buildOverviewItem(_translate('overview.taxes'), totalTaxes, '$'),
					this.buildOverviewItem(_translate('overview.utilities'), totalUtilities, '$'),
					this.buildOverviewItem(_translate('overview.insurance'), hypothesis.input.insurance, '$'),
					this.buildOverviewItem(_translate('overview.maintenance'), hypothesis.output.expenses.maintenanceFees, '$'),
					this.buildOverviewItem(_translate('overview.salaries'), hypothesis.output.expenses.totalSalaries, '$'),
					this.buildOverviewItem(_translate('overview.management'), hypothesis.output.expenses.managementFees, '$'),
					this.buildOverviewItem(_translate('overview.otherExpenses'), hypothesis.input.otherExpenses, '$'),
				]
			},
			{
				type: 'chart-expenses',
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.equityMultiple'), hypothesis.output.summaryOverview.equityMultiple, '', null, 1),
				sub: [
					this.buildOverviewItem(_translate('overview.futureSaleValue'), hypothesis.output.summaryOverview.projectedFutureSaleValue, '$'),
					this.buildOverviewItem(_translate('overview.dispositionFees'), hypothesis.output.summaryOverview.dispositionFee, '$'),
					this.buildOverviewItem(_translate('overview.remainingLoanBalance'), hypothesis.output.summaryOverview.endBalancedPeriod, '$'),
					this.buildOverviewItem(_translate('overview.profitFromSale'), hypothesis.output.summaryOverview.profitFromSale, '$'),
				]
			},
			{
				type: 'data',
				...this.buildOverviewItem(_translate('overview.projections')),
				sub: [
					this.buildOverviewItem(_translate('overview.propertyAppreciation'), hypothesis.output.summaryOverview.annualPropertyAppreciation * 100, '%', null, 1),
					this.buildOverviewItem(_translate('overview.incomeGrowth'), hypothesis.input.rentIncreaseRate[5] * 100, '%', null, 1),
					this.buildOverviewItem(_translate('overview.expenseGrowth'), hypothesis.input.expensesIncreaseRate * 100, '%', null, 1),
					this.buildOverviewItem(_translate('overview.exitCapRate'), hypothesis.input.capRateYearThreeAndUp * 100, '%', null, 1),
					// this.buildOverviewItem(_translate('overview.refinInterestRate'), hypothesis.output.firstRankMotgage[59].endBalancedPeriod, '$'),
				]
			}
		]
		const roles = this.userSettingsMiddlewareService.user && this.userSettingsMiddlewareService.user.roles
		
		if (roles && roles.includes('dev') || environment.dev) {
			this.summaryOverview.push({
				type: 'projections',
			})
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		this.refresh()
	}
}

interface OverviewRowItem {
	label: string
	value: number | string
	unit: string
	tooltip: string
	precision: number | null
}
