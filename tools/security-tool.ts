import { randomBytes, createHash } from 'node:crypto';

/**
 * 🛡️ Security CLI Tool
 * This script helps generate secure keys and hashes for the project.
 */

const args = process.argv.slice(2);
const command = args[0];

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
};

const usage = `
${colors.bright}${colors.cyan}🛡️  Security CLI Tool${colors.reset}
Usage:
  npx tsx tools/security-tool.ts <command> [options]

Commands:
  ${colors.green}key [length]${colors.reset}    Generate a secure random hex key (default length: 32)
  ${colors.green}token [length]${colors.reset}  Generate a secure random base64url token (default length: 32)
  ${colors.green}hash <text>${colors.reset}     Generate a SHA-256 hash of the provided text
  ${colors.green}password [len]${colors.reset}  Generate a random secure password (default: 16)
  ${colors.green}env${colors.reset}             Generate a set of keys for your .env file
  ${colors.green}help${colors.reset}            Show this help message
`;

if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(usage);
    process.exit(0);
}

console.log(`${colors.bright}${colors.blue}--- Security Tool Summary ---${colors.reset}`);

try {
    switch (command) {
        case 'key': {
            const length = parseInt(args[1] || '32', 10);
            if (isNaN(length)) throw new Error('Length must be a number');
            const key = randomBytes(length).toString('hex');
            console.log(`${colors.green}✔ Hex Key (${length} bytes):${colors.reset} ${key}`);
            break;
        }
        case 'token': {
            const length = parseInt(args[1] || '32', 10);
            if (isNaN(length)) throw new Error('Length must be a number');
            const token = randomBytes(length).toString('base64url');
            console.log(`${colors.green}✔ Base64URL Token (${length} bytes):${colors.reset} ${token}`);
            break;
        }
        case 'hash': {
            const text = args[1];
            if (!text) {
                console.error(`${colors.red}✘ Error: Please provide text to hash${colors.reset}`);
                console.log(`Example: npx tsx tools/security-tool.ts hash "my-secret-password"`);
                process.exit(1);
            }
            const hash = createHash('sha256').update(text).digest('hex');
            console.log(`${colors.cyan}ℹ Text:${colors.reset} ${text}`);
            console.log(`${colors.cyan}ℹ SHA-256 Hash:${colors.reset} ${hash}`);
            break;
        }
        case 'password': {
            const length = parseInt(args[1] || '16', 10);
            if (isNaN(length)) throw new Error('Length must be a number');
            // Charset optimized for .env compatibility (no quotes, backticks, $, #, or spaces)
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!@%^&*()[]:;,.";
            let password = "";
            const bytes = randomBytes(length);
            for (let i = 0; i < length; i++) {
                password += charset[bytes[i] % charset.length];
            }
            console.log(`${colors.green}✔ Random Password:${colors.reset} ${password}`);
            break;
        }
        case 'env': {
            const cryptoKey = randomBytes(32).toString('hex');
            const jwtSecret = randomBytes(64).toString('base64url');
            const jwtRefreshSecret = randomBytes(64).toString('base64url');

            console.log(`${colors.magenta}Suggested .env additions:${colors.reset}`);
            console.log(colors.yellow + "--------------------------------------------------");
            console.log(`VITE_CRYPTO_KEY=${cryptoKey}`);
            console.log(`JWT_SECRET=${jwtSecret}`);
            console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
            console.log("--------------------------------------------------" + colors.reset);
            console.log(`${colors.blue}Copy and paste these into your Api/.env file.${colors.reset}`);
            break;
        }
        default:
            console.error(`${colors.red}✘ Unknown command: ${command}${colors.reset}`);
            console.log(usage);
            process.exit(1);
    }
} catch (error: any) {
    console.error(`${colors.red}✘ Error:${colors.reset} ${error.message}`);
    process.exit(1);
}

console.log(`${colors.bright}${colors.blue}-----------------------------${colors.reset}`);
