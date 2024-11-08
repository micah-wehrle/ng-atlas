import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalExpandableCardComponent } from './universal-expandable-card.component';

describe('UniversalExpandableCardComponent', () => {
  let component: UniversalExpandableCardComponent;
  let fixture: ComponentFixture<UniversalExpandableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalExpandableCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalExpandableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
