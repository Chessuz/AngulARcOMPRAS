import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComprasPage } from './lista-compras.page';

describe('ListaComprasPage', () => {
  let component: ListaComprasPage;
  let fixture: ComponentFixture<ListaComprasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaComprasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
