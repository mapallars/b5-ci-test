import { Database } from './core/orm/database/Database.js'
import { exec } from 'child_process'
import crypto from 'crypto'

/**
 * ESTE ARCHIVO CONTIENE VULNERABILIDADES INTENCIONALES PARA PRUEBAS DE CI (SEMGREP)
 * NO DEBE SER DESPLEGADO EN ENTORNOS DE PRODUCCIÓN REALES.
 * 
 * El objetivo es validar que el pipeline de Semgrep detecta correctamente:
 * 1. SQL Injection
 * 2. Command Injection
 * 3. Hardcoded Secrets
 * 4. Insecure Cryptography
 * 5. Dangerous Functions (eval)
 */

// 1. SQL Injection (p/owasp-top-ten, p/nodejs)
// Semgrep debería detectar la concatenación directa de entrada de usuario en el query
export async function getInsecureUser(userId: string) {
    const db = Database.getInstance()
    const sql = `SELECT * FROM users WHERE id = '${userId}'` // VULNERABILIDAD
    return await db.query(sql)
}

// 2. Command Injection (p/nodejs, p/security-audit)
// Semgrep debería detectar el uso de exec con variables no sanitizadas
export function runInsecureCommand(command: string) {
    exec(`ls -la ${command}`, (error, stdout, stderr) => { // VULNERABILIDAD
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
    })
}

// 3. Hardcoded Secret (p/secrets)
// Semgrep debería detectar strings que parecen llaves de API o tokens
const FAKE_API_KEY = "sk-test-40228304928304928304928304928304" // VULNERABILIDAD

// 4. Insecure Cryptography (p/security-audit, p/nodejs)
// Semgrep debería detectar el uso de algoritmos débiles como MD5 o SHA1
export function hashInsecure(data: string) {
    return crypto.createHash('md5').update(data).digest('hex') // VULNERABILIDAD
}

// 5. Dangerous Function (p/nodejs, p/typescript)
// Semgrep debería detectar el uso de eval()
export function runEval(code: string) {
    return eval(code) // VULNERABILIDAD
}
