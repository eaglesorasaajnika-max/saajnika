import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';

export default function AdminDataTable({
  columns = [],
  data = [],
  searchKey,
  searchPlaceholder = 'Search records...',
  isLoading = false,
  actions,
  pageSize = 10,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = data.filter((row) => {
    if (!query || !searchKey) return true;
    const val = row[searchKey];
    if (typeof val === 'string') return val.toLowerCase().includes(query.toLowerCase());
    if (typeof val === 'number') return String(val).includes(query);
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search & Actions Bar */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {searchKey && (
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={15}
              color="var(--gold-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>
        )}

        {actions && <div>{actions}</div>}
      </div>

      {/* Table Surface */}
      <div style={{ overflowX: 'auto', minHeight: '300px' }}>
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Spinner label="Loading operational records..." />
          </div>
        ) : pageData.length === 0 ? (
          <EmptyState
            title="No Records Found"
            message="No matching entries exist for the current filter criteria."
          />
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: '14px 20px',
                      color: 'var(--gold-light)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Strip */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            Page {page} of {totalPages} ({filteredData.length} total entries)
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: page <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: page >= totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
