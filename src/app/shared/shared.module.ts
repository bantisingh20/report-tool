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
    ReactiveFormsModule
  ]
})
export class SharedModule {}
