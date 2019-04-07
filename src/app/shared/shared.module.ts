import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

const MATERIAL_COMPONENTS = [MatButtonModule];

@NgModule({
  imports: [CommonModule, ...MATERIAL_COMPONENTS],
  exports: [...MATERIAL_COMPONENTS],
  declarations: [],
})
export class SharedModule {}
