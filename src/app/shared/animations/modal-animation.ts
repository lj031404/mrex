import { animate, state, style, transition, trigger } from '@angular/animations';

export const modalFade =
	trigger('modalFade', [
		transition(':enter', [
			style({
				opacity: 0.6,
				transform: 'translateY(80px)'
			}),
			animate('200ms ease-out', style({
				opacity: 1,
				transform: 'translateY(0)'
			}))
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateY(0)'
			}),
			animate('200ms ease-out', style({
				opacity: 0,
				transform: 'translateY(80px)'
			}))
		])
	]);

export const modalSlide =
	trigger('modalSlide', [
		transition('* => opened', [
			style({
				opacity: 0.6,
				transform: 'translateX(250px)'
			}),
			animate('200ms ease-out', style({
				opacity: 1,
				transform: 'translateX(0)'
			}))
		]),
		transition('opened => closing', [
			style({
				opacity: 1,
				transform: 'translateX(0)'
			}),
			animate('200ms ease-out', style({
				opacity: 0,
				transform: 'translateX(250px)'
			}))
		])
	]);

