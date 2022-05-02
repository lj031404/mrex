import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupOptionsComponent } from './group-options.component';

describe('GroupOptionsComponent', () => {
  let component: GroupOptionsComponent;
  let fixture: ComponentFixture<GroupOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
