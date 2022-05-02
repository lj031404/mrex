import { Injectable } from '@angular/core';
import { UserService } from '@app/core/localDB/user.service';
import { TranslateService } from '@ngx-translate/core';

export const PlanLevels = {
	BASIC: 'basic',
	VERIFIED: 'verified',
	PREMIUM: 'premium',
	PRO: 'professional',
}

export const Plans: Array<{
	weight: number;
	value: string;
	label: string;
}> = [
	{ value: 'basic', weight: 1, label: 'Basic' },
	{ value: 'verified', weight: 2, label: 'Verified' },
	{ value: 'premium', weight: 3, label: 'Premium' },
	{ value: 'professional', weight: 4, label: 'Professional' }
]

export const Rules = {
	'watchlist_items': ['Basic', 'Verified', 'Premium', 'Professional'],
	'modeling_per_property': ['Basic', 'Verified', 'Premium', 'Professional'],
	'watchlist.financing': ['Verified', 'Premium', 'Professional'],
	'watchlist.futureParameters': ['Verified', 'Premium', 'Professional'],
	'watchlist.capex': ['Verified', 'Premium', 'Professional'],
	'watchlist.opex': ['Verified', 'Premium', 'Professional'],
	'watchlist.secondFinancing': ['Verified', 'Premium', 'Professional'],
	'watchlist.refinancing': ['Verified', 'Premium', 'Professional'],

	'market.makeOffer': ['Verified', 'Premium', 'Professional'],

	'off_market_listings': ['Verified', 'Premium', 'Professional'],
}

interface MinimumRequiredPlan {
	upgradeRequired: boolean
	requiredPlan: string
	requiredPlanLabel: string
	currentPlan: string
	currentPlanLabel: string
}

@Injectable({
	providedIn: 'root'
})
export class PlansService {

	constructor(private userService: UserService, private translate: TranslateService) {
	}

	// Given a user plan and a list of plans, it will return the minimum plan required
	// or an empty string if all conditions are filled
	async minimumRequiredPlan(ruleId: string, itemId: string | null = null): Promise<MinimumRequiredPlan> {

		const user: any = await this.userService.getUserInfo()
		const currentPlan = user.subscription.plan
		const plans = Rules[ruleId] || [ PlanLevels.BASIC ]

		const currentPlanLabel = this.translate.instant(`plans.${currentPlan}`)

		// Get the required plans
		const currentPlanWeight = Plans.find(x => x.value === currentPlan.toLowerCase()).weight

		const requiredPlans = plans.map(plan => ({
			value: plan.toLowerCase(),
			weight: Plans.find(item => item.value === plan.toLowerCase()).weight,
			label: Plans.find(item => item.value === plan.toLowerCase()).label,
		}))

		const _requiredUpgrade = requiredPlans.find(plan => plan.weight > currentPlanWeight)
		const requiredPlan = _requiredUpgrade && _requiredUpgrade.label || ''

		const requiredPlanLabel = this.translate.instant(`plans.${requiredPlan}`)

		// Check if we're under usage quotas
		if (user.usage && user.usage[ruleId] !== undefined) {
			const usage = Number(itemId ? user.usage[ruleId][itemId] || 0 : user.usage[ruleId])
			const limit = Number(user.subscription.limits && user.subscription.limits[ruleId])
			const upgradeRequired = usage >= limit
			upgradeRequired ?
				console.warn(`Usage (${usage}) is over limit ${limit} for ${ruleId} with plan ${currentPlan}`) :
				console.log(`Usage (${usage}) is under limit ${limit} for ${ruleId} with plan ${currentPlan}`)
			return { upgradeRequired, requiredPlan, requiredPlanLabel, currentPlan, currentPlanLabel }
		}

		// the rule isnt't related to usage but just to the plan level
		else {
			console.warn(`Plan level ${currentPlan} allows the action`)
			const upgradeRequired = !requiredPlans.map(x => x.value).includes(currentPlan.toLowerCase())
			return { upgradeRequired, requiredPlan, requiredPlanLabel, currentPlan, currentPlanLabel }
		}

	}

}
