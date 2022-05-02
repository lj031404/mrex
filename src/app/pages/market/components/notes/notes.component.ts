import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { ModalRef } from '@app-models/modal-ref';

import { MarketService as ApiMarketService } from '@app/api_generated/api/market.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterMap } from '@app/core/utils/router-map.util';
import { MarketMiddlewareService } from '@app/api-middleware/market-middleware.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnDestroy {

  @Input() modalRef: ModalRef
  @Input() notes: string = ''
  @Input() propertyId: string
  @Input() isAdd = true
  subScription: Subscription = new Subscription()

  constructor(
    private apiMarketService: ApiMarketService,
    private spinnerService: SpinnerService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private marketMiddleware: MarketMiddlewareService,
    private changeDetectorRef: ChangeDetectorRef,
    
  ) {
    router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			filter((event: NavigationEnd) => event.url.includes(`?notes`)),
		).subscribe(() => {
        
      this.propertyId = this.route.snapshot.paramMap.get('propertyId')
      this.notes = this.route.snapshot.queryParamMap.get('notes')

      this.isAdd = !this.notes
      
			this.changeDetectorRef.detectChanges()
		})
  }

  addNotes() {
    this.spinnerService.show()
    this.spinnerService.text = ''
    this.apiMarketService.updateListingNote({
      note: this.notes
    }, this.propertyId).subscribe(res => {
      this.layoutService.openSnackBar(this.translate.instant('pages.market.note.added_successfully'), null, 5000, 'info')
      this.spinnerService.hide()
      this.marketMiddleware.marketNoteChange$.next(this.notes)

      this.router.navigate([RouterMap.Market.path, RouterMap.Market.PROPERTIES, this.propertyId])

    }, error => {
      this.spinnerService.hide()
      if (error.status >= 400) {
        this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
      }
    })
  }

  ngOnDestroy() {
    this.subScription.unsubscribe()
  }

  back = () => {
    this.modalRef.closeModal()
	}
}
