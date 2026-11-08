import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutWidget } from './about-widget';

describe('AboutWidget', () => {
  let component: AboutWidget;
  let fixture: ComponentFixture<AboutWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
