import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';


describe('TokenInterceptor', () => {
  
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenInterceptor
      ]
  }));

  it('declare veriables', () => {
   var refreshFlag: boolean = false;
  var fileUploadInProgress = false;

  });
  // it('should be created', () => {
  //   const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
  //   expect(interceptor).toBeTruthy();
  // });
});
