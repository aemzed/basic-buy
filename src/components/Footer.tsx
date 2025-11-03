const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">TokoKita</h3>
            <p className="text-sm text-muted-foreground">
              Platform e-commerce modern untuk semua kebutuhan Anda.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/products" className="text-muted-foreground hover:text-primary">
                  Produk
                </a>
              </li>
              <li>
                <a href="/cart" className="text-muted-foreground hover:text-primary">
                  Keranjang
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@tokokita.com<br />
              Telp: +62 812-3456-7890
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TokoKita. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
