import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';

import { AuthModule } from '@auth/auth.module';
import { RequestInterceptor } from '@auth/services';
import { CoreModule } from '@core/core.module';
import { environment } from '@envs/environment';
import { SharedModule } from '@shared/shared.module';
import { effects as authEffects } from '@auth/effects';
import { effects as playerEffects } from '@player/effects';
import { effects as coreEffects } from '@core/effects';
import { effects as userEffects } from '@user/effects';
import { effects as jackpotEffects } from '@jackpot/effects';
import { PlayerModule } from '@player/player.module';
import { JackpotModule } from '@jackpot/jackpot.module';
import { UserModule } from '@user/user.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ROOT_REDUCERS } from './reducers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Auth0Module.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      audience: environment.auth0.audience,
      redirectUri: `${environment.siteUrl}/auth`,
      scope: 'openid profile email',
    }),
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {},
    }),
    EffectsModule.forRoot([
      ...authEffects,
      ...playerEffects,
      ...coreEffects,
      ...userEffects,
      ...jackpotEffects,
    ]),
    StoreDevtoolsModule.instrument({
      name: 'Dart3',
      logOnly: environment.production,
    }),
    AuthModule,
    PlayerModule,
    UserModule,
    CoreModule,
    JackpotModule,
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
