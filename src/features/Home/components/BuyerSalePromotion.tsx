import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/features/ProductCatalogue/constants';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/features/ProductCatalogue/components/ProductFilter';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';

const BuyerSalePromotionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const { favourites, toggleFavourite, checkFavourite } = useFavourites();
  const [filters, setFilters] = useState<{
    categories: string[];
    minPrice: number;
    maxPrice: number;
    conditions: string[]; 
    deliveryMethods: string[];
  }>({
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    conditions: [],
    deliveryMethods: [],
  });
  const navigate = useNavigate();

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/active', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data: Product[] = await response.json();

          const filteredProducts = data.filter((product) => {
            // Check if the product has promotions
            if (
              product.promotions &&
              Array.isArray(product.promotions) &&
              product.promotions.length > 0
            ) {
              // Check if any promotion is ACTIVE
              return product.promotions.some(
                (promotion) => promotion.status === 'ACTIVE',
              );
            }
            return false; // Return false if the product has no promotions
          });
          // Sort products
          const sortedProducts = filteredProducts.sort((a, b) => {
            // First, prioritize boosted products
            // First, prioritize boosted products
            if (a.boostStatus === 'ACTIVE' && b.boostStatus !== 'ACTIVE')
              return -1;
            if (b.boostStatus === 'ACTIVE' && a.boostStatus !== 'ACTIVE')
              return 1;

            // Then, sort by bestBeforeDate of the first batch
            const aDate = new Date(a.batches[0]?.bestBeforeDate || '');
            const bDate = new Date(b.batches[0]?.bestBeforeDate || '');
            return aDate.getTime() - bDate.getTime();
          });

          setProducts(sortedProducts);
          setFilteredResults(sortedProducts);
          console.log(sortedProducts);
          sortedProducts.forEach((product: Product) => {
            checkFavourite(product.productId);
          });
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = products.filter((product) => {
        const matchesCategory =
          filters.categories.length === 0 ||
          filters.categories.includes(product.foodCategory);
        const matchesPrice =
          product.price >= filters.minPrice &&
          product.price <= filters.maxPrice;
        const matchesCondition =
          filters.conditions.length === 0 ||
          filters.conditions.includes(product.foodCondition); // Cast to string
        const matchesDeliveryMethod =
          filters.deliveryMethods.length === 0 ||
          filters.deliveryMethods.includes(product.deliveryMethod);

        return (
          matchesCategory &&
          matchesPrice &&
          matchesCondition &&
          matchesDeliveryMethod
        );
      });
      setFilteredResults(filtered);
    };

    applyFilters();
  }, [products, filters]);

  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  const handleFilter = (newFilters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    conditions: string[]; 
    deliveryMethods: string[];
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div>
      <section className="w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Discounted Products
        </h1>
        <div className="flex mb-6">
          {/* Filter */}
          <div className="w-1/4 pr-8 pl-8">
            <ProductFilter onFilter={handleFilter} initialFilters={filters} />
          </div>

          {/* Products Listings */}
          <div className="w-3/4 pl-8">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                filteredResults.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    isFavourite={favourites?.some(
                      (fav) => fav.productId === product.productId,
                    )}
                    onToggleFavourite={() => toggleFavourite(product.productId)}
                    onProductClick={handleProductClick}
                    isPromotionalPage={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-gray-500">No Products</p>
                </div>
              )}
            </div>
            {filteredResults.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No promotional products found. Try adjusting your filters.
            </p>
          )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyerSalePromotionPage;
