import { ModelProperty, PortfolioPropertyCreate } from '@app/api_generated';
import { ReceiveOfferStatus } from '@app/api_generated'

export enum PortfolioPropertyStatus {
	public_sale = 'portfolio.card.public_sale',
	open_offer = 'portfolio.card.open_offer'
}

export interface PortfolioInterface extends ModelProperty {
	id: string
	imageUrl?: string
	price: number
	address: any
	_id?: string
	propertyStatus: PortfolioPropertyStatus,
	receiveOfferStatus?: ReceiveOfferStatus
}

export interface Portfolio extends PortfolioPropertyCreate {
	_id?: string
	footageWidth?: number;
	footageHeight?: number;
}

export interface PortfolioDoc extends Portfolio {
	portfolioData: Portfolio
	localUpdateTime: number
	_id?: string

	// Loki stuff
	$loki?: number
	meta?: {
		revision: number
		created: number
		version: number
	}
}

export enum ReceiveOfferStatusType {
	OpenToReceiveOffers = 'literals.receive_offer_status.OpenToReceiveOffers',
	NotOpenToReceiveOffers = 'literals.receive_offer_status.NotOpenToReceiveOffers',
	ForSalePublicly = 'literals.receive_offer_status.ForSalePublicly'
}
