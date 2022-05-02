export class NotificationInterface {
	constructor(
		public id: number,
		public imageUrl: string,
		public title: any,
		public message: any,
		public delay: number
	) { }
}
