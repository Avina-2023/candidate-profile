import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningProjectDetailsComponent } from './general-joining-project-details.component';

describe('GeneralJoiningProjectDetailsComponent', () => {
  let component: GeneralJoiningProjectDetailsComponent;
  let fixture: ComponentFixture<GeneralJoiningProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralJoiningProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
