import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { AddLaserMdComponent } from '../add-laser-md/add-laser-md.component';
import { AddProtoComponent } from '../add-proto/add-proto.component';
import { AddLocationDataComponent } from '../add-location-data/add-location-data.component';
import { AddDepartmentPriorityComponent } from '../add-department-priority/add-department-priority.component';
import { AddCapsizingDataComponent } from '../add-capsizing-data/add-capsizing-data.component';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { AddRecipeMasterComponent } from '../add-recipe-master/add-recipe-master.component';
import { AddPlannerCodeComponent } from '../add-planner-code/add-planner-code.component';
import { UpdateShiftTimingComponent } from '../update-shift-timing/update-shift-timing.component';

@Component({
  selector: 'app-master-common-table',
  templateUrl: './master-common-table.component.html',
  styleUrls: ['./master-common-table.component.scss']
})
export class MasterCommonTableComponent implements OnInit {

  dataSource: any;
  displayedColumns: any = [];
  pageIndex: any;
  pageLength: any;
  currentPageSize: any;
  norecord: boolean = false;
  @Input() columns: any = [];
  @Input() dataset: any = [];
  @Input() componentName: any;
  @Input() defaultShortKey: any;
  @Input() totalRecords: any;

  @Output() emitPagesValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteData = new EventEmitter<any>();
  @Output() paginationData = new EventEmitter<any>();
  @Output() dataSort = new EventEmitter<any>();

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input('totalRecords')
  
  set totalPagesF(totalRecords) {
    this.totalRecords = totalRecords;
    if (this.paginator !== undefined) { this.paginator.firstPage(); }
  }

  @Input('currentPageSize')
  set currentPageSizeF(currentPageSize) { this.currentPageSize = currentPageSize; }

  constructor(
    private dialog: MatDialog,
    private service: MasterAPIService
  ) { }

  ngOnInit(): void {
    this.dataSource = []; 
    if (this.totalRecords == 0) {
      this.norecord = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = [];
    if (this.dataset) {
      this.norecord = false;
      if (changes && changes.dataset.currentValue) {
        this.dataSource = new MatTableDataSource<any>(changes.dataset.currentValue);
      }
      this.removePaginatorTooltip();
    }
    if (this.totalRecords == 0) {
      this.norecord = true;
    }
  }

  ngAfterViewInit() {
    this.displayedColumns = this.displayedColumns.concat(this.columns.map(x => x.columnDef));   
    this.dataSource = new MatTableDataSource<any>(this.dataSource);  
    this.dataSource.paginator = this.paginator;
    this.sort.sort((this.defaultShortKey) as MatSortable);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.dataSource.sort = this.sort;
    this.removePaginatorTooltip();
  }

  openEditDialog(detail, index, actionType) {
    if (this.componentName == 'LaserMd') {
      this.service.setLaserRecipeTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddLaserMdComponent, { disableClose: true })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result['data'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }
    if (this.componentName == 'Proto') {
      this.service.setProtoTypeTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddProtoComponent, { disableClose: true })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result['data'];
          this.totalRecords = result['total'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }
    if (this.componentName == 'MasterData') {
      this.service.setRecipeMasterTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddRecipeMasterComponent, { disableClose: true })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result['data'];
          this.totalRecords = result['total'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }
    if (this.componentName == 'LocationData') {
      this.service.setlocationTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddLocationDataComponent, { disableClose: true })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result['data'];
          this.totalRecords = result['total'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }
    if (this.componentName == 'DepartmentPriority') {
      this.service.setDepartmentTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddDepartmentPriorityComponent, {
        data: { detail: detail, itemIndex: index, actionType: actionType },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result;
        } 
      });
    }
    if (this.componentName == 'CapSizingData') {
      this.service.setCapSizeTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddCapsizingDataComponent, {
        disableClose: true,
        data: { detail: detail, itemIndex: index, actionType: actionType },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = result;
        } 
      });
    }
     // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
    if (this.componentName == 'PlannerCode') {
      this.service.setPlannerCodeTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(AddPlannerCodeComponent, {
        disableClose: true,
        data: { detail: detail, itemIndex: index, actionType: actionType },
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
          this.dataSource = result['data'];
          this.totalRecords = result['total'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }

    if (this.componentName == 'ShiftTiming') {
      this.service.setShiftTimeTableAction({ detail: detail, itemIndex: index, actionType: actionType });
      const dialogRef = this.dialog.open(UpdateShiftTimingComponent, {
        disableClose: true,
        data: { detail: detail, itemIndex: index, actionType: actionType },
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
          this.dataSource = result['data'];
          this.totalRecords = result['total'];
          this.onPaginateChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.currentPageSize,
            length: this.totalRecords
          });
          this.removePaginatorTooltip();
        } 
      });
    }
     //Release 2 Changes - CHG0116719 - End
  }

  openDeleteDialog(detail) {
    if (this.componentName !== 'PlannerCode'){
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: '400px',
      data: { title: 'Warning', content: "Are you sure, you want to delete?", type: "COPY" },
      disableClose: false
    });
    dialogC.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.deleteData.emit({ detail: detail });
      }
      dialogC.close();
    });
    }
    if (this.componentName == 'PlannerCode'){
      if(detail['data_present_bom_table'] > 0 || detail['data_present_onhand_table'] > 0 ){
        const dialogC = this.dialog.open(AlertDialogBoxComponent, {
        width: '400px',
        data: { title: 'Warning',
        content : `${"Planner Code"} ${detail['planner_code']} ${"has records associated in the application.<br>Do you really want to delete it ?"}` ,
         type: "COPY" }
         
      });
      dialogC.afterClosed().subscribe(result => {
        if (result == 'Yes') {
          this.deleteData.emit({ detail: detail });
        }
        dialogC.close();
      });
    }else{
      const dialogC = this.dialog.open(AlertDialogBoxComponent, {
        width: '400px',
        data: { title: 'Warning',
        content : "Are you sure want to delete ?",
         type: "COPY" }
         
      });
      dialogC.afterClosed().subscribe(result => {
        if (result == 'Yes') {
          this.deleteData.emit({ detail: detail });
        }
        dialogC.close();
      });
    }
    }
  }

  sortData(value: any) {
    this.dataSort.emit(value);
  }

  onPaginateChange(value) {
    this.paginator.pageSize = value.pageSize;
    this.paginator.length = this.totalRecords;
    this.paginator.pageIndex = value.pageIndex;
    this.pageIndex = value.pageIndex;
    if (value.pageSize !== null && value.pageSize !== undefined) {
      this.emitPagesValue.emit(value);
    }
  }

  removePaginatorTooltip() {
    //To remove tooltip on paginator
    if (this.paginator) {
      const paginatorIntl = this.paginator['_intl'];
      paginatorIntl.nextPageLabel = '';
      paginatorIntl.previousPageLabel = '';
      paginatorIntl.lastPageLabel = '';
      paginatorIntl.firstPageLabel = '';
    }
  }

}
