import { apiClient } from '../../../shared/services/apiClient';
import type { CustomerAddress } from '../types/customer.types';

export interface DireccionDTO {
  direccion_id: number;
  calle: string;
  colonia: string;
  numero_casa: number;
  codigo_postal: string;
  usuario_id: string;
  is_primary: boolean;
  calle_uno?: string | null;
  calle_dos?: string | null;
  referencia?: string | null;
}

export interface DireccionRequestDTO {
  calle: string;
  colonia: string;
  numero_casa: number;
  codigo_postal: string;
  is_primary: boolean;
  calle_uno?: string | null;
  calle_dos?: string | null;
  referencia?: string | null;
}

const ADDRESS_RESOURCE_PATH = '/users/direcciones';

function toCustomerAddress(dto: DireccionDTO): CustomerAddress {
  return {
    id: String(dto.direccion_id),
    backendAddressId: dto.direccion_id,
    label: dto.is_primary ? 'Principal' : 'Dirección',
    recipient: 'Titular',
    phone: '',
    street: dto.calle,
    city: dto.colonia,
    state: '',
    zipCode: dto.codigo_postal,
    numeroCasa: dto.numero_casa,
    colonia: dto.colonia,
    calleUno: dto.calle_uno ?? undefined,
    calleDos: dto.calle_dos ?? undefined,
    references: dto.referencia ?? undefined,
    isDefault: dto.is_primary,
  };
}

function toRequestDTO(address: Omit<CustomerAddress, 'id'>): DireccionRequestDTO {
  const numeroCasa = Number(address.numeroCasa ?? 1);
  return {
    calle: address.street.trim(),
    colonia: (address.colonia ?? address.city ?? 'Centro').trim(),
    numero_casa: Number.isFinite(numeroCasa) && numeroCasa > 0 ? numeroCasa : 1,
    codigo_postal: address.zipCode,
    is_primary: Boolean(address.isDefault),
    calle_uno: address.calleUno ?? null,
    calle_dos: address.calleDos ?? null,
    referencia: address.references ?? null,
  };
}

export const addressService = {
  list: async (): Promise<CustomerAddress[]> => {
    const data = await apiClient.get<DireccionDTO[]>(ADDRESS_RESOURCE_PATH, 'customer', 'products');
    return data.map(toCustomerAddress);
  },

  create: async (address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress> => {
    const data = await apiClient.post<DireccionDTO>(
      ADDRESS_RESOURCE_PATH,
      toRequestDTO(address),
      'customer',
      'products'
    );
    return toCustomerAddress(data);
  },

  setPrimary: async (direccionId: number): Promise<void> => {
    await apiClient.post<{ message: string }>(
      `${ADDRESS_RESOURCE_PATH}/${direccionId}/set_primary`,
      {},
      'customer',
      'products'
    );
  },

  getById: async (direccionId: number): Promise<CustomerAddress | null> => {
    const data = await apiClient.get<DireccionDTO[]>(
      `${ADDRESS_RESOURCE_PATH}/${direccionId}`,
      'customer',
      'products'
    );
    return data.length > 0 ? toCustomerAddress(data[0]) : null;
  },

  update: async (direccionId: number, address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress> => {
    const data = await apiClient.put<DireccionDTO>(
      `${ADDRESS_RESOURCE_PATH}/${direccionId}`,
      toRequestDTO(address),
      'customer',
      'products'
    );
    return toCustomerAddress(data);
  },

  remove: async (direccionId: number): Promise<void> => {
    await apiClient.delete<{ message: string }>(
      `${ADDRESS_RESOURCE_PATH}/${direccionId}`,
      'customer',
      'products'
    );
  },
};
