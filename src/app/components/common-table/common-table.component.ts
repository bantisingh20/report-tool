import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-common-table',
  imports: [SharedModule],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.css'
})

export class CommonTableComponent implements OnInit {
 // @Input() data: any[] = [];

    data = [
    { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
            { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
            { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' },
        { 'products - product_id': 1, 'products - price': '241.35', 'categories - name': 'Electronics' },
    { 'products - product_id': 2, 'products - price': '222.74', 'categories - name': 'Clothing' }
  ];
  //@Input() groupBy?: string;
   groupBy: string = 'categories - name';
  columns: { field: string; header: string }[] = [];
 // Pagination config
  rows = 5;
  first = 0;

    // Data after rowspan calculation for grouping
  groupedData: any[] = [];
  // ngOnInit() {
  //   if (this.data && this.data.length > 0) {
  //     const firstRow = this.data[0];
  //     this.columns = Object.keys(firstRow).map(key => ({
  //       field: key,
  //       header: this.formatHeader(key)
  //     }));
  //   }
  // }

  ngOnInit() {
    if (this.data.length === 0) return;

    // Dynamically get keys from first object
    const keys = Object.keys(this.data[0]);

    // Reorder so groupBy is first column
    this.columns = [
      { field: this.groupBy, header: this.formatHeader(this.groupBy) },
      ...keys.filter(k => k !== this.groupBy).map(k => ({ field: k, header: this.formatHeader(k) }))
    ];

    this.calculateRowspan();
  }

   calculateRowspan() {
    const groupKey = this.groupBy;
    const seen = new Map<string, number>();
    this.groupedData = [];

    // Count how many rows per groupKey value
    this.data.forEach(row => {
       const key = (row as any)[this.groupBy];
    //  const key = row[groupKey];
      seen.set(key, (seen.get(key) || 0) + 1);
    });

    // Track groups already added for rowspan
    const processed = new Set<string>();

    this.data.forEach(row => {
       const key = (row as any)[this.groupBy];
      //const key = row[groupKey];
      if (!processed.has(key)) {
        this.groupedData.push({ ...row, __rowspan: seen.get(key) });
        processed.add(key);
      } else {
        this.groupedData.push({ ...row, __rowspan: 0 });
      }
    });
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

  // getGroupedData() {
  //   if (!this.groupBy) return this.data;

  //   const grouped: any[] = [];
  //   const seen = new Map<string, number>();

  //   for (const row of this.data) {
  //     const key = row[this.groupBy];
  //     if (!seen.has(key)) {
  //       seen.set(key, 1);
  //       grouped.push({ ...row, __rowspan: 1 });
  //     } else {
  //       seen.set(key, seen.get(key)! + 1);
  //       grouped.push({ ...row, __rowspan: 0 }); // hide the repeated cell
  //     }
  //   }

  //   // Update the first item of each group with correct rowspan
  //   const groupedKeys = Array.from(seen.entries());
  //   for (const [key, span] of groupedKeys) {
  //     const row = grouped.find(r => r[this.groupBy] === key && r.__rowspan === 1);
  //     if (row) row.__rowspan = span;
  //   }

  //   return grouped;
  // }

  getGroupedData() {
  if (!this.groupBy) return this.data;

  const grouped: any[] = [];
  const seen = new Map<string, number>();

  for (const row of this.data) {
    const groupKey = (row as any)[this.groupBy];
// groupBy is guaranteed to be a string now
    if (!seen.has(groupKey)) {
      seen.set(groupKey, 1);
      grouped.push({ ...row, __rowspan: 1 });
    } else {
      seen.set(groupKey, seen.get(groupKey)! + 1);
      grouped.push({ ...row, __rowspan: 0 });
    }
  }

  for (const [key, span] of seen.entries()) {
    const row = grouped.find(r => r[this.groupBy] === key && r.__rowspan === 1);
    if (row) row.__rowspan = span;
  }

  return grouped;
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
