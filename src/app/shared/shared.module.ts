import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

const materialComponents = [MatButtonModule, MatInputModule, MatProgressBarModule, MatSelectModule];

@NgModule({
  imports: [CommonModule, ...materialComponents],
  exports: [...materialComponents],
  declarations: [],
})
export class SharedModule {}
