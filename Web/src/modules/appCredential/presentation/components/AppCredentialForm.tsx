import React, { useState } from 'react';
import { Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import type { AppCredential } from '../../domain/entities/appCredential.entity.ts';

interface AppCredentialFormProps {
    onClose: () => void;
    onSave: (app: Partial<AppCredential>) => Promise<void>;
    data?: AppCredential | null;
}

export const AppCredentialForm: React.FC<AppCredentialFormProps> = ({ onClose, onSave, data }) => {
    const [clientId, setClientId] = useState(data?.clientId || '');
    const [clientSecret, setClientSecret] = useState(data?.clientSecret || '');
    // Extract prefix if editing, default to empty
    const [appNamePrefix, setAppNamePrefix] = useState(data?.appName ? data.appName.split('@')[0] : '');
    const [loading, setLoading] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fullAppName = `${appNamePrefix}@credential.app`;
            await onSave({ clientId, clientSecret, appName: fullAppName });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block backdrop-blur-md bg-dark bg-opacity-50" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content glass-card border-white border-opacity-10 bg-dark text-white p-2">
                    <div className="modal-header border-bottom border-white border-opacity-5">
                        <h5 className="modal-title fw-bold">Save App Credential</h5>
                        <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body py-4">
                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-bold">APPLICATION NAME</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control bg-transparent border-white border-opacity-10 text-white shadow-none"
                                        value={appNamePrefix}
                                        onChange={(e) => setAppNamePrefix(e.target.value)}
                                        placeholder="e.g. my-service"
                                        disabled={!!data?.clientId}
                                        required />
                                    <span className="input-group-text bg-transparent border-white border-opacity-10 text-secondary">
                                        @credential.app
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-bold">CLIENT SECRET</label>
                                <div className="input-group">
                                    <input
                                        type={showSecret ? 'text' : 'password'}
                                        className="form-control bg-transparent border-white border-opacity-10 text-white shadow-none"
                                        value={clientSecret}
                                        onChange={(e) => setClientSecret(e.target.value)}
                                        placeholder="Strong password or token"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn bg-transparent border-white border-opacity-10 text-secondary border-start-0"
                                        onClick={() => setShowSecret(!showSecret)}
                                    >
                                        {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top border-white border-opacity-5">
                            <button type="button" className="btn btn-link text-secondary text-decoration-none" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Credential'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
