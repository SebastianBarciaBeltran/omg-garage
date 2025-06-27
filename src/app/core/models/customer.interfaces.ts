export interface Customer {
  name: string;
  address: Address;
  email: string;
  vehicle: string;
  NumberPlate: string;
  mileage: number;
  licensePlate: string;
  nifOrCif: string;
  claimNumber: string;
  id?: string;
}

export interface Address {
  nameOfTheRoad: string;
  province: string;
  municipality: string;
  locality: string;
  postalCode: string;
}
