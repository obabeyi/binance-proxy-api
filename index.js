import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Binance Proxy API Çalışıyor 🚀");
});

// Kline verisi endpointi
app.get("/klines", async(req, res) => {
    const symbol = req.query.symbol || "BTCUSDT";
    const interval = req.query.interval || "1h";
    const limit = req.query.limit || 100;

    try {
        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Binance isteği başarısız oldu", detail: err.message });
    }
});

// Sembol listesi endpointi
app.get("/symbols", async(req, res) => {
    try {
        const response = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const data = await response.json();

        const usdtPairs = data.symbols
            .filter(s => s.symbol.endsWith("USDT") && s.status === "TRADING")
            .map(s => s.symbol);

        res.json(usdtPairs);
    } catch (err) {
        res.status(500).json({ error: "Symbol listesi alınamadı", detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor http://localhost:${PORT}`);
});