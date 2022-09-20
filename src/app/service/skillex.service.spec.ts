/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SkillexService } from './skillex.service';

describe('Service: Skillex', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillexService]
    });
  });

  it('should ...', inject([SkillexService], (service: SkillexService) => {
    expect(service).toBeTruthy();
  }));
});
