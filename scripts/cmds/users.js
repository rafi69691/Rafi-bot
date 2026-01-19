// models/User.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: String,
    type: String, // deposit, withdraw, transfer, gamble_win, gamble_lose, admin_add, admin_remove
    amount: Number,
    fromUser: String,
    toUser: String,
    description: String,
    date: { type: Date, default: Date.now }
});

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
        default: 1000 // 1 billion starting cash (unlimited feeling)
    },
    bank: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 1000000000
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    dailyClaimed: {
        type: Date,
        default: null
    },
    totalEarned: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    gambleWins: {
        type: Number,
        default: 0
    },
    gambleLosses: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next) {
    this.total = this.cash + this.bank;
    next();
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Transaction };
