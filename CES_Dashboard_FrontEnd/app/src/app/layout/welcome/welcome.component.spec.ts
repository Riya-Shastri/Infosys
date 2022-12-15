import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/share/Services/common.service';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/share/Services/login/login.service';
import { AuthService } from 'src/app/share/Services/auth.service';
import { LoaderService } from 'src/app/share/Common/loader/loader.service';
describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
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
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogService
        },
        {
          provide: LoginService,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: {}
        },
        {
          provide: LoaderService,
          useValue: {}
        },
        DatePipe,
        CommonService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var errorMessage;
    var successMessage;
    var messages;
    var newUser;
    var existingUser;
    var notLoggedIn = false;
    var userMenuDatails;
    var UserDataRole;
    var authtype: any;
  });

  it(`ngOnInit test`, () => {
    component.ngOnInit();
    fixture.detectChanges();
    const url = window.location.href;
    const codeIdx = url.indexOf('code=');
    expect(codeIdx).toEqual(-1);
    const fragment = url.substr(codeIdx);

  });
  it(`login test`, () => {
    spyOn(component, 'login').and.callThrough();
    fixture.detectChanges();
    // let code = 'd27d338a-39d0-4472-826d-f4cb26b95a5a';
    // const mockLoginService: LoginService = TestBed.get(LoginService);
    // mockLoginService.getToken(code).subscribe(dataToken => {
    //   localStorage.setItem('RefreshToken', JSON.stringify({ refresh_token: dataToken.refresh_token }));
    //   sessionStorage.setItem('RefreshToken', JSON.stringify({ refresh_token: dataToken.refresh_token }));
    //   localStorage.setItem('EXMIdToken', JSON.stringify({ id_token: dataToken.id_token }));
    //   sessionStorage.setItem('EXMIdToken', JSON.stringify({ id_token: dataToken.id_token }));
    //   const date = new Date();
    //   const mockAuthService: AuthService = TestBed.get(AuthService);
    //   mockAuthService.setTimer(date.getTime());
    //   const mockLoaderService: LoaderService = TestBed.get(LoaderService);
    //   mockLoaderService.show();
    //   mockLoginService.login(dataToken.id_token).subscribe(data => {
    //   component.UserDataRole = data;

    //   });
    // });
  });




  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
