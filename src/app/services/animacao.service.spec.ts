import { TestBed, inject } from '@angular/core/testing';

import { AnimacaoService } from './animacao.service';

describe('AnimacaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimacaoService]
    });
  });

  it('should be created', inject([AnimacaoService], (service: AnimacaoService) => {
    expect(service).toBeTruthy();
  }));
});
