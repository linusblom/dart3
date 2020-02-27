import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AuthModule } from '@auth/auth.module';
import { effects as authEffects } from '@auth/effects';
import { RequestInterceptor } from '@auth/services';
import { CoreModule } from '@core/core.module';
import { effects as coreEffects } from '@core/effects';
import { environment } from '@envs/environment';
import { effects as playerEffects } from '@player/effects';
import { PlayerModule } from '@player/player.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ROOT_REDUCERS } from './reducers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    EffectsModule.forRoot([...coreEffects, ...playerEffects, ...authEffects]),
    StoreDevtoolsModule.instrument({
      name: 'Dart3',
      logOnly: environment.production,
    }),
    AuthModule,
    CoreModule,
    PlayerModule,
    AppRoutingModule,
    SharedModule,
  ],
  exports: [RouterModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
