import { ShieldPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useAppCredentials } from '../hooks/useAppCredentials.ts';
import type { AppCredential } from '../../domain/entities/appCredential.entity.ts';
import { AppCredentialTable } from '../components/AppCredentialTable.tsx';
import { AppCredentialForm } from '../components/AppCredentialForm.tsx';

export const AppCredentialManagementView: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { apps, totalRecords, loading, saveApp, removeApp } = useAppCredentials(page, pageSize);
    const [selectedApp, setSelectedApp] = useState<AppCredential | null>(null);

    const handleClose = () => {
        setShowForm(false);
        setSelectedApp(null);
    }

    const handleEditApp = (app: AppCredential) => {
        setSelectedApp(app);
        setShowForm(true);
    };

    return (
        <div className="py-2">
            <div className="row align-items-center justify-content-between g-4 mb-5">
                <div className="col-12 col-md-2">
                    <div className="glass-card p-3 border border-white border-opacity-5">
                        <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-1">Total Web Apps</p>
                        <p className="h3 fw-bold mb-0 text-primary">{totalRecords}</p>
                    </div>
                </div>

                <div className="col-12 col-md-auto">
                    <button
                        className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold"
                        onClick={() => setShowForm(true)} >
                        <ShieldPlus size={20} />
                        Add New App
                    </button>
                </div>
            </div>

            <AppCredentialTable
                apps={apps}
                onDelete={removeApp}
                onEdit={handleEditApp}
                loading={loading}
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={setPage} />

            {showForm && (
                <AppCredentialForm
                    data={selectedApp}
                    onClose={handleClose}
                    onSave={saveApp}
                />
            )}
        </div>
    );
};
