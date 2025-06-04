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

  rows = 5;
  first = 0;

  ngOnInit() {
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


// export class CommonTableComponent implements OnInit {
//   //@Input() data: any[] = [];

//    data = [
//     { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//             { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//             { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
//         { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
//     { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' }
//   ];

//   // columns = [
//   //   { field: 'products - product_id', header: 'Product ID' },
//   //   { field: 'products - price', header: 'Price' },
//   //   { field: 'categories - name', header: 'Category' }
//   // ];

//   columns: { field: string; header: string }[] = [];

//   ngOnInit() {
//     // Dynamically extract columns from the first row if available
//     if (this.data.length > 0) {
//       const firstRow = this.data[0];
//       this.columns = Object.keys(firstRow).map((key) => ({
//         field: key,
//         header: key.replace(/_/g, ' ').replace(/-/g, ' ')
//       }));
//     }
//   }
// }
