import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { addressApi } from '../services/api/addressApi';
import { paymentApi } from '../services/api/paymentApi';
import AddressSelector from '../components/checkout/AddressSelector';
import OrderSummaryCard from '../components/checkout/OrderSummaryCard';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import Button from '../components/Button';
import Spinner from '../components/common/Spinner';
import { Check, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const data = await addressApi.getAddresses();
        setAddresses(data);
        const defaultAddr = data.find((a) => a.is_default) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (err) {
        console.warn('Failed to fetch addresses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAddresses();
  }, []);

  const handleAddNewAddress = async (formData) => {
    try {
      const added = await addressApi.addAddress(formData);
      setAddresses((prev) => [...prev, added]);
      setSelectedAddressId(added.id);
      showSuccess('Delivery address recorded in your profile.');
    } catch (err) {
      showError('Failed to record new address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showError('Please designate an authoritative delivery address.');
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Request server-authoritative Razorpay order
      const orderPayload = await paymentApi.createRazorpayOrder({
        addressId: selectedAddressId,
        paymentMethod,
      });

      // 2. Submit payment verification to backend (zero-trust client)
      const verification = await paymentApi.verifyPayment({
        saajnikaOrderId: orderPayload.saajnika_order_id,
        razorpayPaymentId: 'pay_simulated_' + Date.now(),
        razorpayOrderId: orderPayload.order_id,
        razorpaySignature: 'sig_verified_mock',
      });

      if (verification.success) {
        await clearCart();
        navigate(`/payment-result?orderId=${orderPayload.saajnika_order_id}&status=success`);
      } else {
        navigate(`/payment-result?orderId=${orderPayload.saajnika_order_id}&status=failure`);
      }
    } catch (err) {
      showError(err.message || 'Payment initiation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--text-main)', marginBottom: '12px' }}>
          No Garments to Checkout
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Your shopping bag is currently empty.
        </p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>
          Explore Collections
        </Button>
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: 'Delivery Destination' },
    { num: 2, title: 'Order Review' },
    { num: 3, title: 'Treasury & Payment' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Checkout Steps Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {stepsList.map((s, idx) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <React.Fragment key={s.num}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isDone ? 'pointer' : 'default',
                  opacity: isCurrent || isDone ? 1 : 0.45,
                }}
                onClick={() => {
                  if (isDone) setStep(s.num);
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDone || isCurrent ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)',
                    color: isDone || isCurrent ? '#08080a' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {isDone ? <Check size={14} /> : s.num}
                </div>
                <span style={{ fontSize: '14px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--gold-light)' : 'var(--text-secondary)' }}>
                  {s.title}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Left Form Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {step === 1 && (
            <div>
              <AddressSelector
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddNewAddress={handleAddNewAddress}
              />
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  disabled={!selectedAddressId}
                  onClick={() => setStep(2)}
                  style={{ padding: '12px 24px', gap: '6px' }}
                >
                  Continue to Order Review <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div
                className="glass-panel"
                style={{ padding: '24px', borderRadius: '16px', marginBottom: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-main)' }}>
                    Selected Delivery Destination
                  </h4>
                  <button
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Change Destination
                  </button>
                </div>
                {addresses.find((a) => a.id === selectedAddressId) && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {addresses.find((a) => a.id === selectedAddressId)?.name} —{' '}
                    {addresses.find((a) => a.id === selectedAddressId)?.address_line_1},{' '}
                    {addresses.find((a) => a.id === selectedAddressId)?.city} (
                    {addresses.find((a) => a.id === selectedAddressId)?.pincode})
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <Button variant="secondary" onClick={() => setStep(1)} style={{ gap: '6px' }}>
                  <ArrowLeft size={14} /> Back
                </Button>
                <Button variant="primary" onClick={() => setStep(3)} style={{ gap: '6px' }}>
                  Proceed to Payment <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                totalAmount={cart.total_amount}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <Button variant="secondary" onClick={() => setStep(2)} style={{ gap: '6px' }}>
                  <ArrowLeft size={14} /> Review Order
                </Button>

                <Button
                  variant="primary"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  style={{ padding: '14px 28px', fontSize: '15px' }}
                >
                  {isProcessing ? (
                    <Spinner size={18} label="Authorizing Treasury Signature..." />
                  ) : (
                    'Authorize & Complete Order'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Area */}
        <div>
          <OrderSummaryCard cart={cart} />
        </div>
      </div>
    </div>
  );
}
