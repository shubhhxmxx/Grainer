import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDatasetsComponent } from './public.dataset.component';

describe('Public', () => {
  let component: PublicDatasetsComponent;
  let fixture: ComponentFixture<PublicDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicDatasetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
