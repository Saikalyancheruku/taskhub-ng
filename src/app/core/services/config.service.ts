// config.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoints } from '../../../assets/endpoints';
@Injectable({ providedIn: 'root' })
export class ConfigService {
   private config: any;
    private http = inject(HttpClient);
    private ENDPOINTS = ApiEndpoints;
    private readonly baseUrl = this.ENDPOINTS.CONFIG;
  constructor() {}
  

  async load(): Promise<void> {
    
    this.config = await firstValueFrom(this.http.get(this.baseUrl));
  
  }

  get(key: string): any {
    return this.config?.[key];
  }
    getApiUrl(): string {
        return this.config?.apiUrl 
    }
}
