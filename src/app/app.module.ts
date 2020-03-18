import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AuthModule } from '@auth/auth.module';
import { RequestInterceptor } from '@auth/services';
import { CoreModule } from '@core/core.module';
import { environment } from '@envs/environment';
import { SharedModule } from '@shared/shared.module';
import { effects as authEffects } from '@auth/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ROOT_REDUCERS } from './reducers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {},
    }),
    EffectsModule.forRoot([...authEffects]),
    StoreDevtoolsModule.instrument({
      name: 'Dart3',
      logOnly: environment.production,
    }),
    AuthModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
