import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiAppCredentialRepository } from '../../infrastructure/apiAppCredential.repository.ts';
import { ListAppCredentialsUseCase } from '../../application/list-app-credentials.use-case.ts';
import { SaveAppCredentialUseCase } from '../../application/save-app-credential.use-case.ts';
import { RemoveAppCredentialUseCase } from '../../application/remove-app-credential.use-case.ts';
import type { AppCredential } from '../../domain/entities/appCredential.entity.ts';

export const useAppCredentials = (page: number, size: number, enabled: boolean = true) => {
    const [apps, setApps] = useState<AppCredential[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new ApiAppCredentialRepository(), []);

    const listUseCase = useMemo(() => new ListAppCredentialsUseCase(repository), [repository]);
    const saveUseCase = useMemo(() => new SaveAppCredentialUseCase(repository), [repository]);
    const removeUseCase = useMemo(() => new RemoveAppCredentialUseCase(repository), [repository]);

    const fetchApps = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        try {
            const response = await listUseCase.execute(page, size);
            setApps(response.apps);
            setTotalRecords(response.totalRecords);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error fetching application credentials');
        } finally {
            setLoading(false);
        }
    }, [page, size, listUseCase, enabled]);

    const saveApp = async (app: Partial<AppCredential>) => {
        await saveUseCase.execute(app);
        await fetchApps();
    };

    const removeApp = async (clientId: string) => {
        await removeUseCase.execute(clientId);
        await fetchApps();
    };

    useEffect(() => {
        if (enabled) {
            fetchApps();
        } else {
            setLoading(false);
        }
    }, [fetchApps, enabled]);

    return { apps, totalRecords, loading, error, saveApp, removeApp, refetch: fetchApps };
};
