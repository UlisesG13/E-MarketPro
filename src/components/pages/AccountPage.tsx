import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, MapPinned, Plus, Settings2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useCustomerStore } from '../../store/customerStore';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Badge from '../atoms/Badge';

const AccountPage: React.FC = () => {
  const profile = useCustomerStore((state) => state.profile);
  const addresses = useCustomerStore((state) => state.addresses);
  const preferences = useCustomerStore((state) => state.preferences);
  const updateProfile = useCustomerStore((state) => state.updateProfile);
  const savePreferences = useCustomerStore((state) => state.savePreferences);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const updateAddress = useCustomerStore((state) => state.updateAddress);
  const removeAddress = useCustomerStore((state) => state.removeAddress);

  const [profileForm, setProfileForm] = useState(profile);
  const [addressForm, setAddressForm] = useState({
    label: '',
    recipient: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    references: '',
    isDefault: addresses.length === 0,
  });

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    toast.success('Datos personales actualizados');
  };

  const handleAddAddress = () => {
    if (
      !addressForm.label.trim() ||
      !addressForm.recipient.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.street.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.zipCode.trim()
    ) {
      toast.error('Completa los datos de la dirección');
      return;
    }

    addAddress(addressForm);
    setAddressForm({
      label: '',
      recipient: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      references: '',
      isDefault: false,
    });
    toast.success('Dirección agregada');
  };

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Mi cuenta</h1>
          <p className="mt-1 text-sm text-gray-400">
            Gestiona tus datos, direcciones y preferencias desde un solo lugar.
          </p>
        </div>
        <Link
          to="/account/orders"
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Ver historial de pedidos
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center gap-3">
            <UserRound className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Datos personales</h2>
              <p className="text-sm text-gray-400">Información principal de tu cuenta.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nombre completo"
              value={profileForm.fullName}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, fullName: event.target.value }))
              }
            />
            <Input
              label="Correo"
              type="email"
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <Input
              label="Teléfono"
              className="md:col-span-2"
              value={profileForm.phone}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, phone: event.target.value }))
              }
            />
          </div>

          <Button className="mt-5" onClick={handleSaveProfile}>
            Guardar cambios
          </Button>
        </article>

        <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Configuración</h2>
              <p className="text-sm text-gray-400">Ajusta cómo quieres recibir información.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'orderUpdates' as const,
                label: 'Recibir actualizaciones de pedido',
                description: 'Te avisamos cambios de estado y seguimiento.',
              },
              {
                key: 'marketingEmails' as const,
                label: 'Recibir promociones y novedades',
                description: 'Ofertas, colecciones y campañas activas.',
              },
              {
                key: 'savedCards' as const,
                label: 'Guardar método de pago para próximas compras',
                description: 'Solo disponible como preferencia local en este demo.',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={(event) =>
                    savePreferences({ [item.key]: event.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-5 w-5 text-indigo-300" />
              Tus preferencias quedan guardadas para mantener el flujo del cliente consistente en
              futuras visitas.
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-violet-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Direcciones</h2>
              <p className="text-sm text-gray-400">Tus destinos frecuentes para compra.</p>
            </div>
          </div>
          <Badge variant="purple">{addresses.length} guardada(s)</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{address.label}</h3>
                      {address.isDefault && <Badge variant="success">Predeterminada</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{address.recipient}</p>
                    <p className="text-sm text-gray-400">
                      {address.street}, {address.city}, {address.state}, {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>

                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => updateAddress(address.id, { isDefault: true })}
                        className="rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        Hacer principal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAddress(address.id)}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-400" />
              <p className="font-semibold text-white">Agregar dirección</p>
            </div>
            <div className="grid gap-3">
              <Input
                label="Etiqueta"
                value={addressForm.label}
                onChange={(event) =>
                  setAddressForm((current) => ({ ...current, label: event.target.value }))
                }
              />
              <Input
                label="Persona que recibe"
                value={addressForm.recipient}
                onChange={(event) =>
                  setAddressForm((current) => ({ ...current, recipient: event.target.value }))
                }
              />
              <Input
                label="Teléfono"
                value={addressForm.phone}
                onChange={(event) =>
                  setAddressForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
              <Input
                label="Calle y número"
                value={addressForm.street}
                onChange={(event) =>
                  setAddressForm((current) => ({ ...current, street: event.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ciudad"
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, city: event.target.value }))
                  }
                />
                <Input
                  label="Estado"
                  value={addressForm.state}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, state: event.target.value }))
                  }
                />
              </div>
              <Input
                label="Código postal"
                value={addressForm.zipCode}
                onChange={(event) =>
                  setAddressForm((current) => ({ ...current, zipCode: event.target.value }))
                }
              />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      isDefault: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500"
                />
                Guardar como dirección principal
              </label>
              <Button onClick={handleAddAddress}>Guardar dirección</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
