import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeEmailDialog } from './subscribe.email.dialog';

describe('SubscribeEmailDialog', () => {
  let component: SubscribeEmailDialog;
  let fixture: ComponentFixture<SubscribeEmailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeEmailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeEmailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
