import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cartStore';
import { useCustomerStore } from '../../store/customerStore';
import type { CustomerAddress } from '../../types';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import EmptyState from '../molecules/EmptyState';

const checkoutSteps = ['Dirección', 'Envío', 'Pago', 'Confirmación'];

const shippingOptions = [
  { id: 'standard', label: 'Envío estándar', eta: '3 a 5 días', price: 149 },
  { id: 'express', label: 'Envío express', eta: '24 a 48 horas', price: 249 },
  { id: 'pickup', label: 'Recoger en sucursal', eta: 'Mismo día', price: 0 },
];

const paymentOptions = [
  { id: 'card', label: 'Tarjeta de crédito o débito', description: 'Pago inmediato y protegido' },
  { id: 'paypal', label: 'PayPal', description: 'Usa saldo o tarjetas guardadas' },
  { id: 'transfer', label: 'Transferencia bancaria', description: 'Te enviaremos instrucciones al confirmar' },
];

const emptyAddress: Omit<CustomerAddress, 'id'> = {
  label: '',
  recipient: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  references: '',
  isDefault: false,
};

const StoreCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.total());
  const profile = useCustomerStore((state) => state.profile);
  const addresses = useCustomerStore((state) => state.addresses);
  const updateProfile = useCustomerStore((state) => state.updateProfile);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const placeOrder = useCustomerStore((state) => state.placeOrder);
  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? ''
  );
  const [createNewAddress, setCreateNewAddress] = useState(addresses.length === 0);
  const [addressForm, setAddressForm] = useState<Omit<CustomerAddress, 'id'>>(emptyAddress);
  const [profileForm, setProfileForm] = useState(profile);
  const [shippingMethodId, setShippingMethodId] = useState('standard');
  const [paymentMethodId, setPaymentMethodId] = useState('card');
  const [cardForm, setCardForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const shippingMethod =
    shippingOptions.find((option) => option.id === shippingMethodId) ?? shippingOptions[0];
  const total = subtotal + shippingMethod.price;

  const selectedAddress = useMemo(() => {
    if (createNewAddress) {
      return { ...addressForm, id: 'new-address' };
    }
    return addresses.find((address) => address.id === selectedAddressId);
  }, [addressForm, addresses, createNewAddress, selectedAddressId]);

  if (items.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="No hay productos para pagar"
          description="Primero agrega productos al carrito. Cuando tengas tu selección lista, aquí cerramos la compra."
          action={
            <button
              type="button"
              onClick={() => navigate('/store')}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Volver a la tienda
            </button>
          }
        />
      </div>
    );
  }

  const isProfileValid =
    profileForm.fullName.trim() && profileForm.email.trim() && profileForm.phone.trim();
  const isNewAddressValid =
    addressForm.label.trim() &&
    addressForm.recipient.trim() &&
    addressForm.phone.trim() &&
    addressForm.street.trim() &&
    addressForm.city.trim() &&
    addressForm.state.trim() &&
    addressForm.zipCode.trim();
  const isExistingAddressValid = Boolean(selectedAddressId);
  const isPaymentValid =
    paymentMethodId !== 'card' ||
    (cardForm.name.trim() && cardForm.number.trim() && cardForm.expiry.trim() && cardForm.cvc.trim());

  const canContinue =
    (step === 0 && isProfileValid && (createNewAddress ? isNewAddressValid : isExistingAddressValid)) ||
    step === 1 ||
    (step === 2 && isPaymentValid) ||
    step === 3;

  const handleContinue = async () => {
    if (step === 0) {
      updateProfile(profileForm);
      setStep(1);
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (!selectedAddress) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const paymentLabel =
      paymentOptions.find((option) => option.id === paymentMethodId)?.label ?? paymentMethodId;
    const order = placeOrder({
      items,
      shippingAddress: selectedAddress,
      shippingMethod: shippingMethod.label,
      shippingCost: shippingMethod.price,
      paymentMethod: paymentLabel,
    });

    if (createNewAddress) {
      addAddress({ ...addressForm, isDefault: addresses.length === 0 });
    }

    clearCart();
    setSubmitting(false);
    toast.success('Pedido confirmado correctamente');
    navigate(`/order-success?order=${order.id}`);
  };

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-white">Checkout de productos</h1>
        <p className="text-sm text-gray-400">
          Dirección, envío, pago y confirmación dentro de un mismo flujo.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {checkoutSteps.map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                    index <= step
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-white/10 bg-white/5 text-gray-500'
                  )}
                >
                  {index + 1}
                </div>
                <span className={cn('text-sm', index <= step ? 'text-white' : 'text-gray-500')}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            {step === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Datos y dirección</h2>
                    <p className="text-sm text-gray-400">
                      Configura quién recibe y dónde se entregará tu pedido.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
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
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </div>

                {addresses.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Direcciones guardadas</p>
                      <button
                        type="button"
                        onClick={() => setCreateNewAddress((current) => !current)}
                        className="text-sm text-indigo-300 transition-colors hover:text-indigo-200"
                      >
                        {createNewAddress ? 'Usar guardada' : 'Agregar nueva'}
                      </button>
                    </div>
                    {!createNewAddress && (
                      <div className="grid gap-3">
                        {addresses.map((address) => (
                          <button
                            key={address.id}
                            type="button"
                            onClick={() => setSelectedAddressId(address.id)}
                            className={cn(
                              'rounded-2xl border p-4 text-left transition-colors',
                              selectedAddressId === address.id
                                ? 'border-indigo-500/50 bg-indigo-500/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-white">{address.label}</p>
                              {address.isDefault && (
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-400">
                              {address.street}, {address.city}, {address.state}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(createNewAddress || addresses.length === 0) && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Etiqueta"
                      placeholder="Casa, Oficina..."
                      value={addressForm.label}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, label: event.target.value }))
                      }
                    />
                    <Input
                      label="Persona que recibe"
                      value={addressForm.recipient}
                      onChange={(event) =>
                        setAddressForm((current) => ({
                          ...current,
                          recipient: event.target.value,
                        }))
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
                      label="Código postal"
                      value={addressForm.zipCode}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, zipCode: event.target.value }))
                      }
                    />
                    <Input
                      label="Calle y número"
                      className="md:col-span-2"
                      value={addressForm.street}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, street: event.target.value }))
                      }
                    />
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
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Método de envío</h2>
                    <p className="text-sm text-gray-400">
                      Elige el tiempo de entrega que mejor se ajuste a tu compra.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setShippingMethodId(option.id)}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-colors',
                        shippingMethodId === option.id
                          ? 'border-cyan-500/50 bg-cyan-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{option.label}</p>
                          <p className="mt-1 text-sm text-gray-400">{option.eta}</p>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {option.price === 0 ? 'Gratis' : formatCurrency(option.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-violet-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Método de pago</h2>
                    <p className="text-sm text-gray-400">
                      Completa tu método de pago para dejar lista la orden.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethodId(option.id)}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-colors',
                        paymentMethodId === option.id
                          ? 'border-violet-500/50 bg-violet-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <p className="font-semibold text-white">{option.label}</p>
                      <p className="mt-1 text-sm text-gray-400">{option.description}</p>
                    </button>
                  ))}
                </div>

                {paymentMethodId === 'card' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Nombre en la tarjeta"
                      className="md:col-span-2"
                      value={cardForm.name}
                      onChange={(event) =>
                        setCardForm((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                    <Input
                      label="Número de tarjeta"
                      className="md:col-span-2"
                      value={cardForm.number}
                      onChange={(event) =>
                        setCardForm((current) => ({ ...current, number: event.target.value }))
                      }
                    />
                    <Input
                      label="Vencimiento"
                      placeholder="MM/AA"
                      value={cardForm.expiry}
                      onChange={(event) =>
                        setCardForm((current) => ({ ...current, expiry: event.target.value }))
                      }
                    />
                    <Input
                      label="CVC"
                      value={cardForm.cvc}
                      onChange={(event) =>
                        setCardForm((current) => ({ ...current, cvc: event.target.value }))
                      }
                    />
                  </div>
                )}

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5" />
                    Tus datos viajan cifrados y el pedido queda reflejado en tu historial al
                    confirmar.
                  </div>
                </div>
              </div>
            )}

            {step === 3 && selectedAddress && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Revisión final</h2>
                    <p className="text-sm text-gray-400">
                      Todo listo. Solo revisa el resumen y confirma el pedido.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Envío</p>
                    <p className="mt-2 font-semibold text-white">{selectedAddress.label}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">{shippingMethod.label}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Pago</p>
                    <p className="mt-2 font-semibold text-white">
                      {paymentOptions.find((option) => option.id === paymentMethodId)?.label}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {profileForm.fullName} · {profileForm.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              Atrás
            </Button>
            <Button disabled={!canContinue} loading={submitting} onClick={handleContinue}>
              {step === 3 ? 'Confirmar pedido' : 'Continuar'}
            </Button>
          </div>
        </div>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-white">Resumen del pedido</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-white">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Envío</span>
              <span className="text-white">
                {shippingMethod.price === 0 ? 'Gratis' : formatCurrency(shippingMethod.price)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StoreCheckoutPage;
