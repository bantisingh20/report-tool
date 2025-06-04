import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MetadataService } from '../../service/metadata.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ChartComponentComponent } from "../chart-component/chart-component.component";
import { NotificationService } from '../../service/NotificationService.service';

@Component({
  selector: 'app-list-report',
  imports: [SharedModule, CommonTableComponent, ChartComponentComponent],
  templateUrl: './list-report.component.html',
  styleUrl: './list-report.component.css'
})
export class ListReportComponent implements OnInit, AfterViewInit {

  selectedConfig: any = null;
  viewType: 'report' | 'chart' | null = null;
  showPreview: boolean = false;
  previewData: any;
  constructor(private router: Router, private metadataService: MetadataService, private notificationService: NotificationService) { }

  displayedColumns: string[] = [];

  listData: any[] = [];

  configs = [];

  ngAfterViewInit() {
    //this.loadReport();
  }

  ngOnInit(): void {
    this.loadReport();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadReport();
    });

  }


  loadReport() {

    this.metadataService.getListOfReportConfigure().subscribe({
      next: (response: any) => {
        this.listData = response.reports;
      }
      , error: (err) => {
        console.log(err);
        this.notificationService.error('Error', err.statusText);

      }
    })
  }

  goToEdit(id: string): void {
    this.router.navigate(['dynamic-report', id], { queryParams: { mode: 'edit' } });
  }

  previewConfig(id: any) {
    //console.log(id);
    //console.log(this.listData);
    const item = this.listData.find(obj => obj.report_id === id);

    const config = { ...item };
    //console.log(config);

    this.metadataService.getDataforPreview(config).subscribe({
      next: (response: any) => {
        const responseData = response?.data;
        console.log('API Response:', responseData);
        const { data, groupBy, chartData, displayedColumns, showPreview, ischart, isRaw, isGroup } = this.metadataService.processPreviewData(responseData);

        this.previewData = { data, groupBy, chartData, displayedColumns, showPreview, ischart, isRaw, isGroup };
        this.displayedColumns = displayedColumns;
        this.showPreview = showPreview; 
        if (this.previewData.data.length > 0) {
          //console.log(this.previewData);
          this.notificationService.success('Success', 'The operation completed successfully.');

        } else {
          this.notificationService.info('Info', 'Data Not Found');

        }
      },

      error: (err) => {
        this.previewData = {data: [],  chartData: [],  tableName: ''    };
        this.displayedColumns = [];
        this.showPreview = false;

        const message = err?.error?.message || 'Failed to fetch preview data.';
        console.error('Error fetching data:', err);
        this.notificationService.error('Error', message);
      }
    });
  }

  closeModal() {
    this.showPreview = false;
  }


  CreateNewConfig() {
    this.router.navigate(['dynamic-report']);
  }

  editConfig(config: any) {

    console.log('Edit:', config);
  }



  deleteConfig(config: any) {
    console.log('Delete:', config);
  }



}

