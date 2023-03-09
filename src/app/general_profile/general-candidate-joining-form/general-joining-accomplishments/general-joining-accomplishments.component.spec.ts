import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningAccomplishmentsComponent } from './general-joining-accomplishments.component';

describe('GeneralJoiningAccomplishmentsComponent', () => {
  let component: GeneralJoiningAccomplishmentsComponent;
  let fixture: ComponentFixture<GeneralJoiningAccomplishmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralJoiningAccomplishmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningAccomplishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
