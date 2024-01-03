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
