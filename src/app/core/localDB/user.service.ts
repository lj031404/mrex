import { Injectable } from '@angular/core';
import { User, UsersService as UsersApiService, Coordinate } from '@app/api_generated';
import { LokijsService } from './lokijs.service';
import { Collection } from 'lokijs';
import { GlobalService } from '../services/global.service';
import { GeolocationService, Position } from '@app/shared/services/geolocation.service';

export interface UserDoc extends User {
	// Loki stuff
	$loki?: number
	meta?: {
		revision: number
		created: number
		version: number
	}
}

export interface SettingsDoc {
	data: any

	// Loki stuff
	$loki?: number
	meta?: {
		revision: number
		created: number
		version: number
	}
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private dbHandler: Collection
	private dbHandlerSettings: Collection

	constructor(
		private usersApiService: UsersApiService,
		private loki: LokijsService,
		private globalService: GlobalService,
		private geolocationService: GeolocationService
	) {
		this.dbHandler = this.loki.db.addCollection('user')
		this.dbHandlerSettings = this.loki.db.addCollection('settings')
	}

	save(userInfo: User): UserDoc {
		const doc = this.dbHandler.get(1)
		if (doc) {
			return this.dbHandler.update({ ...doc, ...userInfo })
		}
		else {
			return this.dbHandler.insert(userInfo)
		}
	}

	async reportPosition() {
		try {
			const position: Position = await this.geolocationService.getPosition()
			const coordinate: Coordinate = [position.longitude, position.latitude]
			const user = this.getUserInfo()
			await this.usersApiService.updateUser({ coordinate } as User, user.id).toPromise()
		}
		catch (err) {
			throw new Error(`Failed to report position. User will not see localized data. Reason: ${err}`)
		}
	}

	async pullUser(): Promise<UserDoc> {
		const user = await this.usersApiService.getUser().toPromise()
		user.deviceInfo = this.globalService.getDeviceInfo()
		return this.save(user)
	}

	async pushUser(user): Promise<void> {
		await this.usersApiService.updateUser(user, user.id).toPromise()
	}

	getUserInfo(): UserDoc {
		return this.dbHandler.get(1)
	}

	// Get user settings
	getUserSettings() {
		return this.dbHandlerSettings.get(1)
	}

	// Save user settings
	updateUserSettings(data: any): SettingsDoc {
		const settings = this.dbHandlerSettings.get(1)
		settings.data = { ...settings.data, ...data }
		return this.dbHandlerSettings.update({ settings })
	}

}
