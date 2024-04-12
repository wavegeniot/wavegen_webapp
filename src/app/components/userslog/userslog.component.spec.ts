import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserslogComponent } from './userslog.component';

describe('UserslogComponent', () => {
  let component: UserslogComponent;
  let fixture: ComponentFixture<UserslogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserslogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
