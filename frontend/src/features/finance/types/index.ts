export interface Customer {
  id: string;
  companyName?: string;
  fullName?: string;
  [key: string]: any;
}

export interface Debt {
  id: string;
  invoiceNumber: string;
  date: string | Date;
  customer: Customer;
  totalAmount: number;
  amountPaid: number;
  [key: string]: any;
}
