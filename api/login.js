export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { username, password } = req.body;
    
    // Fallbacks provided for local testing, but you should set these in Vercel Environment Variables
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "aditya2026";

    if (username === adminUsername && password === adminPassword) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
}
