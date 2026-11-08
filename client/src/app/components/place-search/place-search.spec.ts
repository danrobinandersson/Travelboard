import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSearch } from './place-search';

describe('PlaceSearch', () => {
  let component: PlaceSearch;
  let fixture: ComponentFixture<PlaceSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
