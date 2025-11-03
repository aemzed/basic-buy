import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="text-xl font-bold text-foreground">TokoKita</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="font-medium"
              >
                Beranda
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant={isActive("/products") ? "default" : "ghost"}
                className="font-medium"
              >
                Produk
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  className="font-medium"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
