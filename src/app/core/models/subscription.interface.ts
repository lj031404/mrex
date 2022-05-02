import { InlineResponse2002 } from '../../api_generated/model/inlineResponse2002'

export interface BillPlan extends InlineResponse2002 {
	isChecked?: boolean;
	metadataList?: MetaData[];
	planName?: string;
	description?: string;
	nickname?: string;
	metadata?: any;
	id?: any;
	amount?: any;
	interval?: string;
	interValText?: string;
}

interface MetaData {
	key: string;
	value: string;
	status?: string;
	planText?: string;
}
