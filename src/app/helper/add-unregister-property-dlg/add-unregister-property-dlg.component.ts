import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalRef } from '@app-models/modal-ref'
import { TranslateService } from '@ngx-translate/core';
import { AssistanceService, UploadService } from '@app/api_generated';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { catchError, flatMap, take } from 'rxjs/operators';
import { FileCategory } from '@app/api_generated/model/fileCategory';
import { ConfirmNewPropertyDlgComponent } from './confirm-new-property-dlg/confirm-new-property-dlg.component';
import { LayoutService } from '@app/layout/service/layout.service'
import { of } from 'rxjs';
import { PropertyPendingService } from '@app-services/property-pending.service';
import { PropertyPendingEvent } from '@app-models/propertyPendingEvent.enum'

@Component({
  selector: 'app-add-unregister-property-dlg',
  templateUrl: './add-unregister-property-dlg.component.html',
  styleUrls: ['./add-unregister-property-dlg.component.scss']
})
export class AddUnregisterPropertyDlgComponent implements OnInit {
  @Input() modalRef: ModalRef
  @Input() data: any = {}
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef

  address: {
    description: string,
    place_id: string
  };
  addressStr: string
  documents: Array<{
    filename: string,
    id: string,
    isUploading: boolean,
    lastModified: number
  }> = [];
  isUploadFile: boolean
  
  constructor(
    private translate: TranslateService,
    private uploadService: UploadService,
    private spinnerService: SpinnerService,
    private assistanceService: AssistanceService,
    private layoutService: LayoutService,
    private propertyPendingService: PropertyPendingService
  ) { }

  ngOnInit() {
  }

  back() {
    this.modalRef.closeModal()
  }

  addressClick(evt) {
    console.log(evt)
    this.address = evt;

  }
  onUpdatePlace(evt) {

  }

  uploadDocumentClose() {
    this.modalRef.closeModal(this.documents)
  }

  uploadFile(evt: any) {
    const fileInformation = evt.target.files[0]
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileInformation)
    reader.onload = async () => {
      this.isUploadFile = true;
      this.documents = this.documents.concat({
        filename: fileInformation.name,
        id: null,
        isUploading: true,
        lastModified: fileInformation.lastModified
      })

      try {
        const { fileUrl, id } = await this.uploadService.uploadFileForm(
          new File([reader.result], fileInformation.name, { type: fileInformation.type }),
          FileCategory.PropertyDocuments,
          fileInformation.name
          ).toPromise()
          this.documents.find(document => document.lastModified === fileInformation.lastModified).id = id
          this.documents.find(document => document.lastModified === fileInformation.lastModified).isUploading = false
          this.isUploadFile = false;
    
        } catch (error) {
          this.isUploadFile = false;
          this.documents.find(document => document.lastModified === fileInformation.lastModified).id = null
          this.documents.find(document => document.lastModified === fileInformation.lastModified).isUploading = false
          this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')
      }
    }

  }

  registerNewProperty() {
    const registerPropertyRequest = {
      address: this.address.description,
      placeId: this.address.place_id,
      documents: this.documents.filter(doc => doc.id).map(doc => ({
        fileId: doc.id
      })),
      requestType: this.data.type
    }

    this.spinnerService.text=''
    this.spinnerService.show()

    this.assistanceService.registerNewProperty(registerPropertyRequest).pipe(
      take(1),
      flatMap((res) => {
        this.spinnerService.hide()

        this.addressStr = ''
        this.address = null
        this.documents = []

        this.propertyPendingService.sendEvent(PropertyPendingEvent.PendingPropertyCreated)
        
        return this.layoutService.openModal(ConfirmNewPropertyDlgComponent, {
          data: this.data
        }).closed$
      }),
      catchError(err => {
        this.spinnerService.hide()
        this.layoutService.openSnackBar(this.translate.instant('error.genericMessage'), null, 5000, 'error')

        return of(null)
      })
    )
    .subscribe(
      res => {
        if (res) {
          this.modalRef.closeModal()
        }
      }
    )
  }

  removeDocument(idx) {
    this.documents.splice(idx, 1)
    this.fileInput.nativeElement.value = ''
  }

}
