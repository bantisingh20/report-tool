import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-common-table',
  imports: [SharedModule],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.css'
})

 
export class CommonTableComponent implements OnInit {

  @Input() israw: boolean = true;
  @Input() group: boolean = false;
  @Input() Inputgroupby: string[] = [];
  @Input() InputData: any[] = [];

  columns: { field: string; header: string }[] = [];
  groupedData: any[] = [];
  companyProfiles: any[] = [];
  rows = 5;
  first = 0;

  ngOnInit() {
  if (this.InputData.length === 0) {
    this.InputData = this.companyProfiles;
  }

  const keys = Object.keys(this.InputData[0]);

  this.columns = [
    ...this.Inputgroupby.map(field => ({
      field,
      header: this.formatHeader(field)
    })),
    ...keys
      .filter(k => !this.Inputgroupby.includes(k))
      .map(k => ({
        field: k,
        header: this.formatHeader(k)
      }))
  ];

  if (this.group && this.Inputgroupby.length > 0) {
    this.calculateRowspan();
  }
}


  ngOnInitq() {

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


    if (this.InputData.length === 0) return;

    const keys = Object.keys(this.InputData[0]);

    // Build column list with group-by fields first
    this.columns = [
      ...this.Inputgroupby.map(field => ({
        field,
        header: this.formatHeader(field)
      })),
      ...keys
        .filter(k => !this.Inputgroupby.includes(k))
        .map(k => ({
          field: k,
          header: this.formatHeader(k)
        }))
    ];

    if (this.group && this.Inputgroupby.length > 0) {
      this.calculateRowspan();
    }
  }

  calculateRowspan() {
    this.groupedData = [];
    const rowspans = new Map<string, number>();
    const seen = new Map<string, number>();

    // Generate unique key by concatenating group-by field values
    const getGroupKey = (row: any) =>
      this.Inputgroupby.map(f => row[f]).join('|');

    // Count occurrences
    for (const row of this.InputData) {
      const key = getGroupKey(row);
      seen.set(key, (seen.get(key) || 0) + 1);
    }

    const processed = new Map<string, number>();

    for (const row of this.InputData) {
      const key = getGroupKey(row);
      const count = seen.get(key) || 0;
      const already = processed.get(key) || 0;

      const groupedRow = { ...row, __rowspan: {} };
      for (const groupField of this.Inputgroupby) {
        groupedRow.__rowspan[groupField] = already === 0 ? count : 0;
      }

      this.groupedData.push(groupedRow);
      processed.set(key, already + 1);
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}



// export class CommonTableComponentvirtualscrrol implements OnInit {
//   @Input() israw: boolean = true;
//   @Input() group: boolean = false;
//   @Input() Inputgroupby: string[] = [];
//   @Input() InputData: any[] = [];
// groupedData: any[] = [];
//   columns: { field: string; header: string }[] = [];
//   virtualData: any[] = [];
//   companyProfiles: any[] = [];

//   rows = 15; // Show 50 at a time
//   first = 0;
//   totalCount = 0;
//   loading = false;

//   ngOnInit() {
//     if (this.InputData.length === 0) {
//       this.InputData = this.companyProfiles;
//     }

//     this.totalCount = this.InputData.length;

//     const keys = Object.keys(this.InputData[0] || {});
//     this.columns = [
//       ...this.Inputgroupby.map(field => ({ field, header: this.formatHeader(field) })),
//       ...keys.filter(k => !this.Inputgroupby.includes(k)).map(k => ({ field: k, header: this.formatHeader(k) }))
//     ];

//     this.loadDataLazy({ first: this.first, rows: this.rows });

//     if (this.group && this.Inputgroupby.length > 0) {
//       this.calculateRowspan();
//     }
//   }

//   loadDataLazy(event: any) {
//     this.loading = true;

//     setTimeout(() => {
//       const start = event.first;
//       const end = start + event.rows;

//       const sliced = this.InputData.slice(start, end);

//       if (this.group && this.Inputgroupby.length > 0) {
//         // Recalculate group rowspans for virtual slice
//         this.InputData = sliced;
//         this.calculateRowspan();
//         this.virtualData = this.groupedData;
//       } else {
//         this.virtualData = sliced;
//       }

//       this.first = start;
//       this.loading = false;
//     }, 300); // Simulate async fetch
//   }

//   calculateRowspan() {
//     this.groupedData = [];
//     const seen = new Map<string, number>();
//     const processed = new Map<string, number>();

//     const getKey = (row: any) =>
//       this.Inputgroupby.map(f => row[f]).join('|');

//     for (const row of this.InputData) {
//       const key = getKey(row);
//       seen.set(key, (seen.get(key) || 0) + 1);
//     }

//     for (const row of this.InputData) {
//       const key = getKey(row);
//       const count = seen.get(key) || 0;
//       const already = processed.get(key) || 0;

//       const groupedRow = { ...row, __rowspan: {} };
//       for (const groupField of this.Inputgroupby) {
//         groupedRow.__rowspan[groupField] = already === 0 ? count : 0;
//       }

//       this.groupedData.push(groupedRow);
//       processed.set(key, already + 1);
//     }
//   }

//   private formatHeader(key: string): string {
//     return key.replace(/_/g, ' ')
//       .replace(/-/g, ' ')
//       .replace(/\s+/g, ' ')
//       .replace(/\b\w/g, l => l.toUpperCase());
//   }
// }



 