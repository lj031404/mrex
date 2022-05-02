import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { HypothesisLocal } from '@app/core/models/hypothesis.interface'
import { PropertyLocalData } from '@app/core/models/property.interface'
import { PieChart } from '@app-models/chart.interface';

declare var google: any

@Component({
	selector: 'app-property-money-chart',
	templateUrl: './property-money-chart.component.html',
	styleUrls: ['./property-money-chart.component.scss']
})
export class PropertyMoneyChartComponent implements OnInit {

	@Input() property: PropertyLocalData
	@Input() hypothesis: HypothesisLocal

	@ViewChild('chart-money', { static: true }) chartElement: any

	showChart = true
	chartData: PieChart

	constructor(private translate: TranslateService) { }

	ngOnInit() {
		this.drawDonut()
	}

	drawDonut() {
		const financingCompany = this.hypothesis.input.financingCompany
		const economicValues = this.hypothesis.output.economicValues
								.find(x => x.financingCompany === financingCompany)
		let secondaryLoans = 0
		this.hypothesis.input.secondaryFinance
			.forEach(x => secondaryLoans += x.loanAmount)
		const mortgages = economicValues.maximumLoanDollars + secondaryLoans

		const chartData = [
			[ '', 'Amount' ],
			[ this.translate.instant('chart.totalMoney.mortgages'), Math.round(mortgages) ],
			[ this.translate.instant('chart.totalMoney.cashdown'), Math.round(economicValues.downPaymentAmount) ],
			[ this.translate.instant('chart.totalMoney.acquisitionFees'), Math.round(economicValues.acquisitionCosts) ]
		]

		let sumValues = 0
		chartData.forEach((c, i) => {
			if (i === 0) { return }
			sumValues += c[1]
			if (c[1] < 0) {
				console.warn(`[Chart] ${c[0]} is negative! It won't be shown on pie chart`)
				c[1] = 0
			}
		})
		this.showChart = sumValues >= 0

		if (!this.showChart) {
			console.warn('Hiding chart because the sum of all values are negative or zero')
		}

		this.chartData = {
			id: 'totalDebtChart',
			valueUnit: '$',
			graphData: chartData.map((data, index) => {
				if (index) {
					return {
						title: data[0],
						value: data[1],
						color: index === 1 ? '#5CB09F' : index === 2 ? '#227967' : '#024134'
					}
				}
			}).filter(i => i)
		}

		// chart options
		const options = {
			fontSize: 14,
			pieHole: 0.1,
			chartArea: {
				width: '80%',
				top: 30
			},
			legend: {
				position: 'left',
				alignment: 'left',
				textStyle: {
					color: '#000000',
					fontSize: 12
				}
			},
			colors: ['#349E89', '#E2BC4E', '#BDBDB0', '#7C6977', '#F28500', '#607764', '#A68A6F', '#975FA6', '#ECD359']
		}
	}

}
