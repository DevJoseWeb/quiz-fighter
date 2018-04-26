import { TestBed, inject } from '@angular/core/testing';

import { PreJogoService } from './pre-jogo.service';

describe('PreJogoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreJogoService]
    });
  });

  it('should be created', inject([PreJogoService], (service: PreJogoService) => {
    expect(service).toBeTruthy();
  }));
});
