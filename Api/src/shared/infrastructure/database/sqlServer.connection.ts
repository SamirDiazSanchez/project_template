import sql from "mssql";

export class SqlServerConnection {
    protected pool: sql.ConnectionPool | null = null;

    constructor() {
        const config: sql.config = {
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
            server: process.env.DB_SERVER!,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        };

        this.generatePool(config);
    }

    private async generatePool(config: sql.config): Promise<void> {
        try {
            if (this.pool) return;

            this.pool = await sql.connect(config);
        } catch (err) {
            throw err;
        }
    }
};
