import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeSubviewComponent } from './poke-subview.component';

describe('PokeSubviewComponent', () => {
  let component: PokeSubviewComponent;
  let fixture: ComponentFixture<PokeSubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokeSubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeSubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
