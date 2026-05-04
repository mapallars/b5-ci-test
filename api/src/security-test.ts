import express from 'express'
import { exec } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'

/**
 * MINI API INSEGURA (SIN DEPENDENCIA REAL DE SEQUELIZE)
 * 
 * Vulnerabilidades:
 * 1. SQL Injection (simulando ORM)
 * 2. Command Injection
 * 3. Hardcoded Secrets
 * 4. Insecure Cryptography
 * 5. Dangerous Functions (eval)
 */

const app = express()
app.use(express.json())

// ----------------------------------------
// 🔐 Hardcoded Secrets
// ----------------------------------------
const DB_PASSWORD = "dev_password_123"
const JWT_SECRET = "jwt_secret_test"
const API_KEY = "fake_api_key_123456"

// ----------------------------------------
// 🧠 Fake ORM (simulación Sequelize)
// ----------------------------------------
const sequelize = {
    query: async (sql: string) => {
        console.log("Executing SQL:", sql)
        return [{ id: 1, username: "admin" }]
    }
}

// ----------------------------------------
// 1. SQL Injection
// ----------------------------------------
app.get('/user', async (req, res) => {
    const id = req.query.id as string

    try {
        // 🚨 SQL Injection clara (string interpolation)
        const result = await sequelize.query(
            "SELECT * FROM users WHERE id = '" + id + "'"
        )

        res.json(result)
    } catch (err) {
        res.status(500).send(err)
    }
})

// ----------------------------------------
// 2. Command Injection
// ----------------------------------------
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd as string

    // 🚨 Command Injection
    exec("ls " + cmd, (err, stdout) => {
        if (err) return res.status(500).send(err.message)
        res.send(stdout)
    })
})

// ----------------------------------------
// 3. Insecure Cryptography
// ----------------------------------------
app.post('/hash', (req, res) => {
    const { password } = req.body

    // 🚨 MD5 inseguro
    const hash = crypto.createHash("md5").update(password).digest('hex')

    res.json({ hash })
})

// ----------------------------------------
// 4. Dangerous eval
// ----------------------------------------
app.post('/eval', (req, res) => {
    const { code } = req.body

    // 🚨 ejecución arbitraria
    const result = eval(code)

    res.json({ result })
})

// ----------------------------------------
// 5. Path Traversal
// ----------------------------------------
app.get('/file', (req, res) => {
    const file = req.query.file as string

    try {
        // 🚨 Path traversal
        const data = fs.readFileSync('./uploads/' + file, 'utf-8')
        res.send(data)
    } catch (err) {
        res.status(500).send(err)
    }
})

// ----------------------------------------
// 6. Información sensible expuesta
// ----------------------------------------
app.get('/debug', (req, res) => {
    res.json({
        dbPassword: DB_PASSWORD,
        jwt: JWT_SECRET,
        apiKey: API_KEY,
    })
})

// ----------------------------------------
// Init
// ----------------------------------------
app.listen(3000, () => {
    console.log('🚨 Vulnerable API running on port 3000')
})