const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory mock database
let userWishlist = [];
let userSubscription = { status: 'free', tier: 'none' }; // 'free' | 'premium'

// --- WISHLIST ENDPOINTS ---

app.get('/api/wishlist', (req, res) => {
    res.json({ success: true, wishlist: userWishlist });
});

app.post('/api/wishlist', (req, res) => {
    const { packageId } = req.body;
    if (!packageId) {
        return res.status(400).json({ success: false, message: 'Package ID required' });
    }

    if (!userWishlist.includes(packageId)) {
        userWishlist.push(packageId);
    }

    res.json({ success: true, message: 'Added to wishlist', wishlist: userWishlist });
});

app.delete('/api/wishlist/:id', (req, res) => {
    const { id } = req.params;
    userWishlist = userWishlist.filter(item => item !== id);
    res.json({ success: true, message: 'Removed from wishlist', wishlist: userWishlist });
});

// --- SUBSCRIPTION & PAYMENT ENDPOINTS ---

app.get('/api/subscription', (req, res) => {
    res.json({ success: true, subscription: userSubscription });
});

app.post('/api/subscribe/pesapal', (req, res) => {
    // Mock Pesapal processing delay
    const { tier, email } = req.body;

    setTimeout(() => {
        userSubscription = { status: 'premium', tier, provider: 'Pesapal' };
        res.json({
            success: true,
            message: 'Payment successful via Pesapal',
            subscription: userSubscription
        });
    }, 1500);
});

app.post('/api/subscribe/mpesa', (req, res) => {
    // Mock M-Pesa STK push & processing delay
    const { tier, phoneNumber } = req.body;

    setTimeout(() => {
        userSubscription = { status: 'premium', tier, provider: 'M-Pesa' };
        res.json({
            success: true,
            message: 'Payment successful via M-Pesa',
            subscription: userSubscription
        });
    }, 2000);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Eastern Vacations API running on http://localhost:${PORT}`);
});
