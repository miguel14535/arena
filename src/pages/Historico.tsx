import { useMemo, useState } from "react";
import { Sale } from "../types";
import { money } from "../lib/storage";

interface Props { sales: Sale[]; }
export default function Historico({ sales }: Props) {
  const [date, setDate] = useState(""); const [payment, setPayment] = useState(""); const [member, setMember] = useState("");
  const filtered = useMemo(() => sales.filter((sale) => {
    const matchDate = date ? sale.date.slice(0, 10) === date : true;
    const matchPayment = payment ? sale.paymentMethod === payment : true;
    const matchMember = member ? sale.memberName?.toLowerCase().includes(member.toLowerCase()) : true;
    return matchDate && matchPayment && matchMember;
  }), [sales, date, payment, member]);
  return <section className="card"><h2 className="text-2xl font-black mb-4">Histórico de vendas do dojo</h2><div className="grid md:grid-cols-3 gap-3 mb-5"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" /><select value={payment} onChange={(e) => setPayment(e.target.value)} className="input"><option value="">Todas as formas</option><option value="dinheiro">Dinheiro</option><option value="cartão">Cartão</option><option value="pix">Pix</option></select><input placeholder="Filtrar por aluno" value={member} onChange={(e) => setMember(e.target.value)} className="input" /></div><div className="space-y-4">{filtered.map((sale) => <div key={sale.id} className="border rounded-3xl p-4 bg-slate-50"><div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3"><div><strong className="text-lg">{new Date(sale.date).toLocaleString("pt-BR")}</strong><p className="text-slate-500">Pagamento: {sale.paymentMethod} {sale.memberName && `• Aluno: ${sale.memberName}`}</p></div><strong className="text-2xl">{money(sale.total)}</strong></div><div className="grid md:grid-cols-2 gap-2">{sale.items.map((item) => <div key={item.productId} className="bg-white rounded-2xl p-3">{item.name} — {item.quantity}x {money(item.unitPrice)}</div>)}</div></div>)}{filtered.length === 0 && <p className="text-center py-10 text-slate-500">Nenhuma venda encontrada.</p>}</div></section>;
}
