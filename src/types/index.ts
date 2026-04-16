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
  slug: string;
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

export interface CustomerAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  references?: string;
  isDefault?: boolean;
}

export interface CustomerPreferences {
  marketingEmails: boolean;
  orderUpdates: boolean;
  savedCards: boolean;
}

export interface CustomerProfile {
  fullName: string;
  email: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface PlanFeatureGroup {
  category: string;
  icon: string;
  items: { name: string; description: string; included: boolean }[];
}

export interface PlanLimits {
  products: number | 'unlimited';
  users: number | 'unlimited';
  storageMB: number | 'unlimited';
  apiCalls: number | 'unlimited';
}

export interface PlanKPI {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
}

export interface PlanRevenuePoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface PlanTool {
  name: string;
  description: string;
  icon: string;
}

export interface PlanDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  period: string;
  gradient: [string, string];
  accentColor: string;
  featureGroups: PlanFeatureGroup[];
  limits: PlanLimits;
  tools: PlanTool[];
  simulatedKPIs: PlanKPI[];
  simulatedRevenue: PlanRevenuePoint[];
  badge?: string;
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  plan: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatQuickAction {
  label: string;
  response: string;
}

export interface StoreOrder extends Order {
  shippingMethod: string;
  shippingCost: number;
  trackingCode?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  href?: string;
  read: boolean;
  kind: 'order' | 'system' | 'insight' | 'customer';
}
