import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDrawerComponent } from './action-drawer.component';

describe('ActionSheetComponent', () => {
  let component: ActionDrawerComponent;
  let fixture: ComponentFixture<ActionDrawerComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ActionDrawerComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(ActionDrawerComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
