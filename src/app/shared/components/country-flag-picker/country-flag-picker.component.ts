import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { CountryCodes } from '@app/core/models/country-code';
@Component({
  selector: 'app-country-flag-picker',
  templateUrl: './country-flag-picker.component.html',
  styleUrls: ['./country-flag-picker.component.scss']
})
export class CountryFlagPickerComponent  {
  @Input() selectedCountryCode: string;
  @Input() countryCodes: string[];

  @Input() customLabels: Record<string, string>;

  @Input() showFlags = true;
  @Input() showLabels = true;
  @Input() showArrow = true;

  @Output() changedCountryCode = new EventEmitter<{
    code: string,
    dialCode: string
  }>();

  @ViewChild('selectFlags', {static: true }) selectFlagsElementRef: ElementRef;

  private _isShowListCountryFlags = false;
  set isShowListCountryFlags(value: boolean) {
    this._isShowListCountryFlags = value;
    this.changeDetectorRef.markForCheck();
  }
  get isShowListCountryFlags(): boolean {
    return this._isShowListCountryFlags;
  }

  outsideClickSelectFlags = () => {};

  constructor(
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  getCountryLabel(countryCode: string): string {
    return (this.customLabels && this.customLabels[countryCode]) ?
      this.customLabels[countryCode] :
      countryCode ? countryCode.toUpperCase() : '';
  }

  public changeSelectedCountryCode(value: string): void {
    this.selectedCountryCode = value;
    this.closeListCountryFlags();
    this.changedCountryCode.emit({
      code: this.selectedCountryCode,
      dialCode: CountryCodes.find(country => country.code.toLowerCase() === value).dial_code
    });
  }

  public toggleListCountryFlags(): void {
    if (this.isShowListCountryFlags) {
      this.closeListCountryFlags();
    } else {
      this.openListCountryFlags();
    }
  }

  private openListCountryFlags(): void {
    this.isShowListCountryFlags = true;
    this.subscribeOutsideClickSelectFlags();
  }

  private closeListCountryFlags(): void {
    this.isShowListCountryFlags = false;
    this.unsubscribeOutsideClickSelectFlags();
  }

  private subscribeOutsideClickSelectFlags(): void {
    this.outsideClickSelectFlags = this.renderer.listen('document', 'click', (event) => {
      if (!this.selectFlagsElementRef.nativeElement.contains(event.target)) {
        this.closeListCountryFlags();
      }
    });
  }

  private unsubscribeOutsideClickSelectFlags(): void {
    if (this.outsideClickSelectFlags) {
      this.outsideClickSelectFlags();
      this.outsideClickSelectFlags = undefined;
    }
  }
}
