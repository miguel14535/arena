import { Member, Product, Sale } from "../types";

const PRODUCTS_KEY = "dojo_pdv_products";
const MEMBERS_KEY = "dojo_pdv_members";
const SALES_KEY = "dojo_pdv_sales";

const uid = () => crypto.randomUUID();

const initialProducts: Product[] = [
  { id: uid(), name: "Água mineral", barcode: "7894900011517", category: "bebidas", price: 3, stock: 80, minStock: 15 },
  { id: uid(), name: "Isotônico Gatorade", barcode: "7892840800018", category: "bebidas", price: 8, stock: 35, minStock: 8 },
  { id: uid(), name: "Coca-Cola lata", barcode: "7891000100103", category: "bebidas", price: 6, stock: 50, minStock: 10 },
  { id: uid(), name: "Guaraná lata", barcode: "7891991010833", category: "bebidas", price: 5.5, stock: 50, minStock: 10 },
  { id: uid(), name: "Whey Protein Dose", barcode: "7890000000011", category: "suplementos", price: 12, stock: 25, minStock: 5 },
  { id: uid(), name: "Kimono Jiu-Jitsu Adulto", barcode: "7890000000028", category: "uniformes", price: 250, stock: 8, minStock: 2 },
  { id: uid(), name: "Rash Guard Academia", barcode: "7890000000035", category: "uniformes", price: 95, stock: 12, minStock: 3 },
  { id: uid(), name: "Protetor Bucal", barcode: "7890000000042", category: "acessorios", price: 25, stock: 20, minStock: 5 },
];

const initialMembers: Member[] = [
  {
    id: uid(),
    name: "Carlos Oliveira",
    cpf: "000.000.000-00",
    registration: "JJ001",
    phone: "(54) 99999-0000",
    belt: "Faixa Azul",
    planType: "mensal",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "ativo",
  },
];

function read<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function write<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getProducts: () => read<Product[]>(PRODUCTS_KEY, initialProducts),
  saveProducts: (products: Product[]) => write(PRODUCTS_KEY, products),
  getMembers: () => read<Member[]>(MEMBERS_KEY, initialMembers),
  saveMembers: (members: Member[]) => write(MEMBERS_KEY, members),
  getSales: () => read<Sale[]>(SALES_KEY, []),
  saveSales: (sales: Sale[]) => write(SALES_KEY, sales),
  resetAll: () => {
    write(PRODUCTS_KEY, initialProducts);
    write(MEMBERS_KEY, initialMembers);
    write(SALES_KEY, []);
  },
};

export function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function checkMemberStatus(dueDate: string, currentStatus: Member["status"]): Member["status"] {
  if (currentStatus === "inativo") return "inativo";
  const today = new Date().toISOString().slice(0, 10);
  return dueDate >= today ? "ativo" : "vencido";
}
