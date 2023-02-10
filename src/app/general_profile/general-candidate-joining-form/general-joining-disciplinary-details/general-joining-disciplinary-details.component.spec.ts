import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJoiningDisciplinaryDetailsComponent } from './general-joining-disciplinary-details.component';

describe('GeneralJoiningDisciplinaryDetailsComponent', () => {
  let component: GeneralJoiningDisciplinaryDetailsComponent;
  let fixture: ComponentFixture<GeneralJoiningDisciplinaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralJoiningDisciplinaryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJoiningDisciplinaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
