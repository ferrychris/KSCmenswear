import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/search/SearchBar';
import { Filter } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { results, loading, error, search } = useSearch();

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Results</h1>
          <div className="w-full max-w-2xl">
            <SearchBar initialQuery={query} />
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Found {results.length} results for "{query}"
              </p>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </button>
            </div>
            <ProductGrid products={results} isLoading={loading} />
          </>
        ) : !loading ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              No results found for "{query}"
            </h2>
            <p className="text-gray-600 mb-8">
              Try checking your spelling or using different keywords
            </p>
            <div className="inline-flex flex-col items-center space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Popular searches
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Suits', 'Tuxedos', 'Wedding', 'Prom'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      window.location.href = `/search?q=${term.toLowerCase()}`;
                    }}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}