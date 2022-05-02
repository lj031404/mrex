import stringSimilarity from 'string-similarity'

/*
* Refer to: http://www.calculconversion.com/calcul-taxe-de-bienvenue-mutation.html
*/
export namespace ISOCODES {
	export namespace CA {
		export namespace QC {
			export const ISOCODE = 'CA_QC'
			export const OTHER = {
				51700: 0.005,
				258600: 0.01,
				258600.01: 0.015
			}
			export const ALMA = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const BOISBRIAND = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const BOUCHERVILLE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.02
			}
			export const BROSSARD = {
				51700: 0.005,
				258600: 0.01,
				750000: 0.015,
				1000000: 0.02,
				1000000.01: 0.03
			}
			export const CHAMBLY = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.025
			}
			export const CHATEAUGUAY = {
				51700: 0.005,
				258600: 0.01,
				505200: 0.015,
				505200.01: 0.03
			}
			export const DRUMMONDVILLE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.025
			}
			export const FARNHAM = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.0225
			}
			export const KIRKLAND = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				1000000: 0.02,
				1000000.01: 0.025
			}
			export const LASSOMPTION = {
				51700: 0.005,
				258600: 0.01,
				508700: 0.015,
				508700.01: 0.03
			}
			export const LAVAL = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				1000000: 0.02,
				1000000.01: 0.025
			}
			export const LEVIS = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const LONGUEIL = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const LORRAINE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const MASCOUCHE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const MCMASTERVILLE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const MONTSAINTHILAIRE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const MONTREAL = {
				51700: 0.005,
				258600: 0.01,
				508700: 0.015,
				1017400: 0.02,
				1017400.01: 0.025
			}
			export const MONTTREMBLANT = {
				51700: 0.005,
				258600: 0.01,
				517100: 0.015,
				1034200: 0.02,
				1034200.01: 0.025
			}
			export const MORINHEIGHTS = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.025
			}
			export const OTTERBURNPARK = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				750000: 0.02,
				1000000: 0.025,
				1000000.01: 0.03
			}
			export const REPENTIGNY = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const RIMOUSKI = {
				51700: 0.005,
				258600: 0.01,
				505100: 0.015,
				757700: 0.02,
				1010300: 0.025,
				1010300.01: 0.03
			}
			export const SAINTCOLOMBAN = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const SAINTEUSTACHE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.025
			}
			export const SAINTJEANSURRICHELIEU = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const SAINTLAMBERT = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				1000000: 0.02,
				1000000.01: 0.025
			}
			export const SAINTSAUVEUR = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const SHERBROOKE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const SORELTRACY = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				700000: 0.02,
				900000: 0.025,
				900000.01: 0.03
			}
			export const TERREBONNE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const TROISRIVIERE = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				500000.01: 0.03
			}
			export const VALDAVID = {
				51700: 0.005,
				258600: 0.01,
				500000: 0.015,
				750000: 0.02,
				1000000: 0.025,
				1000000.01: 0.03
			}
		}
	}
}

export class PropertyTransferTaxQuebec {
	normalizedCity: string

	constructor(city) {
		this.normalizedCity = this.getNormalizedCity(city)
	}

	private getNormalizedCity(city) {
		const normalizedCity = city.normalize('NFD')
			.toUpperCase()
			.replace(/'/g, '')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/ST-/g, 'SAINT')
			.replace(/-/g, '')
			.replace(/ /g, '')

		const cities = Object.keys(ISOCODES.CA.QC)
		const matches = stringSimilarity.findBestMatch(normalizedCity, cities)

		if (matches.bestMatch && matches.bestMatch.rating > 0.9) {
			return matches.bestMatch.target
		}
		else {
			return 'OTHER'
		}
	}

	private _getCityParams() {
		return ISOCODES.CA.QC[this.normalizedCity] || ISOCODES.CA.QC['OTHER']
	}

	calc(amount) {
		const slices = this._getCityParams()
		let sum = 0
		let previousSlice = 0
		Object.keys(slices)
			.map(Number)
			.map(x => ({ slice: x, rate: slices[x] }))
			.map((x, i) => {
					let diff = 0, rate, calc

					if (amount >= previousSlice) {
						if (i === (Object.keys(slices).length - 1)) {
							diff = Math.abs(amount - previousSlice)
						}
						else if (amount > x.slice) {
							diff = Math.abs(x.slice - previousSlice)
						}
						else if (amount > previousSlice) {
							diff = Math.abs(amount - previousSlice)
						}

						rate = x.rate
						calc = diff * rate
						sum += calc

						previousSlice = x.slice
					}

				})
		return sum
	}
}
