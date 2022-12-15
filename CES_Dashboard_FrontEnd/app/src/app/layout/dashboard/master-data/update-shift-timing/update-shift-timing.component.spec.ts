import { ComponentFixture, TestBed, async, fakeAsync, tick  } from '@angular/core/testing';
import { UpdateShiftTimingComponent } from './update-shift-timing.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CommonService} from 'src/app/share/Services/common.service';
import { CommonLogicService} from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';;
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
describe('UpdateShiftTimingComponent', () => {
  let component: UpdateShiftTimingComponent;
  let fixture: ComponentFixture<UpdateShiftTimingComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  //let commonServices: CommonService;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateShiftTimingComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShiftTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('declare veriables', () => {
   var submitted = false;
   var isEditPage = false;
   var apiError;
   var dataSource: any = [];
   var totalrecords: any;
   var close = false;
   var line_id = null;
   var line_name: any;
   var userData: any;
  });
  

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should be create for getShiftTimingData', () => {
    expect(component.getShiftTimingData()).not.toBeNull();    
  });
});


