"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlice";
import { useSearchParams, usePathname } from "next/navigation";

interface ProductListParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

export default function ProductsList() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!searchParams) return;
    
    const params: ProductListParams = {
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "latest",
      page: searchParams.get("page") || "1"
    };
    
    // @ts-expect-error: fetchProducts expects params type mismatch due to Redux Thunk typing
    dispatch(fetchProducts({
      ...params,
      page: parseInt(params.page || "1", 10)
    }));
  }, [dispatch, searchParams, pathname]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2>Products List</h2>
      {/* Filters UI here, similar to your old code, using handleFilterChange */}
      {/* Product grid here, using products from Redux */}
      {/* Pagination here, updating filters.page */}
      {/* Use <Link href={`/product/${product._id}`}> instead of react-router-dom Link */}
    </div>
  );
}
