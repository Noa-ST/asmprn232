import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    api.get("/Products").then((res) => setProducts(res.data));
  }, []);

  // Filter + Sort
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase().trim()))
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/Products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
        toast.success("🗑 Product deleted!");
      } catch {
        toast.error("❌ Failed to delete product!");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search product..."
          className="flex-1 border rounded-md px-3 py-2"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="border rounded-md px-3 py-2"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="name_asc">Name A-Z</option>
        </select>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        📦 Product List
      </h2>

      {paginatedProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition max-w-sm mx-auto flex flex-col h-[450px]"
            >
              {p.image && (
                <div className="w-full h-[250px] bg-gray-100 rounded-t-xl flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {p.description}
                  </p>
                  <p className="text-green-600 font-bold mt-2">
                    {p.price.toLocaleString()} $
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/detail/${p.id}`}
                    className="flex-1 text-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    🔍 View
                  </Link>
                  <Link
                    to={`/edit/${p.id}`}
                    className="flex-1 text-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    ✏ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* chọn số sản phẩm/trang */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1"
          >
            <option value={8}>8 / page</option>
            <option value={16}>16 / page</option>
            <option value={32}>32 / page</option>
          </select>

          {/* số trang */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
