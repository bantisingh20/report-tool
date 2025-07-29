import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module'; 
import { MetadataService } from '../../service/metadata.service';

@Component({
  selector: 'app-common-table',
  imports: [SharedModule,],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.css'
})

 
export class CommonTableComponent implements OnInit {

  @Input() israw: boolean = true;
  @Input() group: boolean = false;
  @Input() Inputgroupby: string[] = [];
  @Input() InputData: any[] = [];
  @Input() queryKey:any;
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();
  @Input() pagination: { page: number; pageSize: number; totalCount: number; totalPages: number } = {
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0
};

constructor (private metadataService: MetadataService){}
  columns: { field: string; header: string }[] = [];
  groupedData: any[] = [];
  companyProfiles: any[] = [];
  //  rows = 10;
  //  first = 0;

  ngOnInit() {
    console.log(this.pagination.totalCount)
     console.log(this.pagination)
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

  // onPageChange(event: any) {
  //   console.log('Banti called',event);
  //   this.metadataService.getDataforPreviewPerPage(event);
  // }
  
  onPageChange(event: any) {
  const pageNumber = event.page + 1; // Convert 0-based to 1-based
  const pageSize = event.rows;

  const payload = {
    page: pageNumber,
    pageSize: pageSize,
    queryKey: this.queryKey // Optional: stored from full preview response
  };

  console.log('Calling paginated API with', payload);
  this.metadataService.getDataforPreviewPerPage(payload).subscribe((response:any) => {
    this.InputData = response.data;
    this.pagination.totalCount = response.pagination.totalCount;
  });
}

  private formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
 