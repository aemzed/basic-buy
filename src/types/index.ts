export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shipping: {
    name: string;
    address: string;
    province: string;
    city: string;
    district: string;
    courier: string;
    cost: number;
  };
  status: string;
  createdAt: string;
}

export interface ShippingCost {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}
