import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalSelectionListComponent } from './universal-selection-list.component';

describe('UniversalSelectionListComponent', () => {
  let component: UniversalSelectionListComponent;
  let fixture: ComponentFixture<UniversalSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
