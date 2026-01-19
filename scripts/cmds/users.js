// models/User.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: String,
    type: String, // deposit, withdraw, transfer, gamble_win, gamble_lose, admin_add, admin_remove, vip_purchase, vip_reward
    amount: Number,
    fromUser: String,
    toUser: String,
    description: String,
    vipLevel: Number,
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
        default: 1000000000 // 1 billion starting cash
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
    isVip: {
        type: Boolean,
        default: false
    },
    vipLevel: {
        type: Number,
        default: 0 // 0 = No VIP, 1 = Bronze, 2 = Silver, 3 = Gold, 4 = Diamond, 5 = Royal
    },
    vipExpires: {
        type: Date,
        default: null
    },
    dailyClaimed: {
        type: Date,
        default: null
    },
    vipDailyClaimed: {
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
    vipPurchases: {
        type: Number,
        default: 0
    },
    totalVipBenefits: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastVipReward: {
        type: Date,
        default: null
    }
});

userSchema.pre('save', function(next) {
    this.total = this.cash + this.bank;
    
    // Check if VIP expired
    if (this.isVip && this.vipExpires && new Date() > this.vipExpires) {
        this.isVip = false;
        this.vipLevel = 0;
        this.vipExpires = null;
    }
    
    next();
});

userSchema.methods.hasVipBenefits = function() {
    return this.isVip && this.vipExpires && new Date() < this.vipExpires;
};

userSchema.methods.getVipInfo = function() {
    const vipLevels = {
        0: { name: "No VIP", color: "⚪", dailyBonus: 0, gambleBonus: 0, transferBonus: 0 },
        1: { name: "Bronze VIP", color: "🟤", dailyBonus: 50000, gambleBonus: 5, transferBonus: 2 },
        2: { name: "Silver VIP", color: "⚪", dailyBonus: 150000, gambleBonus: 10, transferBonus: 5 },
        3: { name: "Gold VIP", color: "🟡", dailyBonus: 300000, gambleBonus: 15, transferBonus: 8 },
        4: { name: "Diamond VIP", color: "🔷", dailyBonus: 500000, gambleBonus: 20, transferBonus: 12 },
        5: { name: "Royal VIP", color: "👑", dailyBonus: 1000000, gambleBonus: 25, transferBonus: 15 }
    };
    
    return vipLevels[this.vipLevel] || vipLevels[0];
};

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Transaction };
