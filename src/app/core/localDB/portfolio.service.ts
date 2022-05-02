import { Injectable, EventEmitter } from '@angular/core';
import { PortfolioService as PortfolioApiService } from '@app/api_generated/api/portfolio.service'
import { BehaviorSubject } from 'rxjs';
import { Portfolio, PortfolioDoc } from '../models/portfolio.interface';
import { PortfolioFormConfig } from '@app/helper/portfolio-form-config';
import { PortfolioPropertyCreate, PortfolioPropertyShort, PortfolioSummary, UnregisteredProperty } from '@app/api_generated';
import { LokijsService } from './lokijs.service';
import { Collection } from 'lokijs';

const ONE_DAY = 86400000

@Injectable({
	providedIn: 'root'
})
export class PortfolioLocalService {

	public properties: PortfolioDoc[] = []                 // pre-loaded list or properties
	public properties$: EventEmitter<any> = new EventEmitter()  // emit an event when there is a property change
	public portfolioPropertyDetailData: Portfolio
	public portfolioPros: PortfolioPropertyShort[] = []

	isReady$ = new BehaviorSubject<boolean>(true)

	private dbHandler: Collection
	private dbHandlerPortfolioSummary: Collection
	private dbHandlerPendingPortfolio: Collection
	private dbHandlerDraftPortfolio: Collection

	constructor(
		private loki: LokijsService,
		private portfolioApiService: PortfolioApiService
	) {
		this.dbHandler = this.loki.db.addCollection('settings')
		this.dbHandlerPortfolioSummary = this.loki.db.addCollection('portfolioSummary')
		this.dbHandlerPendingPortfolio = this.loki.db.addCollection('pendingPortfolio')
		this.dbHandlerDraftPortfolio = this.loki.db.addCollection('draftPortfolio')
	}

	async saveFormData(formData: PortfolioFormConfig): Promise<PortfolioDoc> {
		const formConfig: PortfolioFormConfig = new PortfolioFormConfig(formData)
		const portfolio = formConfig.getData()

		// Save Property to API
		const operation = portfolio._id ? 'update' : 'insert'
		try {
			let apiResponse
			if (operation === 'insert') {
				delete portfolio._id
				apiResponse = await this.portfolioApiService.addPropertyToPortfolio(portfolio).toPromise()
				console.log('Portfolio has been added to API', apiResponse)
			} else {
				apiResponse = await this.portfolioApiService.updatePortfolioProperty(portfolio, portfolio._id || '').toPromise()
				console.log('Portfolio has been updated on API', apiResponse)
			}
			return this.save(apiResponse)
		}
		catch (err) {
			throw new Error(`Could not ${operation} Portfolio to API: ${err}`)
		}

	}

	// Save property locally
	save(property: PortfolioPropertyCreate & { _id?: string }): PortfolioDoc {
		const doc = this.getByPropertyId(property._id)
		if (doc) {
			return this.dbHandler.update({ ...doc, property, localUpdateTime: +new Date() })
		}
		else {
			return this.dbHandler.insert({ ...property, localUpdateTime: +new Date() })
		}
	}

	// Get a portfolio model, based on the _id given from API
	getByPropertyId(id: string): PortfolioDoc {
		return this.dbHandler.findOne({ _id: id })
	}

	async getPortfolioSummary(fetchApi = false): Promise<PortfolioSummary> {
		const doc = this.dbHandlerPortfolioSummary.get(1)

		if (fetchApi) {
			const apiResponse = await this.portfolioApiService.getPortfoliosSummary().toPromise()
			this.portfolioPros = apiResponse.properties
			if (doc) {
				return this.dbHandlerPortfolioSummary.update({ ...doc, ...apiResponse, localUpdateTime: +new Date() })
			}
			else {
				return this.dbHandlerPortfolioSummary.insert({ ...doc, localUpdateTime: +new Date() })
			}
		}
		else if (doc) {
			// Get from the API if more than 6 hours
			if ((+new Date() - doc.localUpdateTime) > ONE_DAY / 4) {
				const apiResponse = await this.portfolioApiService.getPortfoliosSummary().toPromise()
				this.portfolioPros = apiResponse.properties
				return this.dbHandlerPortfolioSummary.insert({ ...doc, apiResponse, localUpdateTime: +new Date() })
			}
			// Take the value in the DB
			else {
				this.portfolioPros = doc.properties
				return doc
			}
		}
		else {
			const apiResponse = await this.portfolioApiService.getPortfoliosSummary().toPromise()
			this.portfolioPros = apiResponse.properties
			return this.dbHandlerPortfolioSummary.insert({ ...doc, apiResponse, localUpdateTime: +new Date() })
		}
	}

	async getPortfolioPendingPortfolios(fetchApi = false): Promise<UnregisteredProperty[]> {
		const doc = this.dbHandlerPendingPortfolio.get(1)

		if (fetchApi) {
			const apiResponse = await this.portfolioApiService.getPendingPortfolios().toPromise()
			if (doc) {
				return this.dbHandlerPendingPortfolio.update({ ...doc, ...apiResponse, localUpdateTime: +new Date() })
			}
			else {
				return this.dbHandlerPendingPortfolio.insert({ ...doc, localUpdateTime: +new Date() })
			}
		}
		else if (doc) {
			// Get from the API if more than 6 hours
			if ((+new Date() - doc.localUpdateTime) > ONE_DAY / 4) {
				const apiResponse = await this.portfolioApiService.getPendingPortfolios().toPromise()
				return this.dbHandlerPendingPortfolio.insert({ ...doc, apiResponse, localUpdateTime: +new Date() })
			}
			// Take the value in the DB
			else {
				return doc
			}
		}
		else {
			const apiResponse = await this.portfolioApiService.getPendingPortfolios().toPromise()
			return this.dbHandlerPendingPortfolio.insert({ ...doc, apiResponse, localUpdateTime: +new Date() })
		}
	}

	async getPortfolioDraftPros(fetchApi = false): Promise<PortfolioPropertyCreate[]> {
		const doc = this.dbHandlerDraftPortfolio.get(1)

		if (fetchApi) {
			const apiResponse = await this.portfolioApiService.getDraftPortfolios().toPromise()
			if (doc) {
				return this.dbHandlerDraftPortfolio.update({ ...doc, ...apiResponse, localUpdateTime: +new Date() })
			}
			else {
				return this.dbHandlerDraftPortfolio.insert({ ...doc, localUpdateTime: +new Date() })
			}
		}
		else if (doc) {
			// Get from the API if more than 6 hours
			if ((+new Date() - doc.localUpdateTime) > ONE_DAY / 4) {
				const apiResponse = await this.portfolioApiService.getDraftPortfolios().toPromise()
				return this.dbHandlerDraftPortfolio.update({ ...doc, apiResponse, localUpdateTime: +new Date() })
			}
			// Take the value in the DB
			else {
				return doc
			}
		}
		else {
			const apiResponse = await this.portfolioApiService.getPendingPortfolios().toPromise()
			return this.dbHandlerDraftPortfolio.insert({ ...doc, apiResponse, localUpdateTime: +new Date() })
		}
	}


}


