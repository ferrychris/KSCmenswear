import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Import pages with proper error handling
const Home = lazy(() => import('../pages/home'));
const Products = lazy(() => import('../pages/products'));
const ProductDetail = lazy(() => import('../pages/product-detail'));
const Cart = lazy(() => import('../pages/cart'));
const NotFound = lazy(() => import('../pages/not-found'));
const ShippingPolicy = lazy(() => import('../pages/shipping'));
const Returns = lazy(() => import('../pages/returns'));
const Policies = lazy(() => import('../pages/policies'));
const Privacy = lazy(() => import('../pages/privacy'));
const Alterations = lazy(() => import('../pages/alterations'));
const FAQ = lazy(() => import('../pages/faq'));
const Locations = lazy(() => import('../pages/locations'));
const Contact = lazy(() => import('../pages/contact'));
const About = lazy(() => import('../pages/about'));
const Blog = lazy(() => import('../pages/blog'));
const BlogPost = lazy(() => import('../pages/blog/[id]'));
const NewArrivals = lazy(() => import('../pages/collections/new-arrivals'));
const RedCollection = lazy(() => import('../pages/collections/red-collection'));

// Collection pages
const SuitCollections = lazy(() => import('../pages/collections/suits'));
const TwoPieceSuits = lazy(() => import('../pages/collections/suits/two-piece'));
const DoubleBreasted = lazy(() => import('../pages/collections/suits/double-breasted'));
const Tuxedos = lazy(() => import('../pages/collections/suits/tuxedos'));
const ThreePieceSuits = lazy(() => import('../pages/collections/suits/three-piece'));
const AccessoriesHome = lazy(() => import('../pages/collections/accessories'));
const CasualCollection = lazy(() => import('../pages/collections/casual'));
const FormalFootwear = lazy(() => import('../pages/collections/footwear'));

// Winter Collection pages
const WinterCollection = lazy(() => import('../pages/collections/winter'));
const WinterSweaters = lazy(() => import('../pages/collections/winter/sweaters'));
const WinterBoots = lazy(() => import('../pages/collections/winter/boots'));
const PufferJackets = lazy(() => import('../pages/collections/winter/puffer-jackets'));
const Overcoats = lazy(() => import('../pages/collections/winter/overcoats'));

// Wedding pages
const WeddingHome = lazy(() => import('../pages/wedding'));
const WeddingSignUp = lazy(() => import('../pages/wedding/sign-up'));
const WeddingServices = lazy(() => import('../pages/wedding/services'));
const WeddingSuits = lazy(() => import('../pages/collections/wedding/wedding-suits'));
const GroomsmenSuits = lazy(() => import('../pages/collections/wedding/groomsmen-suits'));
const RusticWedding = lazy(() => import('../pages/collections/wedding/rustic'));
const SummerWedding = lazy(() => import('../pages/collections/wedding/summer'));
const FallWedding = lazy(() => import('../pages/collections/wedding/fall'));
const ModernWedding = lazy(() => import('../pages/collections/wedding/modern'));
const WeddingTies = lazy(() => import('../pages/collections/wedding/wedding-ties'));
const WeddingTuxedos = lazy(() => import('../pages/collections/wedding/wedding-tuxedos'));

// Prom pages
const PromHome = lazy(() => import('../pages/prom'));
const PromVideos = lazy(() => import('../pages/prom/videos'));
const SparkleBlazerCollection = lazy(() => import('../pages/collections/prom/sparkle-blazers'));
const PromTuxedoCollection = lazy(() => import('../pages/collections/prom/prom-tuxedos'));
const PromShirtsCollection = lazy(() => import('../pages/collections/prom/prom-shirts'));
const PromShoesCollection = lazy(() => import('../pages/collections/prom/prom-shoes'));
const PromBlazerCollection = lazy(() => import('../pages/collections/prom/prom-blazers'));
const SparklingVestsCollection = lazy(() => import('../pages/collections/prom/sparkling-vests'));
const PromBowtiesCollection = lazy(() => import('../pages/collections/prom/prom-bowties'));
const PromVestsCollection = lazy(() => import('../pages/collections/prom/prom-vests'));

// Rental pages
const RentalHome = lazy(() => import('../pages/rental'));
const WeddingRegistration = lazy(() => import('../pages/rental/wedding-registration'));

// Profile pages
const Favorites = lazy(() => import('../pages/profile/favorites'));
const Measurements = lazy(() => import('../pages/profile/measurements'));
const Orders = lazy(() => import('../pages/profile/orders'));

// Other pages
const Search = lazy(() => import('../pages/search'));
const Checkout = lazy(() => import('../pages/checkout'));

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:handle" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Collections Routes */}
          <Route path="/collections">
            <Route path="new-arrivals" element={<NewArrivals />} />
            <Route path="2025-ultimate-red-collection-for-men-red-suits-shoes-accessories-kct-menswear" element={<RedCollection />} />
            <Route path="suits" element={<SuitCollections />} />
            <Route path="suits/two-piece" element={<TwoPieceSuits />} />
            <Route path="suits/double-breasted" element={<DoubleBreasted />} />
            <Route path="suits/tuxedos" element={<Tuxedos />} />
            <Route path="suits/three-piece" element={<ThreePieceSuits />} />
            <Route path="accessories" element={<AccessoriesHome />} />
            <Route path="casual" element={<CasualCollection />} />
            <Route path="footwear" element={<FormalFootwear />} />
            
            {/* Winter Collection Routes */}
            <Route path="winter" element={<WinterCollection />} />
            <Route path="winter/sweaters" element={<WinterSweaters />} />
            <Route path="winter/boots" element={<WinterBoots />} />
            <Route path="winter/puffer-jackets" element={<PufferJackets />} />
            <Route path="winter/overcoats" element={<Overcoats />} />
          </Route>

          {/* Wedding Routes */}
          <Route path="/wedding" element={<WeddingHome />} />
          <Route path="/wedding/sign-up" element={<WeddingSignUp />} />
          <Route path="/wedding/services" element={<WeddingServices />} />
          <Route path="/collections/wedding-suits" element={<WeddingSuits />} />
          <Route path="/collections/groomsmen-suits" element={<GroomsmenSuits />} />
          <Route path="/collections/rustic-wedding" element={<RusticWedding />} />
          <Route path="/collections/summer-wedding" element={<SummerWedding />} />
          <Route path="/collections/fall-wedding" element={<FallWedding />} />
          <Route path="/collections/modern-wedding" element={<ModernWedding />} />
          <Route path="/collections/wedding-ties" element={<WeddingTies />} />
          <Route path="/collections/wedding-tuxedos" element={<WeddingTuxedos />} />

          {/* Prom Routes */}
          <Route path="/prom" element={<PromHome />} />
          <Route path="/prom/videos" element={<PromVideos />} />
          <Route path="/collections/sparkle-blazers" element={<SparkleBlazerCollection />} />
          <Route path="/collections/prom-tuxedos" element={<PromTuxedoCollection />} />
          <Route path="/collections/prom-shirts" element={<PromShirtsCollection />} />
          <Route path="/collections/prom-shoes" element={<PromShoesCollection />} />
          <Route path="/collections/prom-blazers" element={<PromBlazerCollection />} />
          <Route path="/collections/sparkling-vests" element={<SparklingVestsCollection />} />
          <Route path="/collections/prom-bowties" element={<PromBowtiesCollection />} />
          <Route path="/collections/prom-vests" element={<PromVestsCollection />} />

          {/* Rental Routes */}
          <Route path="/rental" element={<RentalHome />} />
          <Route path="/rental/wedding-registration" element={<WeddingRegistration />} />

          {/* Profile Routes */}
          <Route path="/profile">
            <Route path="favorites" element={<Favorites />} />
            <Route path="measurements" element={<Measurements />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* Info Pages */}
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/alterations" element={<Alterations />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}