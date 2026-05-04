import { Client } from 'pg'
import { exec } from 'child_process'
import crypto from 'crypto'

/**
 * ARCHIVO DE PRUEBA PARA SEMGREP (Node.js + pg)
 * 
 * Vulnerabilidades incluidas:
 * 1. SQL Injection
 * 2. Command Injection
 * 3. Hardcoded Secrets
 * 4. Insecure Cryptography
 * 5. Dangerous Functions (eval)
 */

// ----------------------------------------
// 1. SQL Injection (pg)
// ----------------------------------------
export async function getUserById(userId: string) {
    const client = new Client({
        user: "admin",
        host: "localhost",
        database: "testdb",
        password: "password123", // 🚨 Hardcoded secret también
        port: 5432,
    })

    await client.connect()

    // 🚨 SQL Injection: interpolación directa
    const query = `SELECT * FROM users WHERE id = '${userId}'`
    const result = await client.query(query)

    await client.end()
    return result.rows
}

// ----------------------------------------
// 2. Command Injection
// ----------------------------------------
export function runCommand(userInput: string) {
    exec("ls " + userInput, (err, stdout) => { // 🚨 VULN
        if (err) {
            console.error(err)
            return
        }
        console.log(stdout)
    })
}

// ----------------------------------------
// 3. Hardcoded Secrets
// ----------------------------------------
const STRIPE_SECRET = "fake_stripe_key_123456789" // 🚨 VULN
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE" // 🚨 VULN
const JWT_SECRET = "super_secret_jwt_key" // 🚨 VULN

// ----------------------------------------
// 4. Insecure Cryptography
// ----------------------------------------
export function hashPassword(password: string) {
    // 🚨 MD5 inseguro
    return crypto.createHash('md5').update(password).digest('hex')
}

export function hashPasswordSHA1(password: string) {
    // 🚨 SHA1 inseguro
    return crypto.createHash('sha1').update(password).digest('hex')
}

// ----------------------------------------
// 5. Dangerous Functions
// ----------------------------------------
export function runEval(code: string) {
    return eval(code) // 🚨 VULN
}

export function runDynamicFunction(code: string) {
    return new Function(code)() // 🚨 VULN
}