import { useState } from "react";
import Layout from "./components/Layout";
import PDV from "./pages/PDV";
import Produtos from "./pages/Produtos";
import Socios from "./pages/Socios";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import { storage } from "./lib/storage";

export default function App() {
  const [page, setPage] = useState("pdv");
  const [products, setProducts] = useState(storage.getProducts());
  const [members, setMembers] = useState(storage.getMembers());
  const [sales, setSales] = useState(storage.getSales());

  function renderPage() {
    if (page === "pdv") return <PDV products={products} setProducts={setProducts} members={members} sales={sales} setSales={setSales} />;
    if (page === "produtos") return <Produtos products={products} setProducts={setProducts} />;
    if (page === "socios") return <Socios members={members} setMembers={setMembers} />;
    if (page === "historico") return <Historico sales={sales} />;
    if (page === "relatorios") return <Relatorios sales={sales} products={products} />;
    return null;
  }

  return <Layout page={page} setPage={setPage}>{renderPage()}</Layout>;
}
