import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackSettingsComponent } from './we-track-settings.component';

describe('WeTrackSettingsComponent', () => {
  let component: WeTrackSettingsComponent;
  let fixture: ComponentFixture<WeTrackSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
