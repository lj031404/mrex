export interface XYLineChart {
	title: string;
	isShowBeta: boolean;
	graphData: Array<{
		value: number;
		year: string;
		betaData?: any;
		betaData1?: any;
	}>,
	valueUnit: string;
	id: string;
}

export interface LineAreaChart {
	id: string;
	title?: string;
	valueUnit: string;
	categoryField: string;
	valueFieldData: Array<{
		name: string;
		color: string;
		title: string;
	}>;
	graphData: Array<{
		lineColor?: string;
		fieldName?: string;
		value?: number;
		categoryField?: string;
		date?: string;
	}>;
}

export interface StackChart {
	id: string;
	title?: string;
	valueUnit: string;
	categoryField: string;
	graphData: any[];
	valueFieldData: Array<{
		name: string;
		color: string;
		title: string;
	}>;
}

export interface PieChart {
	id: string;
	title?: string;
	valueUnit: string;
	graphData: Array<{
		title: string,
		value: number,
		color?: string
	}>;
	colors?: string[]
}

export interface XYFillLineChart {
	title: string;
	isShowBeta: boolean;
	graphData: Array<{
		lineTop: number;
		lineDown: number;
		value: number;
		year: string;
	}>,
	valueUnit: string;
	id: string;
}