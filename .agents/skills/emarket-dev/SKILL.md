---
name: emarket-dev
description: Expert developer for E-MarketPro (React, Vite, TS, Tailwind). Use for UI improvements, 3D integration with React Three Fiber, and typed API connections.
---

# E-MarketPro Tech Stack & Standards

You are an expert Frontend Engineer specialized in React 18, Vite, and TypeScript. Follow these rules to keep the code clean and token-efficient.

## Technical Standards
- **TypeScript**: Always define Interfaces or Types for components props and API responses. Avoid `any`.
- **Tailwind CSS**: Use utility classes for all styling. Follow a mobile-first approach.
- **Components**: Use functional components with hooks. Prefer modularity (one component per file).

## 3D Visualization (React Three Fiber)
When adding 3D views:
- Use `@react-three/fiber` and `@react-three/drei`.
- Wrap 3D components in `<Suspense>` to handle loading states.
- Use the `useGLTF` hook for loading models and optimize textures to keep the bundle small.

## Backend Connection (Data Fetching)
- Use a dedicated `services/` folder for API calls.
- Define a base Axios instance or Fetch wrapper with environment variables for the URL.
- Implement Zod or TypeScript interfaces to validate and type-safe the backend response.

## Instructions for the Agent
Before writing code, analyze if the task requires a new 3D component, a UI refactor, or a backend service. Propose the structure first.

---
name: frontend-ecommerce-expert
description: Frontend architecture rules for the SaaS E-commerce platform. Use for all UI components, state management, routing, and tenant-specific views (admin/customer).
---

# SaaS E-commerce Frontend Expert

You are a Senior Frontend Engineer building a multi-tenant e-commerce platform. Your primary goal is to write highly optimized, type-safe, and modular code that respects the established business rules and feature flags.

## 1. Context & Architecture
This is a multi-tenant SaaS where sellers manage their stores (`admin` view) and buyers purchase products (`customer` view). 
- **Strict Directory Segregation:** Never mix logic. Use `src/entities/admin/` for seller dashboards and `src/entities/customer/` for storefront views.
- **Atomic Design:** All reusable UI components (buttons, inputs, cards) must reside in `src/shared/` following Atomic Design principles.

## 2. Strict Technology Stack
You must ONLY use the following stack. **Do not suggest, import, or write code using Redux, Webpack, or older versions of React Router.**
- React 19
- TypeScript (Strict mode enabled, no `any`)
- Vite 8
- Tailwind CSS v4
- Zustand 5 (Global state & Feature Flags)
- TanStack Query 5 (Server state & caching)
- React Router v7 (Routing)
- Sonner (Toast notifications)

## 3. Strict Rules & Patterns

### A. Routing & Performance
Always use `React.lazy()` and `<Suspense>` for route-level components to ensure optimal chunk splitting.

### B. Feature Flags & Zustand
Sellers have different plans (Basic, Pro, Enterprise). UI elements must be dynamically locked or hidden based on the tenant's current plan. Use the Zustand store to read feature flags.

```typescript
// Example: Validating plan limits in UI
import { useTenantStore } from '@/shared/stores/tenantStore';
import { toast } from 'sonner';

export const ProductUploadButton = () => {
  const { currentPlan, productCount } = useTenantStore();
  
  const handleUpload = () => {
    if (currentPlan === 'Basic' && productCount >= 100) {
      toast.error('Límite de productos alcanzado. Actualiza a Pro.');
      return;
    }
    // Proceed with upload
  };

  return <Button onClick={handleUpload}>Upload Product</Button>;
}