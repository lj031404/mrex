import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsLayoutOutletComponent } from './tabs-layout-outlet.component';

describe('TabsLayoutComponent', () => {
  let component: TabsLayoutOutletComponent;
  let fixture: ComponentFixture<TabsLayoutOutletComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ TabsLayoutOutletComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(TabsLayoutOutletComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
