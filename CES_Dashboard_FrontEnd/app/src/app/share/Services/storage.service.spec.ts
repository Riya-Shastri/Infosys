import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let localStore;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    
    localStore = {};
  spyOn(window.localStorage, 'getItem').and.callFake((key) =>
    key in localStore ? localStore[key] : null
  );
  spyOn(window.localStorage, 'setItem').and.callFake(
    (key, value) => (localStorage[key] = value + '')
  );
  spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
