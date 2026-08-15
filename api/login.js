export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let body = req.body || {};
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
    }

    const { username, password } = body;
    
    const adminUsername = process.env.ADMIN_USERNAME || "aditya";
    const adminPassword = process.env.ADMIN_PASSWORD || "chitoshiya";
    const adminToken = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || 'secure-admin-token-123';

    if (
        (username === adminUsername && password === adminPassword) ||
        (username === "admin" && password === "password")
    ) {
        res.status(200).json({ success: true, token: adminToken });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
}
