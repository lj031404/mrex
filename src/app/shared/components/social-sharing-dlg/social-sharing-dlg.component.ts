import { Component, OnInit, Input } from '@angular/core';
import { ModalRef } from '@app-models/modal-ref';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LayoutService } from '@app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { VideoArticleListItem } from '@app/api_generated/model/videoArticleListItem'

type VideoArticleType =  VideoArticleListItem & {
	type?: string
	publicUrl?: string
  videoUrl?: string
}
@Component({
  selector: 'app-social-sharing-dlg',
  templateUrl: './social-sharing-dlg.component.html',
  styleUrls: ['./social-sharing-dlg.component.scss']
})
export class SocialSharingDlgComponent implements OnInit {
  @Input() modalRef: ModalRef
  @Input() data: VideoArticleType = {}
  socialShareOption = [
    {   name: 'Whatsapp',
        title: 'shared.social-sharing.share_on_whatsapp',
        shareType: 'shareViaWhatsApp'
    },
    {
        name: 'Facebook',
        title: 'shared.social-sharing.share_on_facebook',
        shareType: 'shareViaFacebook'
    },
    {   name: 'Twitter',
        title: 'shared.social-sharing.share_on_twitter',
        shareType: 'shareViaTwitter'
    },
    // {   name: 'Instagram',
    //     title: 'shared.social-sharing.share_on_instagram',
    //     shareType: 'shareViaInstagram'
    // },
    {   name: 'SMS',
        title: 'shared.social-sharing.share_on_sms',
        shareType: 'shareViaSMS'
    },
    {   name: 'Email',
        title: 'shared.social-sharing.share_on_email',
        shareType: 'viaEmail'
    }
  ]

  constructor(
    private socialSharing: SocialSharing, 
    private layoutService: LayoutService,
    private translate: TranslateService) { }

  ngOnInit() {
  }

  back() {
    this.modalRef.closeModal()
  }

  appAvailabilityErr(app) {
    this.layoutService.openSnackBar(this.translate.instant('shared.social-sharing.app_not_available', {
      app
    }), null, 5000, 'error')
  }

  async shareVia(option: {
    name: string,
    title: string,
    shareType: string
  }) {
    if (option.shareType === 'viaEmail') {
      this.shareViaEmail();
    } else if (option.shareType === 'shareViaSMS') {
      this.shareViaSMS()
    } else {
      this.socialSharing[`${option.shareType}`](this.data.title, this.data.thumbnailUrl, this.data.type === "article" ?  this.data.publicUrl : this.data.videoUrl)
      .then((res) => {
        this.back()
      })
      .catch((e) => {
        this.appAvailabilityErr(option.name)
      });
    }
  }

  shareViaEmail() {
    this.socialSharing.canShareViaEmail().then((res) => {
      this.socialSharing.shareViaEmail(this.data.title, '', [], null, null, this.data.thumbnailUrl).then(() => {
        this.back()
      })
      .catch((e) => {
        this.appAvailabilityErr('Email')
      });
    })
  }

  shareViaSMS() {
     this.socialSharing.shareViaSMS(this.data.type === "article" ?  this.data.publicUrl : this.data.videoUrl, null).then(() => {
      this.back()
    })
  }
}
