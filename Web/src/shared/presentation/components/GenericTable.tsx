import React from 'react';

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
  loadingMessage = 'Loading...',
  noDataMessage = 'No records found.',
  rowKey
}: GenericTableProps<T>) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="border-0 overflow-hidden shadow-lg mt-4">
      <div className="table-responsive">
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="bg-white bg-opacity-5 text-secondary small fw-bold text-uppercase tracking-wider">
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
                <th className="px-4 py-3 border-0 text-end">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="border-top-0 border-white border-opacity-5">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5 text-secondary">
                  {loadingMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5 text-secondary">
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={rowKey(item)} className="border-bottom border-white border-opacity-5">
                  {columns.map((col, idx) => (
                    <td 
                      key={idx} 
                      className={`px-4 py-3 border-0 ${col.align ? `text-${col.align}` : ''} ${idx === 1 ? 'text-secondary' : ''}`}
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
                            className={`btn btn-link text-secondary p-2 ${
                              action.variant === 'danger' ? 'hover-danger' : 'hover-light'
                            }`}
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
        <div className="px-4 py-3 bg-white bg-opacity-5 border-top border-white border-opacity-5 d-flex align-items-center justify-content-between">
          <div className="text-secondary small">
            Showing <span className="text-white fw-bold">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-white fw-bold">{Math.min(currentPage * pageSize, totalRecords)}</span> of <span className="text-white fw-bold">{totalRecords}</span> entries
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent border-white border-opacity-10 text-secondary rounded-2 px-3 shadow-none"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1} >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className={`page-link border-white border-opacity-10 rounded-2 px-3 shadow-none ${currentPage === i + 1 ? 'bg-primary border-primary text-white' : 'bg-transparent text-secondary'
                      }`}
                    onClick={() => onPageChange(i + 1)} >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent border-white border-opacity-10 text-secondary rounded-2 px-3 shadow-none"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages} >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
