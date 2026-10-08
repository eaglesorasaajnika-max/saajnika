import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileOverview from '../components/account/ProfileOverview';
import AddressBook from '../components/account/AddressBook';
import OrderCard from '../components/orders/OrderCard';
import Modal from '../components/common/Modal';
import Button from '../components/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { profileApi } from '../services/api/profileApi';
import { addressApi } from '../services/api/addressApi';
import { orderApi } from '../services/api/orderApi';
import { User, MapPin, ShoppingBag, Shield, Plus, LogOut } from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'orders'
  const [profileData, setProfileData] = useState(user);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal for adding new address
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    is_default: false,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prof, addrs, ords] = await Promise.all([
        profileApi.getProfile(),
        addressApi.getAddresses(),
        orderApi.getOrders(),
      ]);
      setProfileData(prof);
      setAddresses(addrs || []);
      setOrders(ords || []);
    } catch (e) {
      console.warn('Failed to load account ledger:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateMeasurements = async (measurements) => {
    try {
      const updated = await profileApi.updateProfile({ measurements });
      setProfileData(updated);
      showSuccess('Couture silhouette measurements saved.');
    } catch {
      showError('Failed to record measurements.');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressApi.updateAddress(id, { is_default: true });
      const addrs = await addressApi.getAddresses();
      setAddresses(addrs);
      showSuccess('Default delivery residence updated.');
    } catch {
      showError('Could not update default residence.');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressApi.deleteAddress(id);
      const addrs = await addressApi.getAddresses();
      setAddresses(addrs);
      showSuccess('Residence removed from address book.');
    } catch {
      showError('Failed to delete address.');
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address_line_1 || !newAddress.pincode) {
      showError('Please fill in required fields.');
      return;
    }
    try {
      await addressApi.addAddress(newAddress);
      const addrs = await addressApi.getAddresses();
      setAddresses(addrs);
      setIsAddAddressModalOpen(false);
      setNewAddress({
        name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
        is_default: false,
      });
      showSuccess('New delivery destination registered.');
    } catch {
      showError('Failed to save address.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '120px', textAlign: 'center' }}>
        <Spinner size={32} label="Accessing Private Client Ledger..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page Title & Luxury Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '4px' }}>
            Private Client Portal
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--text-main)', margin: 0 }}>
            Clientele Suite
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {profileData?.is_staff && (
            <Button variant="secondary" onClick={() => navigate('/admin')} style={{ gap: '6px', fontSize: '13px' }}>
              <Shield size={14} color="var(--gold-primary)" /> Admin Suite
            </Button>
          )}
          <Button variant="secondary" onClick={handleLogout} style={{ gap: '6px', fontSize: '13px' }}>
            <LogOut size={14} /> Exit Salon
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '32px',
        }}
      >
        {[
          { id: 'profile', label: 'Bespoke Profile', icon: User },
          { id: 'addresses', label: 'Saved Residences', icon: MapPin },
          { id: 'orders', label: 'Couture Orders', icon: ShoppingBag, count: orders.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--gold-primary)' : '2px solid transparent',
                color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    backgroundColor: isActive ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#08080a' : 'inherit',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <ProfileOverview
          user={profileData}
          onUpdateMeasurements={handleUpdateMeasurements}
        />
      )}

      {activeTab === 'addresses' && (
        <AddressBook
          addresses={addresses}
          onSetDefault={handleSetDefaultAddress}
          onDeleteAddress={handleDeleteAddress}
          onOpenAddModal={() => setIsAddAddressModalOpen(true)}
        />
      )}

      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <EmptyState
              title="No Bespoke Orders Yet"
              message="You have not commissioned any haute couture ensembles yet."
              actionLabel="Explore Atelier Catalog"
              onAction={() => navigate('/catalog')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((ord) => (
                <OrderCard
                  key={ord.id}
                  order={ord}
                  onTrack={() => navigate(`/orders/${ord.id}`)}
                  onViewDetails={() => navigate(`/orders/${ord.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Register New Address */}
      <Modal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        title="Register New Delivery Residence"
      >
        <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Recipient Full Name *
            </label>
            <input
              type="text"
              required
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Contact Phone (+91) *
            </label>
            <input
              type="tel"
              required
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Address Line 1 (Villa / Apt / House) *
            </label>
            <input
              type="text"
              required
              value={newAddress.address_line_1}
              onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Address Line 2 (Street / Locality)
            </label>
            <input
              type="text"
              value={newAddress.address_line_2}
              onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                City *
              </label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                State *
              </label>
              <input
                type="text"
                required
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                PIN Code *
              </label>
              <input
                type="text"
                required
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsAddAddressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Residence
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
