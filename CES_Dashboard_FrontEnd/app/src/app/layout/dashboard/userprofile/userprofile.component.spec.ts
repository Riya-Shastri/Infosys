
import { UserprofileComponent } from './userprofile.component';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService, } from 'src/app/share/Services/common.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';


describe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: CommonService;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  var originalTimeout;
  let formBuilder: FormBuilder;
  let mockLoggerSvc: any;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserprofileComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { 
          provide: MatDialog,
          useValue: matDialogService
        },
        DatePipe,
        CommonService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
  var userDetails: any = '';
  var userName: string = '';
  var middleName: string = '';
  var userLastName: string = '';
  var WWID: any = '';
  var assigned_roles: any;
  var userProfileDetails: any;
  });
  
  it('Inside constructor', () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const getRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    component.userName = userData['firstName'];
    component.middleName = userData['middleName'];
    component.userLastName = userData['lastName'];
    component.WWID = userData['wwid'];
    component.assigned_roles = getRoles;
  });
  
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
