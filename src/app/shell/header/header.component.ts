import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@auth/auth.service';
import { primeNGModules } from '@shared/index';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    primeNGModules,
    RouterModule,
    DividerModule,
    AvatarModule,
    PanelMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
