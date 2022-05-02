import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDrawerOutletComponent } from './action-drawer-outlet.component';

describe('ActionDrawerComponent', () => {
  let component: ActionDrawerOutletComponent;
  let fixture: ComponentFixture<ActionDrawerOutletComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ActionDrawerOutletComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(ActionDrawerOutletComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
