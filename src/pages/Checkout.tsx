import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface Region {
  id: string;
  name: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    district: "",
    courier: "",
  });

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get-regions", {
        body: { type: "province" },
      });

      if (error) throw error;
      if (data?.success) {
        setProvinces(data.data);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Gagal memuat data provinsi");
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("get-regions", {
        body: { type: "city", parentId: provinceId },
      });

      if (error) throw error;
      if (data?.success) {
        setCities(data.data);
        setDistricts([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Gagal memuat data kota");
    }
  };

  const fetchDistricts = async (cityId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("get-regions", {
        body: { type: "district", parentId: cityId },
      });

      if (error) throw error;
      if (data?.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Gagal memuat data kecamatan");
    }
  };

  const couriers = [
    { value: "JNE", label: "JNE" },
    { value: "TIKI", label: "TIKI" },
    { value: "POS", label: "POS Indonesia" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateShipping = async () => {
    if (!formData.city || !formData.courier) {
      toast.error("Pilih kota dan kurir terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const cityName = cities.find((c) => c.id === formData.city)?.name || "";
      const totalWeight = cart.reduce((sum, item) => sum + item.quantity * 1000, 0);

      const { data, error } = await supabase.functions.invoke("calculate-shipping", {
        body: {
          courier: formData.courier.toUpperCase(),
          weight: totalWeight,
          destination: cityName,
        },
      });

      if (error) throw error;
      if (data?.success) {
        setShippingCost(data.data.cost);
        toast.success(
          `Ongkos kirim ${data.data.courier}: ${formatPrice(data.data.cost)} (${data.data.etd})`
        );
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      toast.error("Gagal menghitung ongkos kirim");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      const totalAmount = totalPrice + shippingCost;

      const provinceName = provinces.find((p) => p.id === formData.province)?.name || "";
      const cityName = cities.find((c) => c.id === formData.city)?.name || "";
      const districtName = districts.find((d) => d.id === formData.district)?.name || "";

      // Create payment invoice
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          orderId,
          amount: totalAmount,
          customerName: formData.name,
          customerEmail: formData.email,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });

      if (error) throw error;

      if (data?.success) {
        // Simpan order
        const order = {
          id: orderId,
          userId: user.id,
          items: cart,
          total: totalAmount,
          shipping: {
            ...formData,
            cost: shippingCost,
            fullAddress: `${formData.address}, ${districtName}, ${cityName}, ${provinceName}`,
          },
          paymentInvoiceId: data.data.id,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        clearCart();
        toast.success("Pesanan berhasil dibuat! Mengarahkan ke halaman pembayaran...");

        // Redirect to payment page (mock)
        setTimeout(() => {
          window.open(data.data.invoice_url, "_blank");
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08xxxxxxxxxx"
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
                      <Select
                        value={formData.province}
                        onValueChange={(value) => {
                          setFormData({ ...formData, province: value, city: "", district: "" });
                          setCities([]);
                          setDistricts([]);
                          fetchCities(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota/Kabupaten</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => {
                          setFormData({ ...formData, city: value, district: "" });
                          setDistricts([]);
                          fetchDistricts(value);
                        }}
                        disabled={!formData.province}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kota" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Kecamatan</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) =>
                          setFormData({ ...formData, district: value })
                        }
                        disabled={!formData.city}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
