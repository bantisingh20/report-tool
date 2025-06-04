import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from './shared/shared.module';
import { NotificationService } from './service/NotificationService.service';

//import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [SharedModule, RouterOutlet, DialogModule, CommonModule, FormsModule, ButtonModule, TableModule, MenuModule, SelectModule, Menubar, DropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  items: MenuItem[] | undefined;

  title = 'report-tool';
  darkMode: boolean = false;


  constructor(private primeng: PrimeNG, private config: PrimeNG, private notificationService: NotificationService) { }


  ngOnInit() {
    this.primeng.ripple.set(true);

    //this.translateService.setDefaultLang('en');
  }

  toggleDarkMode() {
    // this.notificationService.success('Success', 'The operation completed successfully.');
    // this.notificationService.error('Error', 'Something went wrong.');
    // this.notificationService.warn('Warning', 'This is a warning.');
    // this.notificationService.info('Info', 'This is some information.');

    this.darkMode = !this.darkMode;
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
  }
}

