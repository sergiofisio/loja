export interface Product {
  amount: string;
}

export interface Order {
  finished: boolean;
  products: string; // JSON string of Product array
}

export interface User {
  orders: Order[];
}

export interface InfoDb {
  usuarios: User[];
}

export interface Accumulator {
  sum: number;
  count: number;
}

export interface order {
  id: number;
  idPagarme: string;
  userId: string;
  products: string;
  date: Date;
  finished: boolean;
  cartRecoreEmail: number;
  cartRecover: boolean;
  partnerId?: string;
  shippingType: string;
  trackingCode?: string;
  ticketUrl?: string;
}

interface phones {
  country_code: string;
  number: string;
  area_code: string;
}

interface address {
  city: string;
  country: string;
  created_at: string;
  id: string;
  line_1: string;
  state: string;
  status: string;
  updated_at: string;
  zip_code: string;
}

export interface User {
  id: string;
  code: string;
  name: string;
  type: string;
  document: string;
  email: string;
  created_at: string;
  updated_at: string;
  delinquent: boolean;
  address: address;
  phones: { mobile_phone: phones };
}
