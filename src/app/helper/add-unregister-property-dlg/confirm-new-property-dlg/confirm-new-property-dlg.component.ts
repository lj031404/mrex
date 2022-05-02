import { Component, OnInit, Input } from '@angular/core';
import { ModalRef } from '@app-models/modal-ref'

@Component({
  selector: 'app-confirm-new-property-dlg',
  templateUrl: './confirm-new-property-dlg.component.html',
  styleUrls: ['./confirm-new-property-dlg.component.scss']
})
export class ConfirmNewPropertyDlgComponent implements OnInit {
  @Input() modalRef: ModalRef
  @Input() data

  constructor() { }

  ngOnInit() {
  }

  addAnotherOffMarket() {
    this.modalRef.closeModal()
  }

  back() {
    this.modalRef.closeModal()
  }

  directTo(route) {
    this.modalRef.closeModal({route})
  }

}
