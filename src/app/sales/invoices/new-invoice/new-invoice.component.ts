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
  splitButtonItems: MenuItem[] = [
    {
      label: 'Imprimir',
      icon: 'pi pi-print',
      // command: () => {
      //   this.print();
      // },
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
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customer: this.fb.group({
        name: ['Sebastián', [Validators.required]],
        address: this.fb.group({
          nameOfTheRoad: ['C/ Cartagena 14', [Validators.required]],
          province: ['Madrid', [Validators.required]],
          municipality: ['Madrid', [Validators.required]],
          postalCode: ['28028', [Validators.required]],
          locality: ['Madrid', [Validators.required]],
        }),
        email: ['sebas@gmail.com', [Validators.required, Validators.email]],
        vehicle: ['Honda CBR 600RR', [Validators.required]],
        licensePlate: ['6072GXR', [Validators.required]],
        mileage: ['27000', [Validators.required]],
        nifOrCif: ['53374412Z', [Validators.required]],
        claimNumber: [''],
      }),
      products: this.fb.array([]),
      date: [new Date(), [Validators.required]],
      invoiceNumber: ['12ew23asd'],
    });

    this.addProduct();
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get invoiceSummary(): InvoiceSummary {
    return this._invoiceCalculationService.getSummary(this.products.value);
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      code: [''],
      description: ['prueba', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0.25)]],
      price: ['5', [Validators.required, Validators.min(0)]],
      unit: ['ud', [Validators.required]],
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
    if (this.form.invalid) {
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

  print(): void {
    console.log('print');
  }

  goBack(): void {
    this.location.back();
  }
}
