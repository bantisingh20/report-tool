
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MetadataService } from '../../service/metadata.service';
import { ReportConfigService } from '../../service/report-config.service';
import { CommonTableComponent } from "../common-table/common-table.component";
import { ChartComponentComponent } from '../chart-component/chart-component.component';
import { NotificationService } from '../../service/NotificationService.service';


declare var bootstrap: any;
@Component({
  selector: 'app-report-config',
  imports: [SharedModule, CommonTableComponent, ChartComponentComponent],
  templateUrl: './report-config.component.html',
  styleUrl: './report-config.component.css'
})

export class ReportConfigComponent implements OnInit {
  pagination = {
    page: 1,
    pageSize: 10,
    totalCount: 0,
  };
  showSaveModal = false;
  originalTablesAndViews: any[] = [];
  previewMode: 'report' | 'chart' | null = null;
  showPreviewButtons: boolean = false;
  previewData: any;
  ChartData: any[] = [];
  displayedColumns: string[] = [];
  showPreview = false;
  directionOptions = [
    { label: 'Ascending (A-Z)', value: 'asc' },
    { label: 'Descending (Z-A)', value: 'desc' }
  ];

  //operators: string[] = ['between', 'equals', 'not equals', 'greater than', 'less than', 'contains'];
  operators = [
    { label: 'Between', symbol: 'between' },
    { label: 'Equals', symbol: '=' },
    { label: 'Not Equals', symbol: '!=' },
    { label: 'Greater Than', symbol: '>' },
    { label: 'Less Than', symbol: '<' },
    { label: 'Greater Than or Equal To', symbol: '>=' },
    { label: 'Less Than or Equal To', symbol: '<=' },
    { label: 'Contains', symbol: 'like' }
  ];

  operatorMap = {
    number: ['between', '=', '!=', '>', '<', '>=', '<='],
    string: ['=', '!=', 'like'],
    date: ['between', '=', '!=', '>', '<'],
    boolean: ['=', '!=']
  };

  Countoperators: string[] = ['sum', 'count', 'average', 'max', 'min'];

  stringTypes: string[] = ['varchar', 'character varying', 'character', 'char', 'text', 'citext'];
  numberTypes: string[] = ['integer', 'smallint', 'bigint', 'decimal', 'numeric', 'real', 'double precision', 'serial', 'bigserial'];
  dateTypes: string[] = ['date', 'timestamp', 'timestamp with time zone', 'timestamp without time zone'];
  booleanTypes: string[] = ['boolean'];
  tablesAndViews: any[] = [];
  availableFields: any[] = [];
  selectedcolumns: any[] = [];
  showColumnsAndGroupBy: boolean = true;
  showXYConfig: boolean = true;
  reportId: string | null = null;
  mode: string | null = null;
operatorsByRow: { [index: number]: Array<{ label: string, symbol: string }> } = {};
  //operatorsByRow: { [key: number]: string[] } = {};
  xAxisTransformationOptions = [
    { label: 'Day-wise', value: 'daywise' },
    { label: 'Month-wise', value: 'monthwise' },
    { label: 'Yearly', value: 'yearwise' }
  ];


  reportForm = new FormGroup({
    fieldtype: new FormControl('summary', Validators.required),
    tableandview: new FormControl([], [Validators.required, minSelectedCheckboxes(1)]),
    reportname: new FormControl(),
    selectedcolumns: new FormControl([]),//.minSelectedCheckboxes(1)
    filters: new FormArray([]),
    groupby: new FormArray([]),
    sortby: new FormArray([]),
    xyaxis: new FormArray([])
  });
  activeTab: any;


  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder,
    private route: ActivatedRoute, private metadataService: MetadataService, private notificationService: NotificationService,
    private reprotconfig: ReportConfigService) { }


  //#region On page load initial setup
  ngOnInit() {
    this.availableFields = [];
    this.selectedcolumns = [];
    this.metadataService.getTablesAndViews().subscribe(data => {
      // console.log(data)
      this.tablesAndViews = data;
      this.tablesAndViews = this.tablesAndViews.map(field => ({
        ...field,
        label: `${this.capitalize(field.name)} || ${this.capitalize(field.type)}`
      }));

      this.originalTablesAndViews = [...this.tablesAndViews];
    });

    // check mode 
    this.route.queryParamMap.subscribe(params => {
      this.mode = params.get('mode');
      this.reportId = this.route.snapshot.paramMap.get('id');
      if (this.mode === 'edit' && this.reportId) {
        this.loadReportData(this.reportId);
      }
    });

  }





  loadReportData(id: string): void {
    this.metadataService.getReportById(id).subscribe((response: any) => {
      const data = response.data;

      console.log(data);
      this.reportForm.patchValue({
        fieldtype: data.fieldtype,
        tableandview: data.table_name,
        reportname: data.report_name,
        selectedcolumns: data.selected_columns,
      });

      this.onFieldTypeChange();

      this.setFormArray('filters', data.filter_criteria);
      this.setFormArray('groupby', data.group_by);
      this.setFormArray('sortby', data.sort_order);
      this.setFormArray('xyaxis', data.axis_config);

      this.metadataService.getAvailableFieldsForTables(data.table_name).subscribe((fields: any[]) => {
        this.availableFields = fields;
        console.log(this.reportForm.get('selectedcolumns'));
        console.log(this.availableFields)
        this.onColumnSelect("");
      });
    });
  }
  //#endregion

  //#region  Radio butotn change
  onFieldTypeChange() {
    const fieldType = this.reportForm.get('fieldtype')?.value;

    console.log(fieldType);

    if (fieldType === 'count') {
      this.showColumnsAndGroupBy = false;
      this.showXYConfig = true;
      console.log(this.availableFields);
      this.selectedcolumns = [...this.availableFields];
      this.reportForm.get('selectedcolumns')?.setValue([]);
      this.reportForm.get('selectedcolumns')?.clearValidators();
      this.reportForm.get('selectedcolumns')?.updateValueAndValidity();
    } else if (fieldType === 'summary') {
      this.showColumnsAndGroupBy = true;
      this.showXYConfig = false;
      this.reportForm.get('selectedcolumns')?.setValidators([Validators.required]);
      this.reportForm.get('selectedcolumns')?.updateValueAndValidity();
    }
  }

  // #endregion


  //#region Table change
  onTableSelect(selectedItem: any) {
    //console.log(selectedItem);
    const selectedTables = this.reportForm.get('tableandview')?.value || [];

    if (selectedTables.length === 0) {
      // If all cleared, reset to full list
      this.tablesAndViews = [...this.originalTablesAndViews];
      return;
    }

    if (selectedTables) {

      this.metadataService.getTablesLinkTable(selectedTables).subscribe((result: any) => {
        const relatedTables = result.relatedTables;
        const columnsByTable = result.columnsByTable;

        if (relatedTables && relatedTables.length >= 1) {
          const updatedTables = Array.from(new Set([...selectedTables, ...relatedTables]));
          this.tablesAndViews = updatedTables.map(name => ({
            name,
            label: `${this.capitalize(name)} `
          }));

          //console.log("Linked tables found:", relatedTables);
          //console.log("Columns:", columnsByTable);
        } else {
          //console.log("Selected tables are not related");
        }
      });

      this.metadataService.getAvailableFieldsForTables(selectedTables).subscribe((fields: any[]) => {
        this.availableFields = fields;

        if (this.reportForm.get("fieldtype")?.value == 'count') {
          this.selectedcolumns = this.availableFields;
        }

      });
    }

    this.reportForm.get('selectedcolumns')?.setValue([]);
    (this.reportForm.get('filters') as FormArray).clear();
    (this.reportForm.get('groupby') as FormArray).clear();
    (this.reportForm.get('sortby') as FormArray).clear();

  }

  dropdownCloseFunction() {
    console.log('Dropdown closed!');
  }

  // col change
  onColumnSelect(event: any) {
    //this.selectedcolumns = [...event]
    if (this.reportForm.get("fieldtype")?.value !== 'count') {
      const selectedValues: string[] = this.reportForm.get('selectedcolumns')?.value || [];
      this.selectedcolumns = this.availableFields.filter(field =>
        selectedValues.includes(field.column_name)
      );
    } else {
      this.selectedcolumns = this.availableFields;
    }
  }

  //#endregion



  //#region XY AXIS CODE
  addXYAxis() {
    const xyAxisGroup = this.fb.group({
      xAxisField: [null, Validators.required],
      xAxisDirection: ['asc'],
      xAxisTransformation: ['daywise'],
      yAxisField: ['', Validators.required],
      yAxisDirection: ['asc'],
      yAxisAggregation: ['sum']
    });
    this.xyaxis.push(xyAxisGroup);
  }


  removeXYAxis(index: number) {
    this.xyaxis.removeAt(index);
  }


  // Handle changes in the X-Axis field to show transformation options if needed
  onXAxisFieldChange(index: number) {
    const xAxisField = this.xyaxis.at(index).get('xAxisField')?.value;
    const field = this.availableFields.find(f => f.column_name === xAxisField);

    if (this.dateTypes.includes(field?.data_type)) {

      this.xyaxis.at(index).get('xAxisTransformation')?.setValidators([Validators.required]);
    } else {
      this.xyaxis.at(index).get('xAxisTransformation')?.setValue(null);
      this.xyaxis.at(index).get('xAxisTransformation')?.clearValidators();
    }
    this.xyaxis.at(index).get('xAxisTransformation')?.updateValueAndValidity();
  }



  //// Add this method to your component
  getYaxisAggregationOptions(index: number): { label: string, value: string }[] {
    const yAxisField = this.xyaxis.at(index).get('yAxisField')?.value;
    const field = this.availableFields.find(f => f.column_name === yAxisField);

    const options = field && this.numberTypes.includes(field.data_type)
      ? ['sum', 'count', 'average', 'max', 'min']
      : ['count', 'max', 'min'];

    return options.map(opt => ({ label: opt, value: opt }));
  }


  // Check if the X-Axis has date field selected to show transformation options
  showXAxisTransformationOptions(index: number): boolean {
    const xAxisField = this.xyaxis.at(index).get('xAxisField')?.value;
    const field = this.availableFields.find(f => f.column_name === xAxisField);

    if (this.dateTypes.includes(field?.data_type)) {
      return true;
    }
    else {
      return false;
    }
  }

  showYAxisAggregationOptions(index: number): boolean {
    const yAxisField = this.xyaxis.at(index).get('yAxisField')?.value;
    return yAxisField !== '';
  }

  //#endregion

  //#region  Filter CODE

  createFilter(): FormGroup {
    return this.fb.group({
      field: [null, Validators.required],
      operator: ['', Validators.required],
      value: [''],
      valueFrom: [''],
      valueTo: [''],
      selectedField: null
    });
  }


  onFilterFieldChangeold(field: any, index: number): void {
    const fielddatatype = field.value.data_type;
    const filterGroup = this.filters.at(index) as FormGroup;

    let newOperators: string[] = [];

    if (this.numberTypes.includes(fielddatatype)) {
      newOperators = ['between', 'equals', 'not equals', 'greater than', 'less than'];
    } else if (this.stringTypes.includes(fielddatatype)) {
      newOperators = ['equals', 'not equals', 'contains'];
    } else if (this.dateTypes.includes(fielddatatype)) {
      newOperators = ['between', 'equals', 'not equals', 'greater than', 'less than'];
    } else if (this.booleanTypes.includes(fielddatatype)) {
      newOperators = ['equals', 'not equals'];
    } else {
      newOperators = [];
    }

    // 🔑 Store operator list for this row only
    //this.operatorsByRow[index] = newOperators;

    filterGroup.patchValue({
      operator: '',
      value: '',
      valueFrom: '',
      valueTo: '',
      selectedField: field
    });
  }
  
  onFilterFieldChange(field: any, index: number): void {
  const fieldType = field.value.data_type;
  const filterGroup = this.filters.at(index) as FormGroup;

  let allowedSymbols: string | string[] = [];

  if (this.numberTypes.includes(fieldType)) {
    allowedSymbols = this.operatorMap.number;
  } else if (this.stringTypes.includes(fieldType)) {
    allowedSymbols = this.operatorMap.string;
  } else if (this.dateTypes.includes(fieldType)) {
    allowedSymbols = this.operatorMap.date;
  } else if (this.booleanTypes.includes(fieldType)) {
    allowedSymbols = this.operatorMap.boolean;
  }

  // Filter from master operator list
  this.operatorsByRow[index] = this.operators.filter(op => allowedSymbols.includes(op.symbol));

  filterGroup.patchValue({
    operator: '',
    value: '',
    valueFrom: '',
    valueTo: '',
    selectedField: field
  });
}



  onOperatorChange(index: number): void {
    const filterGroup = this.filters.at(index) as FormGroup;
    const operator = filterGroup.get('operator')?.value;

    console.log(operator);
    if (operator === 'between') {
      filterGroup.get('value')?.clearValidators();
      filterGroup.get('valueFrom')?.setValidators([Validators.required]);
      filterGroup.get('valueTo')?.setValidators([Validators.required]);
    } else {
      filterGroup.get('value')?.setValidators([Validators.required]);
      filterGroup.get('valueFrom')?.clearValidators();
      filterGroup.get('valueTo')?.clearValidators();
    }

    filterGroup.get('value')?.updateValueAndValidity();
    filterGroup.get('valueFrom')?.updateValueAndValidity();
    filterGroup.get('valueTo')?.updateValueAndValidity();
  }



  getInputType(dataType: string): string {
    if (this.numberTypes.includes(dataType)) return 'number';
    if (this.dateTypes.includes(dataType)) return 'date';
    if (this.booleanTypes.includes(dataType)) return 'checkbox';

    return 'text'; // fallback
  }

  addFilter() {
    this.filters.push(this.createFilter());
  }

  removeFilter(index: number) {
    this.filters.removeAt(index);
  }

  //#endregion


  //#region  GROUP BY
  addGrouping() {
    this.groupby.push(
      new FormGroup({
        field: new FormControl('', Validators.required),
      })
    );
  }

  removeGrouping(index: number) {
    this.groupby.removeAt(index);
  }
  //#endregion

  //#region  sort by
  addSorting() {
    this.sortby.push(
      new FormGroup({
        field: new FormControl('', Validators.required),
        direction: new FormControl('asc'),
      })
    );
  }

  removeSorting(index: number) {
    this.sortby.removeAt(index);
  }
  //#endregion

  get isColumnSelected(): boolean {
    const selectedColumns = this.reportForm.get('selectedcolumns')?.value;
    return Array.isArray(selectedColumns) && selectedColumns.length > 0;
  }

  get filters() {
    return this.reportForm.get('filters') as FormArray;
  }


  get groupby() {
    return this.reportForm.get('groupby') as FormArray;
  }

  get sortby() {
    return this.reportForm.get('sortby') as FormArray;
  }

  get xyaxis() {
    return this.reportForm.get('xyaxis') as FormArray;
  }


  onConfirmSave() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.notificationService.warn('warn', 'Fill All Data , something is missing');
      return;
    }
    this.saveConfiguration();
    // const reportname = this.reportForm.value.reportname;
    // const reportData = this.reportForm.value; 
    ///console.log('Saving report:', reportname, reportData);
    this.showSaveModal = false;

  }

  saveConfiguration(): void {

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.notificationService.warn('warn', 'Fill All Data , something is missing');
      return;
    }

    const reportname = this.reportForm.get('reportname')?.value;

    if (!reportname || reportname.trim() === '') {
      this.notificationService.warn('warn', 'Report Name is required.');
      return;
    }

    const config = this.reportForm.value;
    this.showPreview = false;

    if (this.mode === 'edit' && this.reportId) {
      //config.id = this.reportId;
      this.metadataService.updateReportFormat(config, this.reportId).subscribe({
        next: (response: any) => {
          this.notificationService.success('Success', response.message);
          //this.addNewReport();
          this.router.navigateByUrl('list-report');
        },
        error: (err) => {
          console.error('Error While Updating:', err.error);
          this.notificationService.error('Error', err?.error?.message);
        }
      });
    } else {

      this.metadataService.SaveReportForamt(config).subscribe({
        next: (response: any) => {
          this.notificationService.success('Success', response.message);
          this.router.navigateByUrl('list-report');
        },
        error: (err) => {
          console.error('Error While Saving: ', err.error);
          this.notificationService.error('Error', err?.error?.message);
        }
      });
    }

    console.log('Report configuration:', config);
  }

  previewReport(): void {
    this.showPreview = false;
    //console.log(this.reportForm.value);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.notificationService.warn('warn', 'Fill al data , something is missing');
      return;
    }

    const config = this.reportForm.value;

    this.metadataService.getDataforPreview(config,this.pagination).subscribe({
      next: (response: any) => {
        const responseData = response?.data;


        const { data, groupBy, chartData, displayedColumns, showPreview, ischart, isRaw, isGroup,pagination,queryKey } = this.metadataService.processPreviewData(responseData);

        this.previewData = { data, groupBy, chartData, displayedColumns, showPreview, ischart, isRaw, isGroup ,pagination,queryKey};
        this.displayedColumns = displayedColumns;
        this.showPreview = showPreview;

        console.log('API Response:', responseData);
        console.log('Preview data:', this.previewData);

        if (this.previewData.data.length > 0) {
          //console.log(this.previewData);
          this.notificationService.success('success', 'Fetch Data Successfully.');
          //this.notificationService.showNotification("Fetch Data Successfully.", 'success');
        } else {
          this.notificationService.warn('Warn', 'Data Not Found');
          //console.log(this.previewData);
          //this.notificationService.showNotification("No Data Found.", 'warning');
        }

        setTimeout(() => {
          //  this.previewData = this.getNewPreviewData(); // fetch or generate data here
          this.showPreview = true;
        }, 0);

      },

      error: (err) => {
        this.previewData = {
          data: [],
          chartData: []
        };
        this.displayedColumns = [];
        this.showPreview = false;

        const message = err?.error?.message || 'Failed to fetch preview data.';
        console.error('Error fetching data:', err);
        this.notificationService.warn('Error fetching data:', message);
        // this.notificationService.showNotification(message, 'error');
      }
    });

  }

  addNewReport(): void {
    this.reportForm.reset();
    (this.reportForm.get('filters') as FormArray).clear();
    (this.reportForm.get('groupby') as FormArray).clear();
    (this.reportForm.get('sortby') as FormArray).clear();
    (this.reportForm.get('xyaxis') as FormArray).clear();
     
    console.log('New report initiated');
    this.ngOnInit();
    this.router.navigate(['dynamic-report']);
  }


  onBack() {
    this.router.navigate(['list-report']);
  }


  setFormArray(key: string, values: any[]): void {
    const formArray = this.reportForm.get(key) as FormArray;
    formArray.clear();

    if (values && values.length > 0) {
      values.forEach(val => {

        if (typeof val === 'string') {
          try {
            val = JSON.parse(val);
          } catch (e) {
            console.error('Error parsing JSON:', val);
            return;
          }
        }


        if (typeof val === 'object' && !Array.isArray(val)) {
          const group = new FormGroup({});
          for (const key in val) {
            if (val.hasOwnProperty(key)) {
              group.addControl(key, new FormControl(val[key]));
            }
          }
          formArray.push(group);
        } else {
          formArray.push(new FormControl(val));
        }
      });
    }

    // console.log(formArray); // For debugging: check the form array structure
  }

  getColumns(table: any) {
    this.metadataService.getAvailableFieldsForTables(table).subscribe((fields: any[]) => {
      this.availableFields = fields;
    });
  }

  capitalize(str: string): string {
    if (!str) return '';
    const cleanStr = str.replace(/_/g, ' '); // Replace underscores with spaces
    return cleanStr
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}

function minSelectedCheckboxes(min: number = 1) {
  return function (control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (Array.isArray(value) && value.length >= min) {
      return null;
    }
    return { minSelected: true };
  };
}
