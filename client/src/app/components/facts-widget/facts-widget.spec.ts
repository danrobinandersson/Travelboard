import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsWidget } from './facts-widget';

describe('FactsWidget', () => {
  let component: FactsWidget;
  let fixture: ComponentFixture<FactsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(FactsWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
