import React, { useMemo, useState } from 'react';
import type { AppCredential } from '../../domain/entities/appCredential.entity.ts';
import { Trash2, Key, Copy, Check, Edit2 } from 'lucide-react';
import { GenericTable } from '../../../../shared/presentation/components/GenericTable';
import type { Column, Action } from '../../../../shared/presentation/components/GenericTable';

interface AppCredentialTableProps {
    apps: AppCredential[];
    onDelete: (clientId: string) => void;
    onEdit: (app: AppCredential) => void;
    loading: boolean;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            className="btn btn-link pl-1 text-secondary border-0 align-baseline"
            onClick={(e) => {
                e.stopPropagation();
                handleCopy();
            }}
            title="Copy to clipboard"
            style={{ boxShadow: 'none' }} >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
        </button>
    );
};

export const AppCredentialTable: React.FC<AppCredentialTableProps> = ({
    apps,
    onDelete,
    onEdit,
    loading,
    totalRecords,
    currentPage,
    pageSize,
    onPageChange
}) => {
    const columns: Column<AppCredential>[] = useMemo(() => [
        {
            header: 'Application',
            key: 'appName',
            render: (app) => (
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-gradient-brand d-flex align-items-center justify-content-center fw-bold small text-white" style={{ width: '36px', height: '36px' }}>
                        <Key size={16} />
                    </div>
                    <div>
                        <div className="fw-medium">{app.appName}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Client ID',
            key: 'clientId',
            render: (app) => (
                <div className="d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {app.clientId.substring(0, 12)}...
                    </span>
                    <CopyButton text={app.clientId} />
                </div>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (app) => (
                <span className={`badge rounded-pill fw-bold text-uppercase tracking-wider py-1.5 px-3 border border-opacity-25 ${app.isActive ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-danger bg-opacity-10 text-danger border-danger'}`}>
                    {app.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ], []);

    const actions: Action<AppCredential>[] = useMemo(() => [
        {
            icon: <Edit2 size={16} />,
            label: 'Edit',
            onClick: (app) => onEdit(app)
        },
        {
            icon: <Trash2 size={16} />,
            label: 'Delete',
            variant: 'danger',
            onClick: (app) => onDelete(app.clientId)
        }
    ], [onEdit, onDelete]);

    return (
        <GenericTable
            data={apps}
            columns={columns}
            actions={actions}
            loading={loading}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            rowKey={(app) => app.clientId}
            loadingMessage="Loading credentials..."
            noDataMessage="No application credentials found."
        />
    );
};
