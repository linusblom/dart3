import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Role } from 'dart3-sdk';

import { hasRole } from '@utils/player-roles';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  @Input() roles: Role[] = [];

  Role = Role;

  hasRole(role: Role) {
    return hasRole(this.roles, role);
  }
}
