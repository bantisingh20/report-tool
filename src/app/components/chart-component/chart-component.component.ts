import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-chart-component',
  imports:[SharedModule],
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.css']
})
export class ChartComponentComponent implements OnChanges {
  @Input() chartDataArray: any;

  chartType: string = 'bar'; // default
  chartData: any = {};
  chartOptions: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.chartDataArray);
    if (changes['chartDataArray'] && this.chartDataArray) {
      const { type, data, options } = this.chartDataArray;

      this.chartType = type || 'bar';
      this.chartData = data || {};
      this.chartOptions = options || {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: ''
          }
        }
      };
    }
  }
}
