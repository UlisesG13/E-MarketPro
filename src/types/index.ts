export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'draft' | 'archived';
  sku: string;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  avatar: string;
  email: string;
}

export interface ProjectPhase {
  name: string;
  activities: ProjectActivity[];
}

export interface ProjectActivity {
  name: string;
  cost: number;
  hours: number;
  responsible: string;
}

export interface WeeklyRevenue {
  week: string;
  revenue: number;
  orders: number;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export interface Competitor {
  name: string;
  monthlyFee: string;
  commission: string;
  customDomain: boolean;
  analytics: boolean;
  multiPayment: boolean;
  support: string;
  highlighted?: boolean;
}

export interface KPIData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: string;
}

export interface CostBreakdown {
  role: string;
  amount: number;
  color: string;
}

export interface PhaseActivityData {
  phase: string;
  hours: number;
  cost: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}
