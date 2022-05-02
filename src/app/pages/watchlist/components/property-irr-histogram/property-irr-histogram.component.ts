import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { HypothesisLocal } from '@app/core/models/hypothesis.interface'
import { PropertyLocalData } from '@app/core/models/property.interface'

declare var google: any

@Component({
  selector: 'app-property-irr-histogram',
  templateUrl: './property-irr-histogram.component.html',
  styleUrls: ['./property-irr-histogram.component.scss']
})
export class PropertyIrrHistogramComponent implements OnInit {

	@Input() propertyDoc: PropertyLocalData

	@ViewChild('chart-irr', { static: true }) chartElement: any

	constructor(private translate: TranslateService) { }

	ngOnInit() {
		this.initChart()
	}

	initChart() {
		google.load('visualization', '1.0', { 'packages': ['corechart'] })
		google.setOnLoadCallback(this.drawHistogram.bind(this))
	}

	drawHistogram() {
		const hypothesis = this.propertyDoc.hypothesisData

		const financingCompany = hypothesis.input.financingCompany
		const economicValues = hypothesis.output.economicValues
								.find(x => x.financingCompany === financingCompany)

		const preTaxIRR = isNaN(hypothesis.output.profitability[0].preTaxIRR) ? 0 : hypothesis.output.profitability[0].preTaxIRR
		const cashOnCashRate = isNaN(hypothesis.output.summaryOverview.cashOnCashRate) ? 0 : hypothesis.output.summaryOverview.cashOnCashRate
		const caprate = economicValues.askingCapRate

		const colorCode = '#349E89'

		const chartData = [
			[ '', '' ],
			[ this.translate.instant('chart.caprate'), +(caprate.toFixed(4)) ],
			[ this.translate.instant('chart.coc'), 	  Math.round(10 * (cashOnCashRate * 100)) / 10 / 100 ],
			[ this.translate.instant('chart.irr'), Math.round(10 * (preTaxIRR * 100)) / 10 / 100 ],
			// [ this.translate.instant('chart.coc_cap'), hypothesis.output.summaryOverview.principal ],
		]

		const data = google.visualization.arrayToDataTable(chartData)

		const formatPct = new google.visualization.NumberFormat({
			pattern: '#,##0.00 %'
		})

		// format y
		for (let colIndex = 1; colIndex < data.getNumberOfColumns(); colIndex++) {
			formatPct.format(data, colIndex);
		}

		// chart options
		const options = {
			fontSize: 14,
			chartArea: {
				width: '60%',
				top: 30
			},
			legend: {
				position: 'none'
			},
			colors: [ colorCode ]
		}

		const view = new google.visualization.DataView(data);
			view.setColumns([0, 1,
						{ calc: 'stringify',
							sourceColumn: 1,
							type: 'string',
							role: 'annotation' },
						]);

		// Instantiate and draw our chart, passing in some options.
		try {
			const chart = new google.visualization.ColumnChart(document.getElementById('chart-irr'))
			chart.draw(view, options)
		}
		catch (err) {}
	}

}
