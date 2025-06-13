import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  currentPath: string;
  //private apiUrl = 'http://localhost:3000/api/metadata'; 

  constructor(private http: HttpClient, private router: Router) {
    
    this.currentPath = this.router.url;
  }

  getTablesAndViews(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/tables`);
  }

  getColumns(tableName: string): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/columns/${tableName}`);
  }

  getTablesLinkTable(selectedTables: any[]) {
    return this.http.post<any>(`${API_URL}/check-table-relations`, { selectedTables });
  }


  getAvailableFieldsForTables(selectedTables: string[]): Observable<any[]> {
    return this.http.post<any>(`${API_URL}/check-table-relations`, { selectedTables }).pipe(
      map((result: { columnsByTable: { [key: string]: any[] } }) => {
        const columnsByTable = result.columnsByTable || {};

        const fields: any[] = [];

        for (const tableName of selectedTables) {
          const columns = columnsByTable[tableName];
          if (!columns) continue;

          for (const column of columns) {
            fields.push({
              column_name: `${tableName}.${column.column_name}`,
              label: `${column.column_name}`,
              data_type: column.data_type,
              raw: `${tableName}.column.${column.column_name}`,
            });
          }
        }

        return fields;
      })
    );
  }



  getDataforPreview(config: any) {
    console.log('Request Payload:', config);
    return this.http.post<string[]>(`${API_URL}/report/preview`, config);
  }
 
  processPreviewData(responseData: any) {

    const rawData = responseData?.data || [];
    const groupBy = responseData?.group || false; // true if data is grouped, false if not
    const ischart = responseData?.count || false; // true if count data is available
    const isRaw = responseData?.raw || false; // true if raw data is present
    const chartData = responseData?.chart || []; // true if count data is available

    console.log('service', rawData)
    console.log('service console', responseData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];

      return {
        ischart,
        isGroup :groupBy,
        isRaw,
        data: rawData,
        chartData,        
        groupBy: responseData?.groupBy,
        displayedColumns: firstItem ? Object.keys(firstItem) : [],
        showPreview: true
      };
    }
    // Handle the case where there is no data or incomplete data
    return {
      data: [],
      chartData: [],
      displayedColumns: [],
      showPreview: false
    };
  }

  SaveReportForamt(report: any) {
    return this.http.post(`${API_URL}/report/save/0`, report);
  }

  updateReportFormat(report: any, id: any) {
    return this.http.post(`${API_URL}/report/save/${id}`, report);
  }
  getReportById(id: any) {
    return this.http.get<any>(`${API_URL}/report/${id}`);
  }

  getListOfReportConfigure() {
    return this.http.get<string[]>(`${API_URL}/List-Report`);
  }
}
