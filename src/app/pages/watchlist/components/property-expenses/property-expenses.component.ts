import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { HypothesisLocal } from '@app/core/models/hypothesis.interface'
import { PropertyLocalData } from '@app/core/models/property.interface'
import { PieChart } from '@app-models/chart.interface';

declare var google: any

@Component({
	selector: 'app-property-expenses',
	templateUrl: './property-expenses.component.html',
	styleUrls: ['./property-expenses.component.scss']
})
export class PropertyExpensesComponent implements OnInit {

	@Input() property: PropertyLocalData
	@Input() hypothesis: HypothesisLocal

	chartData: PieChart
	constructor(private translate: TranslateService) {}

	ngOnInit() {
		this.drawDonut()
	}

	drawDonut() {

		const hypothesis = this.hypothesis

		const totalTaxes = hypothesis.input.totalTaxes ?
							hypothesis.input.totalTaxes :
							hypothesis.input.municipalTaxes + hypothesis.input.schoolTaxes

		const totalUtilities = hypothesis.input.totalUtilities ?
								hypothesis.input.totalUtilities :
								hypothesis.input.electricity + hypothesis.input.naturalGas

		const chartData = [
			[ this.translate.instant('chart.expenses'), 'Amount' ],
			// [ this.translate.instant('chart.municipalTaxes'), this.hypothesis.input.municipalTaxes ],
			// [ this.translate.instant('chart.schoolTaxes'), this.hypothesis.input.schoolTaxes ],
			[ this.translate.instant('chart.taxes'), +totalTaxes.toFixed(2), '#5CB09F' ],
			// [ this.translate.instant('chart.electricity'), this.hypothesis.input.electricity, '#975FA6' ],
			// [ this.translate.instant('chart.naturalGas'), this.hypothesis.input.naturalGas, '#ECD359' ],
			[ this.translate.instant('chart.utilities'), +totalUtilities.toFixed(2), '#CCCCCC' ],
			[ this.translate.instant('chart.insurance'), +hypothesis.input.insurance.toFixed(2), '#36FAD1' ],
			[ this.translate.instant('chart.maintenance'), +hypothesis.output.expenses.maintenanceFees.toFixed(2), '#000000' ],
			[ this.translate.instant('chart.salaries'), +hypothesis.output.expenses.totalSalaries.toFixed(2), '#227967' ],
			[ this.translate.instant('chart.management'), +hypothesis.output.expenses.managementFees.toFixed(2), '#024134' ],
			[ this.translate.instant('chart.otherExpenses'), +hypothesis.input.otherExpenses.toFixed(2), '#A68A6F' ]
		]

		this.chartData = {
			id: 'expensesNormalized',
			valueUnit: '',
			graphData: chartData.map((data, index) => {
				if (index) {
					return {
						title: data[0],
						value: data[1],
						color: data[2]
					}
				}
			}).filter(i => i)
		}
	}

}
