export namespace RouterMap {

	function fullUrl(path: string, segments: string[]) {
		return `/${path}/${segments.join('/')}`
	}

	export namespace Articles {
		export const path = 'articles'
		export const
			ARTICLES = 'articles',
			PROPERTY = 'articles/:id'
		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Video {
		export const path = 'video'
		export const
			ARTICLES = 'video',
			PROPERTY = 'video/:id',
			VIDEOS = 'videos'
		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Videos {
		export const path = 'videos'
		export const all = 'all'
		export const playlist = 'playlist'
		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Playlist {
		export const path = 'playlist'
		export const playlist = 'playlist/:id'
		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Home {
		export const path = 'home'
		export const
			HOME = 'home'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Portfolio {
		export const path = 'portfolio'
		export const
			SUMMARY = 'summary',
			PROPERTIES = 'properties',
			PROPERTY = 'properties/:id',
			NEW = 'new',
			NEW2 = 'new2',
			EDIT = 'edit',
			UPDATE = 'update',
			EDIT_PORTFOLIO = 'edit/:portfolioId',
			UPDATE_PORTFOLIO = 'update/:portfolioId'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Watchlist {
		export const path = 'watchlist'
		export const
			OVERVIEW = 'overview',
			MAP = 'map',
			MODELING = 'modeling',
			MODEL = ':modelId',
			COMPARE = 'compare',
			ACTIVITY = 'activity'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Signin {
		export const path = 'login'
	}

	export namespace Signup {
		export const path = 'signup'
		export const
			STEP1 = 'step1',
			STEP2 = 'step2',
			STEP3 = 'step3'
	}

	export namespace OAuthSignup {
		export const path = 'oauthSignup'
		export const
			STEP1 = 'step1',
			STEP2 = 'step2'
	}

	export namespace PasswordForgot {
		export const path = 'forgot'
	}

	export namespace InvestorProfile {
		export const path = 'investor-profile'

		export function url() {
			return '/investor-profile'
		}
	}

	export namespace Market {
		export const path = 'market'
		export const
			OVERVIEW = 'overview',
			MAP = 'map',
			MAPBOX = 'mapbox',
			LIST = 'list',
			DETAIL = 'detail',
			PROPERTIES = 'properties',
			SALES_COMPS = 'comparables',
			PROPERTY = 'properties/:propertyId',
			SALES_COMPARISON = 'properties/:propertyId/comparables',
			ADVANCED_SALES_COMPARISON = 'properties/:propertyId/comparables/:comparablePropertyId',
			SAVED = 'saved',
			NOTE = 'properties/:propertyId/note',
			ADD_NOTE = 'note',
			GMAP = 'gmap'
			
		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace College {
		export const path = 'college'
		export const
			HOME = 'overview',
			COURSES = 'courses',
			COURSE = 'courses/:courseId'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Subscription {
		export const path = 'subscription'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Settings {
		export const path = 'settings'
		export const
			PROFILE = 'profile',
			PREFERENCES = 'preferences',
			PAYMENT = 'payment',
			BUY_CREDITS = 'buy-credits',
			SUBSCRIPTIONS = 'subscriptions',
			REPORT = 'report',
			ABOUT = 'about',
			PRIVACY = 'privacy',
			TERM_OF_USE = 'tos',
			ORDER_CONFIRM = 'order-confirm'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Help {
		export const path = 'help'
	}

	export namespace Search {
		export const path = 'search'
		export const
			HOME = 'search'

		export function url(segments: string[]) {
			return fullUrl(path, segments)
		}
	}

	export namespace Mocked {
		export const path = 'components'
	}

}
