import { Component } from '@angular/core';

import { environment } from '@envs/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  version = environment.version;
}
