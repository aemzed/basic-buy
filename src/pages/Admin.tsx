import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingBag, Users } from "lucide-react";
import productsData from "@/data/products.json";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }

    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, [isAdmin, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Dashboard Admin</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{productsData.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pesanan
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendapatan
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada pesanan
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.items.map((item: any) => (
                        <p key={item.id} className="text-sm">
                          {item.name} ({item.quantity}x) - {formatPrice(item.price * item.quantity)}
                        </p>
                      ))}
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Pengiriman ({order.shipping.courier.toUpperCase()})</span>
                        <span>{formatPrice(order.shipping.cost)}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-1">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
