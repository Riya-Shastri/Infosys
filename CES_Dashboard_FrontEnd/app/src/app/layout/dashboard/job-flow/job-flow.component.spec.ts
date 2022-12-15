import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFlowComponent } from './job-flow.component';

describe('JobFlowComponent', () => {
  let component: JobFlowComponent;
  let fixture: ComponentFixture<JobFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
