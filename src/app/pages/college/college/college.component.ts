import { Component, OnInit } from '@angular/core';
import { CourseCard } from '@app/core/models/course.interface';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
	selector: 'app-college',
	templateUrl: './college.component.html',
	styleUrls: ['./college.component.scss']
})
export class CollegeComponent implements OnInit {

	cardData: CourseCard[]
	constructor(private theInAppBrowser: InAppBrowser) { }

	ngOnInit() {
		this.cardData = [
			{
				imgUrl: './assets/images/course/vector-searching.jpg',
				subject: 'college.course.bases.subject',
				summary: 'college.course.bases.summary',
				photo: './assets/images/course/instructor/frederic-bernier.png',
				instructor: 'Frédéric Bernier',
				price: '$ 247 / a',
				link: 'https://www.formationenlignemrex.com/p/prospection'
			},
			{
				imgUrl: './assets/images/course/business-man.jpg',
				subject: 'college.course.staged.subject',
				summary: 'college.course.staged.summary',
				photo: './assets/images/course/instructor/mathieu-leclerc.jpg',
				instructor: 'Mathieu Leclerc',
				price: '$ 247 / a',
				link: 'https://www.formationenlignemrex.com/p/processus-d-acquisition-par-etapes-l-offre-initiale-la-verification-diligente-l-acte-notariee'
			},
			{
				imgUrl: './assets/images/course/financial-math.jpg',
				subject: 'college.course.math.subject',
				summary: 'college.course.math.summary',
				instructor: '1 group of courses',
				price: '$ 271 / a',
				link: 'https://www.formationenlignemrex.com/p/mathematiques-financieres-de-l-investissement-immobilier1'
			},
			{
				imgUrl: './assets/images/course/financial-math.jpg',
				subject: 'college.course.mathceo.subject',
				summary: 'college.course.mathceo.summary',
				photo: './assets/images/course/instructor/nikolai-ray-ceo-mrex.jpg',
				instructor: 'Nikolaï Ray',
				price: '$ 247 / a',
				link: 'https://www.formationenlignemrex.com/p/mathematiques-financieres-de-l-investissement-immobilier'
			},
			{
				imgUrl: './assets/images/course/arbitration.jpg',
				subject: 'college.course.arbitration.subject',
				summary: 'college.course.arbitration.summary',
				photo: './assets/images/course/instructor/nikolai-ray-ceo-mrex.jpg',
				instructor: 'Nikolaï Ray',
				price: '$ 247 / a',
				link: 'https://www.formationenlignemrex.com/p/principes-d-arbitrage-et-creation-de-valeur-en-immobilier-multilogements'
			},
			{
				imgUrl: './assets/images/course/microprogram.jpg',
				subject: 'college.course.micro.subject',
				summary: 'college.course.micro.summary',
				instructor: '9 cours',
				price: '$ 2950',
				link: 'https://www.formationenlignemrex.com/p/preparation-au-cmfe'
			},
			{
				imgUrl: './assets/images/course/multifamily.jpg',
				subject: 'college.course.introductory.subject',
				summary: 'college.course.introductory.summary',
				photo: './assets/images/course/instructor/nikolai-ray-ceo-mrex.jpg',
				instructor: 'Nikolaï Ray',
				price: '$ 24',
				link: 'https://www.formationenlignemrex.com/p/journee-introduction-immobilier-multilogement'
			},
			{
				imgUrl: './assets/images/course/quality-income.jpg',
				subject: 'college.course.quality.subject',
				summary: 'college.course.quality.summary',
				photo: './assets/images/course/instructor/nikolai-ray-ceo-mrex.jpg',
				instructor: 'Nikolaï Ray',
				price: '$ 79',
				link: 'https://www.formationenlignemrex.com/p/la-qualite-du-revenu-brut'
			},
		]
	}

	gotoLink(link: string) {
		this.theInAppBrowser.create(link, '_system')
		return true;
	}

}
