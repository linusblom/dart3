import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';

const MATERIAL_COMPONENTS = [MatButtonModule, MatInputModule, MatProgressSpinnerModule];

@NgModule({
  imports: [CommonModule, ...MATERIAL_COMPONENTS],
  exports: [...MATERIAL_COMPONENTS],
  declarations: [],
})
export class SharedModule {}
