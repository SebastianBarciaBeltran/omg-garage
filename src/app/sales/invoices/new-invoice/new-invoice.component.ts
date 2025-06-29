import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { TableRowReorderEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { Company, InvoiceSummary, Unit } from '@core/models';
import { DEFAULT_COMPANY_INFO } from '@core/utils';
import { FormValidationService } from '@core/services/form-validation.service';
import { DialogCustomService } from '@core/services/dialog-custom.service';
import { InvoiceForm } from '@core/models/invoice-form.interfaces';
import { primeNGModules } from '@shared/primeng/primeng';
import { PreviewInvoiceComponent } from '../components/preview-invoice/preview-invoice.component';
import { InvoiceCalculationService } from '../services/invoice-calculation.service';
import { PrintService } from '@core/services/print.service';

@Component({
  selector: 'app-new-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...primeNGModules],
  providers: [DialogService],
  templateUrl: './new-invoice.component.html',
})
export class NewInvoiceComponent implements OnInit {
  form!: FormGroup;

  formGroups: FormGroup[] = [];

  splitButtonItems: MenuItem[]  =
  [
    {
      label: 'Descargar pdf',
      icon: 'pi pi-file-pdf',
      command: () => this.downloadPdf(),
    },
  ];

  unitOptions: { name: string; code: Unit }[] = [
    { name: 'Unidades', code: 'ud' },
    { name: 'Horas', code: 'h' },
    { name: 'Litros', code: 'l' },
  ];

  companyInfo: Company = DEFAULT_COMPANY_INFO;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private dialogService: DialogCustomService,
    private readonly _formValidationService: FormValidationService,
    readonly _invoiceCalculationService: InvoiceCalculationService,
    private printService: PrintService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customer: this.fb.group({
        name: ['', [Validators.required]],
        address: this.fb.group({
          nameOfTheRoad: ['', [Validators.required]],
          province: ['', [Validators.required]],
          municipality: ['', [Validators.required]],
          postalCode: ['', [Validators.required]],
          locality: ['', [Validators.required]],
        }),
        email: ['', [Validators.required, Validators.email]],
        vehicle: ['', [Validators.required]],
        licensePlate: ['', [Validators.required]],
        mileage: ['', [Validators.required]],
        nifOrCif: ['', [Validators.required]],
        claimNumber: [''],
      }),
      products: this.fb.array([]),
      date: [new Date(), [Validators.required]],
      invoiceNumber: [this.generateInvoiceNumber()],
    });

    this.addProduct();
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get invoiceSummary(): InvoiceSummary {
    return this._invoiceCalculationService.getSummary(this.products.value);
  }

  get isFormValid(): boolean {
    return this.form?.valid ?? false;
  }


  addProduct(): void {
    const productGroup = this.fb.group({
      code: [''],
      description: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0.25)]],
      price: ['', [Validators.required, Validators.min(0)]],
      unit: ['', [Validators.required]],
    });
    this.products.push(productGroup);
    this.syncFormGroups();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.syncFormGroups();
  }

  syncFormGroups(): void {
    this.formGroups = this.products.controls as FormGroup[];
  }

  onRowReorder(event: TableRowReorderEvent): void {
    const from = event.dragIndex!;
    const to = event.dropIndex!;

    const formArray = this.products;
    const moved = formArray.at(from);

    formArray.removeAt(from);
    formArray.insert(to, moved);

    this.syncFormGroups();
  }

  openPreview(): void {
    if (!this.isFormValid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.dialogService.open<void, InvoiceForm>(PreviewInvoiceComponent, this.form.value, {
      header: 'Vista previa de factura',
      width: '70%',
      maximizable: true,
    });
  }


  private markFormGroupTouched(group: FormGroup | FormArray): void {
    Object.values(group.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(path: string): string | null {
    const control = this.getNestedControl(path);
    return control ? this._formValidationService.getErrorMessage(control) : null;
  }

  isFieldInvalid(path: string): boolean {
    const control = this.getNestedControl(path);
    return control ? this._formValidationService.isFieldInvalid(control) : false;
  }

  private getNestedControl(path: string): AbstractControl | null {
    return this.form.get(path) || null;
  }

  getProductErrorMessage(row: FormGroup, controlName: string): string | null {
    const control = row.get(controlName);
    return control ? this._formValidationService.getErrorMessage(control) : null;
  }

  isProductFieldInvalid(row: FormGroup, controlName: string): boolean {
    const control = row.get(controlName);
    return control ? this._formValidationService.isFieldInvalid(control) : false;
  }

  downloadPdf(): void {
    if (!this.isFormValid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.printService.generateInvoicePdf(this.form.value, this.companyInfo, this.invoiceSummary);
  }

  generateInvoiceNumber(): string {
  const datePart = new Date().toISOString().slice(0,7).replace('-', ''); // YYYYMM
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 caracteres alfanuméricos

  return `${datePart}-${randomPart}`;
}

  goBack(): void {
    this.location.back();
  }
}
