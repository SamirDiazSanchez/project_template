import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export interface Action<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
  variant?: 'light' | 'danger' | 'primary';
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading: boolean;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loadingMessage?: string;
  noDataMessage?: string;
  rowKey: (item: T) => string | number;
}

export const GenericTable = <T,>({
  data,
  columns,
  actions,
  loading,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  loadingMessage: propsLoadingMessage,
  noDataMessage: propsNoDataMessage,
  rowKey
}: GenericTableProps<T>) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const { t } = useTranslation();

  const loadingMessage = propsLoadingMessage || t('common.loading');
  const noDataMessage = propsNoDataMessage || t('common.noRecords');

  return (
    <div className="border-0 overflow-hidden shadow-lg mt-4 glass-card">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle" style={{ color: 'inherit' }}>
          <thead className="small fw-bold text-uppercase tracking-wider" style={{ backgroundColor: 'var(--table-header-bg)', color: 'var(--table-header-text)' }}>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-4 py-3 border-0 ${col.align ? `text-${col.align}` : ''}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 border-0 text-end">{t('common.actions')}</th>
              )}
            </tr>
          </thead>
          <tbody className="border-top-0" style={{ borderColor: 'var(--border-glass)' }}>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                  {loadingMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={rowKey(item)} className="border-bottom" style={{ borderColor: 'var(--border-glass)' }}>
                  {columns.map((col, idx) => (
                    <td 
                      key={idx} 
                      className={`px-4 py-3 border-0 ${col.align ? `text-${col.align}` : ''}`}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-4 py-3 border-0 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            title={action.label}
                            onClick={() => action.onClick(item)}
                            className={`btn btn-link p-2 ${
                              action.variant === 'danger' ? 'hover-danger' : 'hover-light'
                            }`}
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--table-header-bg)', borderColor: 'var(--border-glass)' }}>
          <div className="small d-flex gap-1" style={{ color: 'var(--text-muted)' }}>
            {t('common.showing')}
            <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{(currentPage - 1) * pageSize + 1}</span>
            {t('common.to')}
            <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{Math.min(currentPage * pageSize, totalRecords)}</span>
            {t('common.of')}
            <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{totalRecords}</span>
            {t('common.entries')}
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent rounded-2 px-3 shadow-none"
                  style={{ borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1} >
                  {t('common.previous')}
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className={`page-link rounded-2 px-3 shadow-none ${currentPage === i + 1 ? 'bg-primary border-primary text-white' : 'bg-transparent'
                      }`}
                    style={{ borderColor: 'var(--border-glass)', color: currentPage === i + 1 ? 'white' : 'var(--text-muted)' }}
                    onClick={() => onPageChange(i + 1)} >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent rounded-2 px-3 shadow-none"
                  style={{ borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages} >
                  {t('common.next')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
