import { UnitType } from '@app-models/unit.enum';

export interface Indicator {
	value?: number;
	unit?: UnitType;
	trendValue?: number;
	trendUnit?: UnitType;
}
