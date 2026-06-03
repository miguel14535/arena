export type Category = "bebidas" | "suplementos" | "uniformes" | "acessorios" | "outros";
export type PaymentMethod = "dinheiro" | "cartão" | "pix";
export type PlanType = "mensal" | "trimestral" | "semestral" | "anual";
export type MemberStatus = "ativo" | "vencido" | "inativo";

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: Category;
  price: number;
  stock: number;
  minStock: number;
}

export interface Member {
  id: string;
  name: string;
  cpf: string;
  registration: string;
  phone: string;
  belt: string;
  planType: PlanType;
  dueDate: string;
  status: MemberStatus;
}

export interface CartItem {
  productId: string;
  name: string;
  barcode: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  memberId?: string;
  memberName?: string;
}
