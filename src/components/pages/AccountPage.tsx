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
          <h1 className="text-3xl font-black text-[var(--app-text)]">Mi cuenta</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Gestiona tus datos, direcciones y preferencias desde un solo lugar.
          </p>
        </div>
        <Link
          to="/account/orders"
          className="rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm font-medium text-[var(--app-text-muted)] transition-colors hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]"
        >
          Ver historial de pedidos
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="#perfil"
          className="rounded-full bg-[var(--app-primary-soft)] px-4 py-2 text-sm font-medium text-[var(--app-primary)]"
        >
          Perfil
        </a>
        <a
          href="#preferencias"
          className="rounded-full border border-[var(--app-border)] px-4 py-2 text-sm font-medium text-[var(--app-text-muted)] transition-colors hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          Preferencias
        </a>
        <a
          href="#direcciones"
          className="rounded-full border border-[var(--app-border)] px-4 py-2 text-sm font-medium text-[var(--app-text-muted)] transition-colors hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          Direcciones
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Direcciones activas', value: String(addresses.length) },
          { label: 'Preferencias activadas', value: `${Object.values(preferences).filter(Boolean).length}/3` },
          { label: 'Correo principal', value: profile.email },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
              {item.label}
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--app-text)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article
          id="perfil"
          className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
        >
          <div className="mb-5 flex items-center gap-3">
            <UserRound className="h-5 w-5 text-[var(--app-primary)]" />
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text)]">Datos personales</h2>
              <p className="text-sm text-[var(--app-text-muted)]">Información principal de tu cuenta.</p>
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

        <article
          id="preferencias"
          className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
        >
          <div className="mb-5 flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-[var(--app-accent)]" />
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text)]">Configuración</h2>
              <p className="text-sm text-[var(--app-text-muted)]">Ajusta cómo quieres recibir información.</p>
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
                className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4"
              >
                <div>
                  <p className="font-medium text-[var(--app-text)]">{item.label}</p>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={(event) =>
                    savePreferences({ [item.key]: event.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-primary)]"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--app-border-strong)] bg-[var(--app-primary-soft)] p-4 text-sm text-[var(--app-text-muted)]">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-5 w-5 text-[var(--app-primary)]" />
              Tus preferencias quedan guardadas para mantener el flujo del cliente consistente en
              futuras visitas.
            </div>
          </div>
        </article>
      </section>

      <section
        id="direcciones"
        className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-[var(--app-secondary)]" />
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text)]">Direcciones</h2>
              <p className="text-sm text-[var(--app-text-muted)]">Tus destinos frecuentes para compra.</p>
            </div>
          </div>
          <Badge variant="purple">{addresses.length} guardada(s)</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--app-text)]">{address.label}</h3>
                      {address.isDefault && <Badge variant="success">Predeterminada</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-[var(--app-text)]">{address.recipient}</p>
                    <p className="text-sm text-[var(--app-text-muted)]">
                      {address.street}, {address.city}, {address.state}, {address.zipCode}
                    </p>
                    <p className="text-sm text-[var(--app-text-soft)]">{address.phone}</p>
                  </div>

                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => updateAddress(address.id, { isDefault: true })}
                        className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]"
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

          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-[var(--app-primary)]" />
              <p className="font-semibold text-[var(--app-text)]">Agregar dirección</p>
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
                  className="h-4 w-4 rounded border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-primary)]"
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
