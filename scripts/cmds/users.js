// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    cash: {
        type: Number,
        default: 1000
    },
    bank: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 1000
    },
    dailyClaimed: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total before saving
userSchema.pre('save', function(next) {
    this.total = this.cash + this.bank;
    next();
});

module.exports = mongoose.model('User', userSchema);
