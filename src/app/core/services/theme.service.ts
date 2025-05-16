import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private themeSubject = new BehaviorSubject<string>(this.getSavedTheme());
  
  theme$ = this.themeSubject.asObservable();
  
  constructor() {
    // Apply the theme to document on initialization
    this.applyTheme(this.themeSubject.value);
  }
  
  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }
  
  private getSavedTheme(): string {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return savedTheme || this.getPreferredTheme();
  }
  
  private getPreferredTheme(): string {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark';
  }
  
  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}