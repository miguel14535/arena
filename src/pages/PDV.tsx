import { useMemo, useRef, useState } from "react";
import { CartItem, Member, PaymentMethod, Product, Sale } from "../types";
import { checkMemberStatus, money, storage } from "../lib/storage";

interface Props { products: Product[]; setProducts: (p: Product[]) => void; members: Member[]; sales: Sale[]; setSales: (s: Sale[]) => void; }

export default function PDV({ products, setProducts, members, sales, setSales }: Props) {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [memberId, setMemberId] = useState("");
  const [message, setMessage] = useState("Pronto para passar produtos no caixa.");
  const inputRef = useRef<HTMLInputElement>(null);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [cart]);

  function addProductByBarcode(code: string) {
    const product = products.find((p) => p.barcode === code.trim());
    if (!product) return setMessage("Produto não encontrado. Confira o código de barras.");
    if (product.stock <= 0) return setMessage("Produto sem estoque.");
    const existing = cart.find((item) => item.productId === product.id);
    if (existing && existing.quantity >= product.stock) return setMessage("Quantidade maior que o estoque disponível.");
    if (existing) setCart(cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    else setCart([...cart, { productId: product.id, name: product.name, barcode: product.barcode, quantity: 1, unitPrice: product.price }]);
    setBarcode("");
    setMessage(`${product.name} adicionado ao caixa.`);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submitBarcode(e: React.FormEvent) { e.preventDefault(); if (barcode.trim()) addProductByBarcode(barcode); }
  function increase(productId: string) {
    const product = products.find((p) => p.id === productId); const item = cart.find((i) => i.productId === productId);
    if (!product || !item) return; if (item.quantity >= product.stock) return setMessage("Estoque insuficiente.");
    setCart(cart.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
  }
  function decrease(productId: string) { setCart(cart.map((i) => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0)); }
  function removeItem(productId: string) { setCart(cart.filter((i) => i.productId !== productId)); }

  function finishSale() {
    if (cart.length === 0) return setMessage("Adicione produtos antes de finalizar a venda.");
    const selectedMember = members.find((m) => m.id === memberId);
    const updatedProducts = products.map((product) => {
      const item = cart.find((i) => i.productId === product.id);
      return item ? { ...product, stock: product.stock - item.quantity } : product;
    });
    const newSale: Sale = { id: crypto.randomUUID(), date: new Date().toISOString(), items: cart, total, paymentMethod, memberId: selectedMember?.id, memberName: selectedMember?.name };
    const updatedSales = [newSale, ...sales];
    setProducts(updatedProducts); setSales(updatedSales);
    storage.saveProducts(updatedProducts); storage.saveSales(updatedSales);
    setCart([]); setMemberId(""); setPaymentMethod("pix"); setMessage("Venda finalizada com sucesso. Oss!");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <section className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
      <div className="card">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h2 className="text-2xl font-black">Caixa da academia</h2><p className="text-slate-500">Venda bebidas, suplementos e produtos do tatame.</p></div></div>
        <form onSubmit={submitBarcode} className="flex gap-3 mb-4">
          <input ref={inputRef} value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Digite ou leia o código de barras" className="w-full border rounded-2xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-red-600" autoFocus />
          <button className="btn-primary">Adicionar</button>
        </form>
        <div className="mb-4 bg-slate-100 rounded-2xl px-4 py-3 font-semibold">{message}</div>
        <div className="overflow-x-auto"><table className="w-full text-left border-separate border-spacing-y-2"><thead><tr className="text-slate-500 text-sm"><th>Produto</th><th>Qtd</th><th>Unitário</th><th>Total</th><th>Ações</th></tr></thead><tbody>
          {cart.map((item) => <tr key={item.productId} className="bg-slate-50"><td className="p-3 rounded-l-xl font-bold">{item.name}</td><td className="p-3">{item.quantity}</td><td className="p-3">{money(item.unitPrice)}</td><td className="p-3 font-black">{money(item.quantity * item.unitPrice)}</td><td className="p-3 rounded-r-xl"><div className="flex gap-2"><button onClick={() => decrease(item.productId)} className="btn-light" type="button">-</button><button onClick={() => increase(item.productId)} className="px-3 py-2 rounded-xl bg-slate-950 text-white font-bold" type="button">+</button><button onClick={() => removeItem(item.productId)} className="btn-danger" type="button">Remover</button></div></td></tr>)}
          {cart.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-slate-500">Nenhum produto no caixa.</td></tr>}
        </tbody></table></div>
      </div>
      <aside className="card h-fit">
        <h3 className="text-xl font-black mb-4">Resumo da venda</h3>
        <div className="bg-gradient-to-br from-slate-950 to-red-950 text-white rounded-3xl p-5 mb-4"><p className="text-slate-300">Total a receber</p><strong className="text-4xl">{money(total)}</strong></div>
        <label className="font-bold">Forma de pagamento</label><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="input mt-2"><option value="pix">Pix</option><option value="dinheiro">Dinheiro</option><option value="cartão">Cartão</option></select>
        <label className="font-bold">Aluno / sócio</label><select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="input mt-2"><option value="">Venda sem aluno vinculado</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name} • {m.belt} • {checkMemberStatus(m.dueDate, m.status)}</option>)}</select>
        <button onClick={finishSale} className="w-full btn-primary">Finalizar venda</button>
      </aside>
    </section>
  );
}
