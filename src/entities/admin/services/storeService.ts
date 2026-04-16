import { apiClient } from '../../../shared/services/apiClient';
import type { Store } from '../types/admin.types';
import type { AdminSettings, UpdateSettingsInput } from '../types/settings.types';

export const storeService = {
  /**
   * Get the admin's store data.
   * GET /admin/store
   */
  get: (): Promise<Store> =>
    apiClient.get<Store>('/admin/store', 'admin'),

  /**
   * Update the admin's store data.
   * PUT /admin/store
   */
  update: (data: Partial<Store>): Promise<Store> =>
    apiClient.put<Store>('/admin/store', data, 'admin'),

  /**
   * Get admin settings.
   * GET /admin/settings
   */
  getSettings: (): Promise<AdminSettings> =>
    apiClient.get<AdminSettings>('/admin/settings', 'admin'),

  /**
   * Update admin settings.
   * PUT /admin/settings
   */
  updateSettings: (input: UpdateSettingsInput): Promise<AdminSettings> =>
    apiClient.put<AdminSettings>('/admin/settings', input, 'admin'),

  /**
   * Get available plans.
   * GET /admin/plans
   */
  getPlans: (): Promise<unknown[]> =>
    apiClient.get<unknown[]>('/admin/plans', 'public'),

  /**
   * Subscribe to a plan.
   * POST /admin/subscribe/:planId
   */
  subscribePlan: (planId: string): Promise<{ success: boolean; message: string }> =>
    apiClient.post<{ success: boolean; message: string }>(
      `/admin/subscribe/${planId}`,
      {},
      'admin'
    ),
};
