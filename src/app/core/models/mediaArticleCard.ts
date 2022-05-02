import { VideoArticleListItem } from '@app/api_generated/model/videoArticleListItem'
export interface MediaArticleCard  {
	type?: MediaArticleType
	authorName?: string;
	publishDate?: Date | string;
	summary?: string;
	thumbnailUrl?: string;
	title?: string;
	_id?: string;
	id?: string;
	videoUrl?: string;
	htmlContent?: string;
	publicUrl?: string;
	author?: string;
	imageLoadErr?: boolean
}

export enum MediaArticleType {
	Video = 'video',
	Article = 'article'
}