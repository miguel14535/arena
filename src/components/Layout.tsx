import { ReactNode } from "react";

interface LayoutProps {
  page: string;
  setPage: (page: string) => void;
  children: ReactNode;
}

const menu = [
  { id: "pdv", label: "Caixa" },
  { id: "produtos", label: "Produtos" },
  { id: "socios", label: "Alunos" },
  { id: "historico", label: "Vendas" },
  { id: "relatorios", label: "Relatórios" },
];

export default function Layout({ page, setPage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-gradient-to-r from-dojo-dark via-slate-950 to-red-950 text-white px-6 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-2xl font-black shadow-lg">JJ</div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Arena</h1>
              <p className="text-slate-300 text-sm">PDV para academia de Jiu-Jitsu • caixa, alunos, estoque e relatórios</p>
            </div>
          </div>
          <div className="bg-yellow-400 text-slate-950 px-5 py-3 rounded-2xl font-black shadow">Academia de Jiu-Jitsu</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <nav className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`rounded-2xl px-4 py-4 font-bold shadow-sm transition ${page === item.id ? "bg-red-600 text-white" : "bg-white hover:bg-slate-200"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {children}
      </main>
    </div>
  );
}
