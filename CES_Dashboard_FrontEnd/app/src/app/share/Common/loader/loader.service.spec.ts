import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef,MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService, } from 'src/app/share/Services/common.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

describe('LoaderService', () => {
  let service: LoaderService;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonService: CommonService;
  let matDialogService: jasmine.SpyObj<MatDialog>;
   matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]});
    service = TestBed.inject(LoaderService);
  });

  it('declare veriables', () => {
    var isLoading = new Subject<boolean>();
   
   });
   it('declare show', () => {
    service.isLoading.next(true);
   
   });
   it('declare hide', () => {
    service.isLoading.next(false);
   });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
