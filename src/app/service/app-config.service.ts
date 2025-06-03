import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http.get('/assets/webconfig.json')
      .toPromise()
      .then(config => {
        this.config = config;
      })
      .catch(() => {
        console.error('Could not load config, using defaults');
        this.config = {};
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }

  // Add more getters if you have more config options
}
