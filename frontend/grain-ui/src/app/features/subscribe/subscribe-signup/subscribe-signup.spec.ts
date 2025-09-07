import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeSignup } from './subscribe-signup';

describe('SubscribeSignup', () => {
  let component: SubscribeSignup;
  let fixture: ComponentFixture<SubscribeSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
