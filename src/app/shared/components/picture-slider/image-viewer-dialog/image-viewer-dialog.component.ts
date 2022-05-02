import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PictureSlider {
	pictures: any[]
	options?: any
}

@Component({
  selector: 'app-image-viewer-dialog',
  templateUrl: './image-viewer-dialog.component.html',
  styleUrls: ['./image-viewer-dialog.component.scss']
})
export class ImageViewerDialogComponent {
  slider: PictureSlider

  constructor(
    public dialogRef: MatDialogRef<ImageViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      slider: PictureSlider,
      currentIndex: number
    },
  ) { }

}
