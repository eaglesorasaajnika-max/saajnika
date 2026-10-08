import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function PaginationControl({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange = () => {},
  loading = false,
}) {
  if (totalPages <= 1) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
        Showing all {totalCount} authentic couture pieces
      </div>
    );
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      padding: '24px 0',
      flexWrap: 'wrap',
    }}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
        icon={ChevronLeft}
      >
        Previous
      </Button>

      <div style={{ display: 'flex', gap: '6px' }}>
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              disabled={loading}
              onClick={() => onPageChange(p)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: isCurrent ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                background: isCurrent ? 'var(--gold-btn-gradient)' : 'rgba(0,0,0,0.3)',
                color: isCurrent ? '#08080a' : 'var(--text-main)',
                fontWeight: isCurrent ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>Next</span>
        <ChevronRight size={15} style={{ marginLeft: '4px' }} />
      </Button>
    </div>
  );
}
