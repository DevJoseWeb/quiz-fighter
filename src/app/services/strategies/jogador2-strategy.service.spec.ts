import { TestBed, inject } from '@angular/core/testing';

import { Jogador2StrategyService } from './jogador2-strategy.service';

describe('Jogador2StrategyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Jogador2StrategyService]
    });
  });

  it('should be created', inject([Jogador2StrategyService], (service: Jogador2StrategyService) => {
    expect(service).toBeTruthy();
  }));
});
