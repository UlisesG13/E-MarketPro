// ─────────────────────────────────────────────────────────
// PLAN TYPES — feature flags system
// ─────────────────────────────────────────────────────────

export type PlanId = 'basic' | 'pro' | 'enterprise';

export interface PlanFeatures {
  maxProducts: number | 'unlimited';
  maxAdminUsers: number | 'unlimited';
  hasAdvancedAnalytics: boolean;
  hasCustomDomain: boolean;
  hasPrioritySupport: boolean;
  hasCSVImportExport: boolean;
  hasExtendedMediaStorage: boolean;
  paymentCommissionPercent: number;
  paymentCommissionFixed: number; // en MXN
}

// ─────────────────────────────────────────────────────────
// BASE TYPES — re-exported here for backward compatibility
// These support old component imports that reference common.types
// ─────────────────────────────────────────────────────────

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
  storeId?: string;
  storeName?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

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

export interface StoreOrder extends Order {
  shippingMethod: string;
  shippingCost: number;
  trackingCode?: string;
  storeId?: string;
  storeName?: string;
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

export interface CartItem {
  storeId: string;
  storeName: string;
  product: Product;
  quantity: number;
}

// ─────────────────────────────────────────────────────────
// SHARED TYPES — used by both entities (admin + customer)
// ─────────────────────────────────────────────────────────

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

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  href?: string;
  read: boolean;
  kind: 'order' | 'system' | 'insight' | 'customer';
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

// ─── API Response wrapper ─────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Auth ─────────────────────────────────────────────────

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ─── Backend plan ─────────────────────────────────────────

export interface Plan {
  id: PlanId;
  name: string;
  price_monthly: number;
  max_products: number | null;
  max_admin_users: number | null;
  has_advanced_analytics: boolean;
  has_custom_domain: boolean;
  has_csv_import_export: boolean;
  has_extended_media: boolean;
  payment_commission_percent: number;
  payment_commission_fixed: number;
}

// ─────────────────────────────────────────────────────────
// ANALYTICS / FINANCIAL TYPES
// ─────────────────────────────────────────────────────────

export interface WeeklyRevenue {
  week?: string;
  day?: string;
  revenue: number;
  orders: number;
  expenses?: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface CostBreakdown {
  category?: string;
  role?: string;
  amount: number;
  percentage?: number;
  color?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  joinedAt?: string;
  permissions?: string[];
  hourlyRate?: number;
}

export interface ProjectPhase {
  id?: string;
  name: string;
  status?: 'completed' | 'in-progress' | 'planned';
  startDate?: string;
  endDate?: string;
  progress?: number;
  description?: string;
  activities: ProjectActivity[];
}

export interface ProjectActivity {
  id?: string;
  name: string;
  status?: 'completed' | 'in-progress' | 'pending';
  date?: string;
  responsible?: string;
  hours?: number;
  cost?: number;
}
