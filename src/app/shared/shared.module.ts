import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule } from '@angular/material';

const MATERIAL_COMPONENTS = [MatButtonModule, MatInputModule];

@NgModule({
  imports: [CommonModule, ...MATERIAL_COMPONENTS],
  exports: [...MATERIAL_COMPONENTS],
  declarations: [],
})
export class SharedModule {}
