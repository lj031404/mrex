import { Hypothesis, HypothesisInput } from '@app/api_generated';

export interface HypothesisLocal extends Hypothesis {
	_id?: string
}

export interface HypothesisInputLocal extends HypothesisInput {
	_id?: string
}
