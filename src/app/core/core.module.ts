import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from '@root/shared/shared.module';

const COMPONENTS = [NotFoundComponent, MenuComponent];

@NgModule({
  imports: [CommonModule, FontAwesomeModule, SharedModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {}
