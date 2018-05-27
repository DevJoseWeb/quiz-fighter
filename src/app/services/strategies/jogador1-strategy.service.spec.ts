import { TestBed, inject } from '@angular/core/testing';

import { Jogador1StrategyService } from './jogador1-strategy.service';

describe('Jogador1StrategyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Jogador1StrategyService]
    });
  });

  it('should be created', inject([Jogador1StrategyService], (service: Jogador1StrategyService) => {
    expect(service).toBeTruthy();
  }));
});
