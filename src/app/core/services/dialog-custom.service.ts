import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogCustomService {
  private dialogRef?: DynamicDialogRef;

  constructor(private dialogService: DialogService) {}

  open<TOutput = unknown, TData = unknown>(
    component: Type<unknown>,
    data?: TData,
    config?: Partial<Omit<DynamicDialogConfig, 'data'>>,
  ): Observable<TOutput | undefined> {
    const closeSubject = new Subject<TOutput | undefined>();

    this.dialogRef = this.dialogService.open(component, {
      data,
      closable: true,
      dismissableMask: true,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      ...config,
    });

    this.dialogRef.onClose.subscribe((result: TOutput | undefined) => {
      closeSubject.next(result);
      closeSubject.complete();
    });

    return closeSubject.asObservable();
  }

  close<T = unknown>(result?: T): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
  }
}
