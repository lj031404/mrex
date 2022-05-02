import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { DefaultImageComponent } from '@app-shared/components/default-image/default-image.component'

@Directive({
	selector: '[appDefaultImage]'
})
export class DefaultImageDirective implements OnDestroy {
	private componentInstance: ComponentRef<DefaultImageComponent> = null
	@Input() appDefaultImage?: string

	constructor(
		private viewContainerRef: ViewContainerRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		private eRef: ElementRef
	) { }

	@HostListener('error') loadFallbackOnError() {
		if (this.appDefaultImage) {
			this.loadCustomImageForFallBack()
		} else {
			this.createLoaderComponent()
			this.makeComponentAChild()
		}

	}

	@HostListener('load') onLoad() {
		this.viewContainerRef.element.nativeElement.style.display = 'unset'
	}

	private createLoaderComponent() {
		if (!this.componentInstance) {
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DefaultImageComponent)
			this.componentInstance = this.viewContainerRef.createComponent(componentFactory)
		}
	}

	private makeComponentAChild() {
		const loaderComponentElement = this.componentInstance.location.nativeElement
		this.viewContainerRef.element.nativeElement.style.display = 'none'
		const sibling: HTMLElement = loaderComponentElement.parentElement
		sibling.insertBefore(loaderComponentElement, sibling.firstChild)
	}

	ngOnDestroy(): void {
		if (this.componentInstance) {
			this.componentInstance.destroy()
		}
	}

	loadCustomImageForFallBack() {
		const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement
		element.src = this.appDefaultImage
	}

}
