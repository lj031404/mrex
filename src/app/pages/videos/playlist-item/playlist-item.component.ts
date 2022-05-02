import { Component, OnInit, Input } from '@angular/core';
import { PlaylistItem } from '@app/api_generated/model/playlistItem';
@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {
  @Input() playlist: PlaylistItem
  constructor() { }

  ngOnInit() {
  }

}
