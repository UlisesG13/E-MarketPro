import { useCustomerProfileStore } from '../store/customerProfileStore';

export function useCustomerProfile() {
  return useCustomerProfileStore();
}
