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
// Internal storage for reservations queue
let reservationQueue = [];

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

// --- AI RECOMMENDATIONS ENDPOINT ---
app.post('/api/recommendations', (req, res) => {
    const { budget, interest, season } = req.body;

    // Very basic mock AI matching engine returning static results
    // In production, this would query OpenAI or an ML model against the DB.
    setTimeout(() => {
        const mockMatches = [
            {
                id: '1',
                title: 'Masai Mara Great Migration Premium Safari',
                price: 3600,
                duration: '6 Days',
                description: 'Witness the greatest wildlife show on earth from the comfort of luxury tented camps.',
                image_url: 'https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: '2',
                title: 'Serengeti & Ngorongoro Adventure',
                price: 2800,
                duration: '5 Days',
                description: 'Explore the vast plains of Serengeti and the dense wildlife inside the crater.',
                image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: '3',
                title: 'Tsavo East Elephant Trek',
                price: 1500,
                duration: '3 Days',
                description: 'Get up close with the famous red elephants of Tsavo East.',
                image_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1000&auto=format&fit=crop'
            }
        ];

        // Slight modifications based on 'budget' to simulate intelligence
        if (budget === 'value') {
            mockMatches[0].price = 1200;
        }

        res.json({
            success: true,
            recommendations: mockMatches
        });
    }, 2500); // Simulate ML processing time
});

// --- RESERVATION DASHBOARD ENDPOINTS ---

app.post('/api/reservations/queue', (req, res) => {
    const { name, email, preferences, packageInterest } = req.body;
    const newRequest = {
        id: Date.now().toString(),
        name: name || 'Guest User',
        email: email || 'guest@example.com',
        preferences: preferences || 'Flexible',
        packageInterest: packageInterest || 'General Inquiry',
        status: 'Waiting', // Waiting, Claimed, Completed
        timestamp: new Date().toISOString()
    };
    reservationQueue.push(newRequest);
    console.log('[Reservations] New priority waitlist entry added:', newRequest.id);

    res.json({ success: true, message: 'Added to priority waiting list', request: newRequest });
});

app.get('/api/reservations/queue', (req, res) => {
    res.json({ success: true, queue: reservationQueue });
});

app.put('/api/reservations/queue/:id/claim', (req, res) => {
    const { id } = req.params;
    const reqItem = reservationQueue.find(item => item.id === id);
    if (!reqItem) return res.status(404).json({ success: false, error: 'Not found' });

    reqItem.status = 'Claimed';
    res.json({ success: true, request: reqItem });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eastern Vacations API running on http://0.0.0.0:${PORT}`);
});
