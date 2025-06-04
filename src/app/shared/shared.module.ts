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
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

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
    SelectModule,
    InputTextModule,
    InputTextModule,
    ChartModule,
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
    SelectModule,
    InputTextModule,
    ChartModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
