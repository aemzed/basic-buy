import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import productsData from "@/data/products.json";
import { Product } from "@/types";

const Index = () => {
  const featuredProducts = (productsData as Product[]).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Belanja Modern, Praktis, dan Terpercaya
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Temukan produk terbaik dengan harga terjangkau dan pengiriman cepat ke seluruh Indonesia
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Mulai Belanja
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Produk Berkualitas</h3>
              <p className="text-muted-foreground">
                Ribuan produk original dengan kualitas terjamin
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pengiriman Cepat</h3>
              <p className="text-muted-foreground">
                Gratis ongkir dan pengiriman ke seluruh Indonesia
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pembayaran Aman</h3>
              <p className="text-muted-foreground">
                Transaksi aman dengan berbagai metode pembayaran
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Produk Unggulan</h2>
            <p className="text-xl text-muted-foreground">
              Pilihan terbaik untuk Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
