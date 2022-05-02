import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { NGXLogger } from 'ngx-logger'

import enUS from '../../../translations/en-US.json';
import frCA from '../../../translations/fr-CA.json';
import { UserSettingsMiddlewareService } from '@app-middleware/user-settings-middleware.service';

@Injectable()
export class I18nService {

	defaultLanguage!: string
	supportedLanguages!: string[]

	private langChangeSubscription!: Subscription

	constructor(
		private translateService: TranslateService,
		private logger: NGXLogger
	) {
		// Embed languages to avoid extra HTTP requests
		translateService.setTranslation('en-US', enUS)
		translateService.setTranslation('fr-CA', frCA)
	}

	/**
     * Initializes i18n for the application.
     * Loads language from local storage if present, or sets default language.
     * @param defaultLanguage The default language to use.
     * @param supportedLanguages The list of supported languages.
     */
	init(defaultLanguage: string, supportedLanguages: string[]) {
		this.defaultLanguage = defaultLanguage
		this.supportedLanguages = supportedLanguages

		this.language = defaultLanguage
	}

	/**
     * Cleans up language change subscription.
     */
	destroy() {
		this.langChangeSubscription.unsubscribe()
	}

	/**
     * Sets the current language.
     * Note: The current language is saved to the local storage.
     * If no parameter is specified, the language is loaded from local storage (if present).
     * @param language The IETF language code to set.
     */
	set language(language: string) {
		language = language || this.translateService.getBrowserCultureLang()
		let isSupportedLanguage = this.supportedLanguages.includes(language)

		// If no exact match is found, search without the region
		if (language && !isSupportedLanguage) {
			language = language.split('-')[0]
			language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || ''
			isSupportedLanguage = Boolean(language)
		}

		// Fallback if language is not supported
		if (!isSupportedLanguage) {
			language = this.defaultLanguage
		}

		console.log(`Language set to ${language}`)
		this.translateService.use(language)
	}

	/**
     * Gets the current language.
     * @return The current language code.
     */
	get language(): string {
		return this.translateService.currentLang
	}

}
