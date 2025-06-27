import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly _messageService: MessageService) {}

  showToast(severity: string, summary: string, detail: string) {
    this._messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
