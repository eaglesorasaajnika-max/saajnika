import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminStatsCard from '../components/admin/AdminStatsCard';
import AdminDataTable from '../components/admin/AdminDataTable';
import Modal from '../components/common/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Spinner from '../components/common/Spinner';
import { adminApi } from '../services/api/adminApi';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { formatINR, formatDate } from '../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Product Create/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category_id: '',
    price: '',
    fabric: 'Pure Silk',
    craft_technique: 'Zari Embroidery',
    description: '',
  });

  // Coupon Create Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_percent: 15,
    min_order_value: 25000,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        st,
        prods,
        cats,
        ords,
        inv,
        cps,
        bns,
        custs,
        aud,
      ] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getProducts(),
        adminApi.getCategories(),
        adminApi.getOrders(),
        adminApi.getInventory(),
        adminApi.getCoupons(),
        adminApi.getBanners(),
        adminApi.getCustomers(),
        adminApi.getAuditLog(),
      ]);
      setStats(st);
      setProducts(prods || []);
      setCategories(cats || []);
      setOrders(ords || []);
      setInventory(inv || []);
      setCoupons(cps || []);
      setBanners(bns || []);
      setCustomers(custs || []);
      setAuditLogs(aud || []);
    } catch (e) {
      console.warn('Failed to load admin telemetry:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      showSuccess(`Order ${orderId} moved to ${newStatus}`);
      const updated = await adminApi.getOrders();
      setOrders(updated);
    } catch {
      showError('Failed to transition order status.');
    }
  };

  const handleUpdateStock = async (variantId, newStock) => {
    try {
      await adminApi.updateStock(variantId, newStock);
      showSuccess('SKU variant quantity adjusted.');
      const updated = await adminApi.getInventory();
      setInventory(updated);
    } catch {
      showError('Could not modify stock level.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Archive this couture product from the catalog?')) return;
    try {
      await adminApi.deleteProduct(id);
      showSuccess('Product archived.');
      const updated = await adminApi.getProducts();
      setProducts(updated);
    } catch {
      showError('Failed to remove product.');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createProduct({
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.price) * 1.25,
        variants: [
          { id: Date.now() + 1, size: 'S', color: 'Gold', stock: 5, is_in_stock: true },
          { id: Date.now() + 2, size: 'M', color: 'Gold', stock: 4, is_in_stock: true },
          { id: Date.now() + 3, size: 'L', color: 'Gold', stock: 3, is_in_stock: true },
        ],
      });
      showSuccess(`Product "${productForm.title}" published.`);
      setIsProductModalOpen(false);
      setProductForm({
        title: '',
        category_id: '',
        price: '',
        fabric: 'Pure Silk',
        craft_technique: 'Zari Embroidery',
        description: '',
      });
      const updated = await adminApi.getProducts();
      setProducts(updated);
    } catch {
      showError('Failed to publish product.');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCoupon(couponForm);
      showSuccess(`Voucher ${couponForm.code} registered.`);
      setIsCouponModalOpen(false);
      setCouponForm({ code: '', discount_percent: 15, min_order_value: 25000 });
      const updated = await adminApi.getCoupons();
      setCoupons(updated);
    } catch {
      showError('Failed to create coupon.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050508' }}>
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExitAdmin={() => navigate('/')}
      />

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <AdminHeader
          title={
            activeTab === 'dashboard'
              ? 'Executive Operations Dashboard'
              : activeTab === 'products'
              ? 'Haute Couture Catalog Management'
              : activeTab === 'categories'
              ? 'Artisan Craft Categories'
              : activeTab === 'orders'
              ? 'Order Fulfillment & Logistics'
              : activeTab === 'inventory'
              ? 'Omnichannel Variant Stock Levels'
              : activeTab === 'coupons'
              ? 'Promotional Vouchers & Offers'
              : activeTab === 'banners'
              ? 'Editorial Hero Banners'
              : activeTab === 'customers'
              ? 'VIP Clientele Registry'
              : 'Audit & Compliance Security Logs'
          }
          subtitle="Real-time atelier orchestration and luxury enterprise telemetry"
          user={user}
        />

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {isLoading ? (
            <div style={{ padding: '100px', textAlign: 'center' }}>
              <Spinner label="Syncing enterprise telemetry..." />
            </div>
          ) : (
            <>
              {/* TAB 1: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    <AdminStatsCard
                      title="Net Gross Revenue"
                      value={formatINR(stats?.total_revenue || 4872000)}
                      trend="+28.4%"
                      subtitle="vs. previous cycle"
                      icon={DollarSign}
                    />
                    <AdminStatsCard
                      title="Couture Orders"
                      value={stats?.total_orders || orders.length}
                      trend="+14.2%"
                      subtitle="Active commissions"
                      icon={ShoppingBag}
                    />
                    <AdminStatsCard
                      title="Artisan Catalog"
                      value={stats?.total_products || products.length}
                      subtitle="Active masterpieces"
                      icon={Package}
                    />
                    <AdminStatsCard
                      title="Fulfillment Rate"
                      value="99.4%"
                      trend="+0.6%"
                      subtitle="On-time insured delivery"
                      icon={TrendingUp}
                    />
                  </div>

                  {/* Recent Orders Overview */}
                  <div style={{ marginTop: '12px' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '16px' }}>
                      Recent Commissions Ledger
                    </h2>
                    <AdminDataTable
                      data={orders.slice(0, 5)}
                      searchKey="order_number"
                      columns={[
                        { header: 'Order ID', accessor: 'order_number' },
                        {
                          header: 'Client',
                          accessor: 'user_email',
                          render: (row) => row.shipping_address?.name || row.user_email || 'VIP Guest',
                        },
                        {
                          header: 'Total',
                          accessor: 'total_amount',
                          render: (row) => formatINR(row.total_amount),
                        },
                        {
                          header: 'Status',
                          accessor: 'status',
                          render: (row) => (
                            <Badge variant={row.status === 'DELIVERED' ? 'gold' : 'neutral'}>
                              {row.status}
                            </Badge>
                          ),
                        },
                        {
                          header: 'Date',
                          accessor: 'created_at',
                          render: (row) => formatDate(row.created_at),
                        },
                      ]}
                    />
                  </div>
                </>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  <AdminDataTable
                    data={products}
                    searchKey="title"
                    searchPlaceholder="Search couture garments..."
                    actions={
                      <Button
                        variant="primary"
                        onClick={() => setIsProductModalOpen(true)}
                        style={{ gap: '6px', fontSize: '13px' }}
                      >
                        <Plus size={14} /> Add Couture Piece
                      </Button>
                    }
                    columns={[
                      {
                        header: 'Garment',
                        accessor: 'title',
                        render: (row) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={row.primary_image || (row.images && row.images[0]) || '/assets/hero.png'}
                              alt=""
                              style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div>
                              <strong style={{ color: '#fff', fontSize: '13px' }}>{row.title}</strong>
                              <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>SKU: {row.sku}</p>
                            </div>
                          </div>
                        ),
                      },
                      {
                        header: 'Category',
                        accessor: 'category_name',
                        render: (row) => row.category_name || row.category || 'Atelier',
                      },
                      {
                        header: 'Price',
                        accessor: 'price',
                        render: (row) => formatINR(row.price),
                      },
                      {
                        header: 'Stock Status',
                        accessor: 'is_in_stock',
                        render: (row) => (
                          <Badge variant={row.is_in_stock ? 'gold' : 'neutral'}>
                            {row.is_in_stock ? 'In Stock' : 'Archived'}
                          </Badge>
                        ),
                      },
                      {
                        header: 'Actions',
                        accessor: 'id',
                        render: (row) => (
                          <button
                            onClick={() => handleDeleteProduct(row.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-dim)',
                              cursor: 'pointer',
                              padding: '6px',
                            }}
                            title="Archive Garment"
                          >
                            <Trash2 size={15} />
                          </button>
                        ),
                      },
                    ]}
                  />
                </div>
              )}

              {/* TAB 3: CATEGORIES */}
              {activeTab === 'categories' && (
                <AdminDataTable
                  data={categories}
                  searchKey="name"
                  columns={[
                    { header: 'Category Name', accessor: 'name' },
                    { header: 'Slug', accessor: 'slug' },
                    { header: 'Description', accessor: 'description' },
                    {
                      header: 'Items',
                      accessor: 'product_count',
                      render: (row) => row.product_count || 12,
                    },
                  ]}
                />
              )}

              {/* TAB 4: ORDERS */}
              {activeTab === 'orders' && (
                <AdminDataTable
                  data={orders}
                  searchKey="order_number"
                  columns={[
                    { header: 'Order ID', accessor: 'order_number' },
                    {
                      header: 'Customer',
                      accessor: 'shipping_address',
                      render: (row) => row.shipping_address?.name || 'Private VIP',
                    },
                    {
                      header: 'Total Value',
                      accessor: 'total_amount',
                      render: (row) => formatINR(row.total_amount),
                    },
                    {
                      header: 'Transition State',
                      accessor: 'status',
                      render: (row) => (
                        <select
                          value={row.status}
                          onChange={(e) => handleUpdateOrderStatus(row.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(10, 10, 14, 0.9)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--gold-light)',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      ),
                    },
                    {
                      header: 'Date Created',
                      accessor: 'created_at',
                      render: (row) => formatDate(row.created_at),
                    },
                  ]}
                />
              )}

              {/* TAB 5: INVENTORY */}
              {activeTab === 'inventory' && (
                <AdminDataTable
                  data={inventory}
                  searchKey="product_title"
                  columns={[
                    { header: 'Garment Piece', accessor: 'product_title' },
                    { header: 'SKU Code', accessor: 'sku' },
                    { header: 'Size', accessor: 'size' },
                    { header: 'Color', accessor: 'color' },
                    {
                      header: 'Units In Stock',
                      accessor: 'stock',
                      render: (row) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            defaultValue={row.stock}
                            min={0}
                            style={{
                              width: '64px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(10, 10, 14, 0.9)',
                              border: '1px solid var(--border-subtle)',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                            onBlur={(e) => handleUpdateStock(row.id, e.target.value)}
                          />
                          {row.is_low_stock && (
                            <span title="Low Stock Warning">
                              <AlertTriangle size={14} color="#f59e0b" />
                            </span>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              )}

              {/* TAB 6: COUPONS */}
              {activeTab === 'coupons' && (
                <AdminDataTable
                  data={coupons}
                  searchKey="code"
                  actions={
                    <Button
                      variant="primary"
                      onClick={() => setIsCouponModalOpen(true)}
                      style={{ gap: '6px', fontSize: '13px' }}
                    >
                      <Plus size={14} /> Create Voucher
                    </Button>
                  }
                  columns={[
                    {
                      header: 'Coupon Code',
                      accessor: 'code',
                      render: (row) => <strong style={{ color: 'var(--gold-light)' }}>{row.code}</strong>,
                    },
                    {
                      header: 'Discount',
                      accessor: 'discount_percent',
                      render: (row) => `${row.discount_percent}% OFF`,
                    },
                    {
                      header: 'Min Order Value',
                      accessor: 'min_order_value',
                      render: (row) => formatINR(row.min_order_value),
                    },
                    {
                      header: 'Status',
                      accessor: 'is_active',
                      render: () => <Badge variant="gold">Active</Badge>,
                    },
                  ]}
                />
              )}

              {/* TAB 7: BANNERS */}
              {activeTab === 'banners' && (
                <AdminDataTable
                  data={banners}
                  searchKey="title"
                  columns={[
                    { header: 'Banner Title', accessor: 'title' },
                    { header: 'Subtitle', accessor: 'subtitle' },
                    { header: 'Action Link', accessor: 'link' },
                    {
                      header: 'State',
                      accessor: 'is_active',
                      render: (row) => <Badge variant="gold">{row.is_active ? 'Live' : 'Draft'}</Badge>,
                    },
                  ]}
                />
              )}

              {/* TAB 8: CUSTOMERS */}
              {activeTab === 'customers' && (
                <AdminDataTable
                  data={customers}
                  searchKey="name"
                  columns={[
                    { header: 'Clientele Name', accessor: 'name' },
                    { header: 'Email Address', accessor: 'email' },
                    { header: 'Phone', accessor: 'phone' },
                    { header: 'Commissions', accessor: 'orders_count' },
                    {
                      header: 'Total Spend',
                      accessor: 'spent',
                      render: (row) => formatINR(row.spent),
                    },
                    {
                      header: 'VIP Tier',
                      accessor: 'tier',
                      render: (row) => <Badge variant="gold">{row.tier}</Badge>,
                    },
                  ]}
                />
              )}

              {/* TAB 9: AUDIT LOG */}
              {activeTab === 'audit' && (
                <AdminDataTable
                  data={auditLogs}
                  searchKey="action"
                  columns={[
                    { header: 'Timestamp', accessor: 'timestamp' },
                    { header: 'Admin Officer', accessor: 'user' },
                    { header: 'Action Performed', accessor: 'action' },
                  ]}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal: Add Product */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Commission New Haute Couture Piece"
      >
        <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Garment Title *
            </label>
            <input
              type="text"
              required
              value={productForm.title}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Price (INR) *
              </label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
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
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Craft Technique
              </label>
              <input
                type="text"
                value={productForm.craft_technique}
                onChange={(e) => setProductForm({ ...productForm, craft_technique: e.target.value })}
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

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Garment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Coupon */}
      <Modal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        title="Issue Promotional Voucher"
      >
        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Voucher Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FESTIVE20"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Discount % *
              </label>
              <input
                type="number"
                required
                min={1}
                max={90}
                value={couponForm.discount_percent}
                onChange={(e) => setCouponForm({ ...couponForm, discount_percent: Number(e.target.value) })}
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
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Min Order Value (₹) *
              </label>
              <input
                type="number"
                required
                value={couponForm.min_order_value}
                onChange={(e) => setCouponForm({ ...couponForm, min_order_value: Number(e.target.value) })}
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
            <Button type="button" variant="secondary" onClick={() => setIsCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
