import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox'; 
import { DialogModule } from 'primeng/dialog';
import { TableModule  } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    MultiSelectModule,
    TabViewModule, 
    ButtonModule,
    DropdownModule,
    ListboxModule,
    CheckboxModule,
    TableModule ,
    DialogModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MultiSelectModule, 
    TabViewModule, 
    DropdownModule,
    ButtonModule,
    ListboxModule,
    CheckboxModule,
    TableModule ,
    DialogModule,
    PaginatorModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
