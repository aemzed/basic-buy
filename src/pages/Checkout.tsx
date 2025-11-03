import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Package } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: "",
    province: "",
    city: "",
    district: "",
    courier: "",
  });

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const couriers = [
    { value: "jne", label: "JNE" },
    { value: "tiki", label: "TIKI" },
    { value: "pos", label: "POS Indonesia" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateShipping = async () => {
    if (!formData.province || !formData.city || !formData.courier) {
      toast.error("Lengkapi data pengiriman terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      // Simulasi API call RajaOngkir
      // Dalam implementasi nyata, ini akan memanggil edge function
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulasi biaya ongkir berdasarkan kurir
      const costs = {
        jne: 25000,
        tiki: 28000,
        pos: 20000,
      };
      
      const cost = costs[formData.courier as keyof typeof costs] || 25000;
      setShippingCost(cost);
      toast.success("Ongkos kirim berhasil dihitung");
    } catch (error) {
      toast.error("Gagal menghitung ongkos kirim");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (shippingCost === null) {
      toast.error("Hitung ongkos kirim terlebih dahulu");
      return;
    }

    // Simpan order (dalam implementasi nyata akan ke database)
    const order = {
      id: Date.now().toString(),
      userId: user.id,
      items: cart,
      total: totalPrice + shippingCost,
      shipping: {
        ...formData,
        cost: shippingCost,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Simpan ke localStorage untuk demo
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    clearCart();
    toast.success("Pesanan berhasil dibuat!");
    navigate("/");
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Data Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Penerima</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) =>
                          setFormData({ ...formData, province: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Kecamatan</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courier">Kurir Pengiriman</Label>
                    <Select
                      value={formData.courier}
                      onValueChange={(value) =>
                        setFormData({ ...formData, courier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kurir" />
                      </SelectTrigger>
                      <SelectContent>
                        {couriers.map((courier) => (
                          <SelectItem key={courier.value} value={courier.value}>
                            {courier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={calculateShipping}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghitung...
                      </>
                    ) : (
                      "Hitung Ongkos Kirim"
                    )}
                  </Button>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={shippingCost === null}
                  >
                    Bayar Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} ({item.quantity}x)
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium">
                      {shippingCost ? formatPrice(shippingCost) : "-"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {shippingCost
                        ? formatPrice(totalPrice + shippingCost)
                        : formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
