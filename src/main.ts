import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { inject, provideAppInitializer } from '@angular/core';
import { ConfigService } from './app/core/services/config.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      // Ensure the configuration is loaded before app initialization
      return configService.load().then(() => {
        console.log('Config loaded successfully in initializer.');
      });
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ]
});