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
//implements OnInit, AfterViewInit
export class ListReportComponent  {
companyProfiles: any[] = [];

  selectedConfig: any = null;
  viewType: 'report' | 'chart' | null = null;
  showPreview: boolean = false;
  previewData: any;
  constructor(private router: Router, private metadataService: MetadataService, private notificationService: NotificationService) { 
    this.loadReport();
  }

  displayedColumns: string[] = [];

  listData: any[] = [];

  configs = [];

  ngAfterViewInit() {
    //this.loadReport();
  }

  ngOnInit(): void {

    this.companyProfiles = [
            {
                name: "Apple",
                sector: "Technology",
                thisYearSales: "$ 2,000,000,000",
                lastYearSales: "$ 1,700,000,000",
                thisYearGrowth: "21%",
                lastYearGrowth: "15%",
            },
            {
                name: "Mac Donalds",
                sector: "Food",
                thisYearSales: "$ 1,100,000,000",
                lastYearSales: "$ 800,000,000",
                thisYearGrowth: "18%",
                lastYearGrowth: "15%",
            },
            {
                name: "Google",
                sector: "Technology",
                thisYearSales: "$ 1,800,000,000",
                lastYearSales: "$ 1,500,000,000",
                thisYearGrowth: "15%",
                lastYearGrowth: "13%",
            },
            {
                name: "Domino's",
                sector: "Food",
                thisYearSales: "$ 1,000,000,000",
                lastYearSales: "$ 800,000,000",
                thisYearGrowth: "13%",
                lastYearGrowth: "14%",
            },
            {
                name: "Meta",
                sector: "Technology",
                thisYearSales: "$ 1,100,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "11%",
                lastYearGrowth: "12%",
            },
            {
                name: "Snapchat",
                sector: "Technology",
                thisYearSales: "$ 1,500,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "16%",
                lastYearGrowth: "14%",
            },
            {
                name: "Tesla",
                sector: "AutoMobile",
                thisYearSales: "$ 1,300,000,000",
                lastYearSales: "$ 900,000,000",
                thisYearGrowth: "23%",
                lastYearGrowth: "16%",
            },
            {
                name: "Ford",
                sector: "AutoMobile",
                thisYearSales: "$ 700,000,000",
                lastYearSales: "$ 750,000,000",
                thisYearGrowth: "14%",
                lastYearGrowth: "15%",
            },
            {
                name: "Twitter",
                sector: "Technology",
                thisYearSales: "$ 1,200,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "19%",
                lastYearGrowth: "18%",
            }
        ];

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
        this.listData = response.data;
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

