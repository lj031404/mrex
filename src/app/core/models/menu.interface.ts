
export interface MenuItem {
	name: string;
	type?: MenuItemType;
	link?: string;
	iconName?: string;
	class?: string;
	scope: string;
}

export enum MenuItemType {
	HEADER = 'header',
	ITEM = 'item'
}
