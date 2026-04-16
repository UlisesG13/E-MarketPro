// ─────────────────────────────────────────────────────────
// CUSTOMER TYPES — Tipos del Cliente / Comprador
// ─────────────────────────────────────────────────────────

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'customer' | 'buyer';
  preferences: CustomerPreferences;
  createdAt: string;
}

export interface CustomerProfile {
  fullName: string;
  email: string;
  phone: string;
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

export interface CustomerLoginResponse {
  token: string;
  customer: CustomerUser;
}

export interface CustomerRegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}
