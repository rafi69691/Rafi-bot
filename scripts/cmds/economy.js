// scripts/economy.js
const fs = require('fs');
const path = require('path');

class EconomySystem {
    constructor() {
        this.dataPath = path.join(__dirname, 'data/economy_data.json');
        this.loadData();
        this.initializeDefaultData();
    }

    loadData() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const rawData = fs.readFileSync(this.dataPath, 'utf8');
                this.data = JSON.parse(rawData);
                console.log('📁 Economy data loaded successfully');
            } else {
                this.data = {
                    users: {},
                    transactions: [],
                    lastReset: Date.now()
                };
                console.log('📁 New economy data created');
            }
        } catch (error) {
            console.error('❌ Error loading economy data:', error);
            this.data = {
                users: {},
                transactions: [],
                lastReset: Date.now()
            };
        }
    }

    saveData() {
        try {
            const dir = path.dirname(this.dataPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error('❌ Error saving economy data:', error);
        }
    }

    initializeDefaultData() {
        if (!this.data.users) this.data.users = {};
        if (!this.data.transactions) this.data.transactions = [];
        if (!this.data.lastReset) this.data.lastReset = Date.now();
    }

    // ইউজার ডাটা পাওয়া
    getUser(userId, username = 'User') {
        if (!this.data.users[userId]) {
            this.data.users[userId] = {
                userId: userId,
                username: username,
                cash: 1000000, // Starting: 1 Million
                bank: 0,
                total: 1000000,
                isVip: false,
                vipLevel: 0,
                vipExpires: null,
                dailyClaimed: null,
                vipDailyClaimed: null,
                totalEarned: 1000000,
                totalSpent: 0,
                gambleWins: 0,
                gambleLosses: 0,
                dailyTasks: {},
                lastWork: null,
                level: 1,
                xp: 0,
                lastUpdated: Date.now()
            };
            this.saveData();
        } else if (username !== 'User' && this.data.users[userId].username !== username) {
            this.data.users[userId].username = username;
            this.saveData();
        }
        
        // Calculate total
        this.data.users[userId].total = this.data.users[userId].cash + this.data.users[userId].bank;
        return this.data.users[userId];
    }

    // ✅ ব্যালেন্স চেক (সঠিকভাবে)
    checkBalance(userId) {
        const user = this.getUser(userId);
        user.total = user.cash + user.bank;
        user.lastUpdated = Date.now();
        this.saveData();
        return {
            cash: user.cash,
            bank: user.bank,
            total: user.total,
            vipLevel: user.vipLevel,
            isVip: user.isVip,
            username: user.username
        };
    }

    // ✅ টাকা যোগ
    addMoney(userId, amount, type = 'cash', reason = 'Added') {
        const user = this.getUser(userId);
        
        if (type === 'cash') {
            user.cash += amount;
        } else if (type === 'bank') {
            user.bank += amount;
        }
        
        user.total = user.cash + user.bank;
        user.totalEarned += amount;
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'add', amount, { reason, type });
        this.saveData();
        
        return {
            success: true,
            cash: user.cash,
            bank: user.bank,
            total: user.total
        };
    }

    // ✅ টাকা কমান
    removeMoney(userId, amount, type = 'cash', reason = 'Removed') {
        const user = this.getUser(userId);
        
        if (type === 'cash' && user.cash < amount) {
            return { success: false, message: 'Insufficient cash' };
        }
        if (type === 'bank' && user.bank < amount) {
            return { success: false, message: 'Insufficient bank balance' };
        }
        
        if (type === 'cash') {
            user.cash -= amount;
        } else if (type === 'bank') {
            user.bank -= amount;
        }
        
        user.total = user.cash + user.bank;
        user.totalSpent += amount;
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'remove', amount, { reason, type });
        this.saveData();
        
        return {
            success: true,
            cash: user.cash,
            bank: user.bank,
            total: user.total
        };
    }

    // ✅ গ্যাম্বলিং সিস্টেম (ঠিকভাবে কাজ করবে)
    gamble(userId, amount, gameType = 'coinflip') {
        const user = this.getUser(userId);
        
        // চেক যদি যথেষ্ট টাকা থাকে
        if (user.cash < amount) {
            return { 
                success: false, 
                message: `❌ Insufficient cash! You have ${user.cash.toLocaleString()} টাকা` 
            };
        }
        
        // গেম অনুযায়ী win chance
        const gameConfig = {
            coinflip: { winChance: 50, minMultiplier: 1.8, maxMultiplier: 2.2 },
            dice: { winChance: 50, minMultiplier: 1.5, maxMultiplier: 6.0 },
            slots: { winChance: 35, minMultiplier: 3.0, maxMultiplier: 10.0 },
            roulette: { winChance: 48, minMultiplier: 2.0, maxMultiplier: 36.0 },
            blackjack: { winChance: 42, minMultiplier: 1.5, maxMultiplier: 3.0 }
        };
        
        const game = gameConfig[gameType] || gameConfig.coinflip;
        
        // VIP বোনাস
        let winChance = game.winChance;
        if (user.isVip && user.vipLevel > 0) {
            winChance += (user.vipLevel * 5); // +5% per VIP level
        }
        
        // জেতার লজিক
        const random = Math.random() * 100;
        const isWin = random <= winChance;
        
        if (isWin) {
            // জিতলে
            const multiplier = game.minMultiplier + Math.random() * (game.maxMultiplier - game.minMultiplier);
            const winAmount = Math.floor(amount * multiplier);
            
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            user.lastUpdated = Date.now();
            
            this.logTransaction(userId, 'gamble_win', winAmount, { 
                game: gameType, 
                bet: amount, 
                multiplier: multiplier.toFixed(2) 
            });
            this.saveData();
            
            return {
                success: true,
                win: true,
                amount: winAmount,
                multiplier: multiplier.toFixed(2),
                newCash: user.cash,
                newTotal: user.total,
                game: gameType
            };
            
        } else {
            // হারলে
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            user.lastUpdated = Date.now();
            
            this.logTransaction(userId, 'gamble_loss', amount, { game: gameType });
            this.saveData();
            
            return {
                success: true,
                win: false,
                amount: amount,
                newCash: user.cash,
                newTotal: user.total,
                game: gameType
            };
        }
    }

    // ✅ VIP সিস্টেম (ঠিকভাবে কাজ করবে)
    getVipPlans() {
        return {
            1: { name: "Bronze VIP", price: 10000000, dailyBonus: 100000, color: "🟤" },
            2: { name: "Silver VIP", price: 30000000, dailyBonus: 300000, color: "⚪" },
            3: { name: "Gold VIP", price: 69000000, dailyBonus: 690000, color: "🟡" },
            4: { name: "Diamond VIP", price: 109000000, dailyBonus: 1090000, color: "🔷" },
            5: { name: "Royal VIP", price: 1000000000, dailyBonus: 5000000, color: "👑" }
        };
    }

    buyVip(userId, vipLevel) {
        const user = this.getUser(userId);
        const vipPlans = this.getVipPlans();
        const plan = vipPlans[vipLevel];
        
        if (!plan) {
            return { success: false, message: 'Invalid VIP level' };
        }
        
        if (user.cash < plan.price) {
            return { 
                success: false, 
                message: `❌ Insufficient cash! You need ${plan.price.toLocaleString()} টাকা, but you have ${user.cash.toLocaleString()} টাকা` 
            };
        }
        
        // টাকা কাটা
        user.cash -= plan.price;
        user.isVip = true;
        user.vipLevel = vipLevel;
        
        // 30 দিনের জন্য VIP
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        user.vipExpires = expireDate.getTime();
        
        user.totalSpent += plan.price;
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'vip_purchase', plan.price, { vipLevel: vipLevel, plan: plan.name });
        this.saveData();
        
        return {
            success: true,
            message: `✅ Successfully purchased ${plan.name}!`,
            plan: plan,
            newCash: user.cash,
            expires: expireDate
        };
    }

    claimVipDaily(userId) {
        const user = this.getUser(userId);
        
        if (!user.isVip || user.vipLevel === 0) {
            return { success: false, message: '❌ You are not a VIP member' };
        }
        
        // VIP এক্সপায়ার চেক
        if (user.vipExpires && Date.now() > user.vipExpires) {
            user.isVip = false;
            user.vipLevel = 0;
            this.saveData();
            return { success: false, message: '❌ Your VIP has expired' };
        }
        
        const today = new Date().toDateString();
        if (user.vipDailyClaimed === today) {
            return { success: false, message: '❌ You already claimed your VIP daily bonus today' };
        }
        
        const vipPlans = this.getVipPlans();
        const bonus = vipPlans[user.vipLevel].dailyBonus;
        
        user.cash += bonus;
        user.totalEarned += bonus;
        user.vipDailyClaimed = today;
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'vip_daily', bonus, { vipLevel: user.vipLevel });
        this.saveData();
        
        return {
            success: true,
            message: `✅ Claimed ${bonus.toLocaleString()} টাকা VIP daily bonus!`,
            bonus: bonus,
            newCash: user.cash
        };
    }

    // ✅ ডেইলি টাস্ক
    completeDailyTask(userId, taskId, reward) {
        const user = this.getUser(userId);
        const today = new Date().toDateString();
        
        // চেক যদি আজকে already claimed
        if (user.dailyTasks && user.dailyTasks[today] && user.dailyTasks[today].includes(taskId)) {
            return { success: false, message: '❌ Already claimed this task today' };
        }
        
        // টাকা যোগ
        user.cash += reward;
        user.totalEarned += reward;
        
        // টাস্ক মার্ক
        if (!user.dailyTasks) user.dailyTasks = {};
        if (!user.dailyTasks[today]) user.dailyTasks[today] = [];
        user.dailyTasks[today].push(taskId);
        
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'daily_task', reward, { taskId });
        this.saveData();
        
        return {
            success: true,
            message: `✅ Task completed! Received ${reward.toLocaleString()} টাকা`,
            newCash: user.cash,
            reward: reward
        };
    }

    // ✅ কাজ করে টাকা আয়
    work(userId, salary) {
        const user = this.getUser(userId);
        const now = Date.now();
        
        // Cooldown চেক (1 hour = 3600000 ms)
        if (user.lastWork && (now - user.lastWork) < 3600000) {
            const remainingMinutes = Math.ceil((3600000 - (now - user.lastWork)) / 60000);
            return { 
                success: false, 
                message: `⏰ Please wait ${remainingMinutes} minutes before working again` 
            };
        }
        
        user.cash += salary;
        user.totalEarned += salary;
        user.lastWork = now;
        user.lastUpdated = Date.now();
        
        this.logTransaction(userId, 'work', salary);
        this.saveData();
        
        return {
            success: true,
            message: `✅ Work completed! Earned ${salary.toLocaleString()} টাকা`,
            newCash: user.cash,
            salary: salary
        };
    }

    // ✅ লিডারবোর্ড
    getLeaderboard(type = 'total', limit = 10) {
        const users = Object.values(this.data.users);
        
        if (users.length === 0) {
            return [];
        }
        
        let sortedUsers = [];
        
        switch(type.toLowerCase()) {
            case 'total':
                sortedUsers = users.sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));
                break;
            case 'cash':
                sortedUsers = users.sort((a, b) => b.cash - a.cash);
                break;
            case 'bank':
                sortedUsers = users.sort((a, b) => b.bank - a.bank);
                break;
            case 'vip':
                sortedUsers = users.filter(u => u.isVip).sort((a, b) => b.vipLevel - a.vipLevel);
                break;
            case 'gambling':
                sortedUsers = users.sort((a, b) => b.gambleWins - a.gambleWins);
                break;
            default:
                sortedUsers = users.sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));
        }
        
        return sortedUsers.slice(0, limit).map((user, index) => ({
            rank: index + 1,
            username: user.username,
            cash: user.cash,
            bank: user.bank,
            total: user.total,
            vipLevel: user.vipLevel,
            gambleWins: user.gambleWins
        }));
    }

    // ✅ রিসেট সিস্টেম (অ্যাডমিনদের জন্য)
    resetEconomy(type = 'all', adminId) {
        try {
            const admin = this.getUser(adminId);
            
            switch(type.toLowerCase()) {
                case 'all':
                    // সব ডাটা রিসেট
                    this.data.users = {};
                    this.data.transactions = [];
                    this.data.lastReset = Date.now();
                    this.saveData();
                    return { 
                        success: true, 
                        message: '✅ Complete economy system reset successfully!' 
                    };
                    
                case 'money':
                    // শুধু টাকা রিসেট
                    Object.keys(this.data.users).forEach(userId => {
                        this.data.users[userId].cash = 1000000;
                        this.data.users[userId].bank = 0;
                        this.data.users[userId].total = 1000000;
                        this.data.users[userId].totalEarned = 1000000;
                        this.data.users[userId].totalSpent = 0;
                    });
                    this.saveData();
                    return { 
                        success: true, 
                        message: '✅ All users money reset to 1,000,000 টাকা!' 
                    };
                    
                case 'vip':
                    // শুধু VIP রিসেট
                    Object.keys(this.data.users).forEach(userId => {
                        this.data.users[userId].isVip = false;
                        this.data.users[userId].vipLevel = 0;
                        this.data.users[userId].vipExpires = null;
                    });
                    this.saveData();
                    return { 
                        success: true, 
                        message: '✅ All VIP memberships removed!' 
                    };
                    
                default:
                    return { success: false, message: 'Invalid reset type' };
            }
        } catch (error) {
            console.error('Reset error:', error);
            return { success: false, message: 'Error resetting economy' };
        }
    }

    // ট্রানজেকশন লগ
    logTransaction(userId, type, amount, details = {}) {
        const transaction = {
            userId,
            type,
            amount,
            details,
            timestamp: Date.now(),
            date: new Date().toLocaleString()
        };
        
        this.data.transactions.push(transaction);
        
        // সর্বোচ্চ 1000 ট্রানজেকশন রাখা
        if (this.data.transactions.length > 1000) {
            this.data.transactions = this.data.transactions.slice(-1000);
        }
        
        this.saveData();
    }
}

// Create global instance
const economy = new EconomySystem();

module.exports = economy;
