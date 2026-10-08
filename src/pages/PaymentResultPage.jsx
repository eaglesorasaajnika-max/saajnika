import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';
import { orderApi } from '../services/api/orderApi';
import { formatINR, formatDate } from '../utils/formatters';
import Spinner from '../components/common/Spinner';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId') || 'SAAJ-ORD-89421';
  const status = (searchParams.get('status') || 'success').toLowerCase();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await orderApi.getOrderById(orderId);
        setOrder(data);
      } catch (e) {
        console.warn('Failed to load order receipt:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const isSuccess = status === 'success';
  const isPending = status === 'pending';

  return (
    <div style={{ maxWidth: '720px', margin: '48px auto 96px', padding: '0 24px' }}>
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '48px 36px',
          textAlign: 'center',
          border: `1px solid ${
            isSuccess
              ? 'rgba(212, 175, 55, 0.4)'
              : isPending
              ? 'rgba(245, 158, 11, 0.4)'
              : 'rgba(239, 68, 68, 0.4)'
          }`,
          boxShadow: 'var(--shadow-luxury)',
        }}
      >
        {/* Status Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: isSuccess
              ? 'rgba(212, 175, 55, 0.15)'
              : isPending
              ? 'rgba(245, 158, 11, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              isSuccess ? 'var(--gold-primary)' : isPending ? '#f59e0b' : '#ef4444'
            }`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          {isSuccess && <CheckCircle2 size={36} color="var(--gold-primary)" />}
          {isPending && <Clock size={36} color="#f59e0b" />}
          {!isSuccess && !isPending && <AlertCircle size={36} color="#ef4444" />}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            color: 'var(--text-main)',
            marginBottom: '8px',
            letterSpacing: '0.02em',
          }}
        >
          {isSuccess
            ? 'Bespoke Order Confirmed'
            : isPending
            ? 'Treasury Verification Pending'
            : 'Payment Authentication Declined'}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          {isSuccess
            ? `Your transaction has been signature-verified by Saajnika treasury. Master artisans have been notified for garment allocation.`
            : isPending
            ? 'Your bank has initiated the transfer. Confirmation webhook synchronization is in progress.'
            : 'We were unable to authenticate your transaction with Razorpay or the designated issuing bank.'}
        </p>

        {/* Receipt Box */}
        {order && (
          <div
            style={{
              backgroundColor: 'rgba(10, 10, 14, 0.7)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Order Reference
                </span>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--gold-light)', fontSize: '15px', marginTop: '2px' }}>
                  {order.id}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Payment Method
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                  {order.payment_method}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total Authorized
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--gold-primary)', marginTop: '2px' }}>
                  {formatINR(order.total_amount)}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Estimated Handover
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                  {order.estimated_delivery ? formatDate(order.estimated_delivery) : '5-7 Days'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isSuccess ? (
            <>
              <Button
                variant="primary"
                onClick={() => navigate(`/orders/${orderId}`)}
                style={{ padding: '12px 24px', gap: '6px' }}
              >
                Track Live Order Timeline <ArrowRight size={14} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/catalog')}
                style={{ padding: '12px 24px' }}
              >
                Continue Exploring
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => navigate('/checkout')}
                style={{ padding: '12px 24px' }}
              >
                Retry Payment
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/catalog')}
                style={{ padding: '12px 24px' }}
              >
                Return to Boutique
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
