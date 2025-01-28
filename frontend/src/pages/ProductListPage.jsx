import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/utils/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Loader2 } from "lucide-react";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", page, debouncedSearch],
    queryFn: () => getProducts({ 
      offset: (page - 1) * 12, 
      limit: 12,
      search: debouncedSearch 
    }),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const products = data?.data || [];
  const meta = data?.meta || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Game Catalog</h1>
          <div className="flex items-center gap-4 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for a game..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-gray-500 text-lg mb-2">
              {search ? "No search results found" : "No products yet"}
            </div>
            {search && (
              <Button 
                variant="outline" 
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.genericName,
                    platform: product.platform,
                    publisher: product.publisher,
                    prices: product.prices || []
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>

            {products.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  Previous Page
                </Button>
                <span className="text-sm font-medium px-4 py-2 bg-white rounded-md border">
                  Page {page}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta.hasNextPage}
                >
                  Next Page
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}