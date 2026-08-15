import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true, index: true },
    visitorId: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    deviceType: { type: String, default: 'Desktop' },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    visitCount: { type: Number, default: 1 },
    totalDuration: { type: Number, default: 0 }, // in seconds
    lastActive: { type: Date, default: Date.now },
    firstVisit: { type: Date, default: Date.now },
    pagesViewed: [{
        path: { type: String, default: '/' },
        title: { type: String, default: 'Page' },
        timestamp: { type: Date, default: Date.now },
        duration: { type: Number, default: 0 } // duration on page in seconds
    }]
}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
