import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeOptionsDialog } from './subscribe.options.dialog';

describe('SubscribeOptions', () => {
  let component: SubscribeOptionsDialog;
  let fixture: ComponentFixture<SubscribeOptionsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeOptionsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeOptionsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
