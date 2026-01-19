// economy.js
const fs = require('fs');
const path = require('path');

class EconomySystem {
    constructor() {
        this.dataPath = path.join(__dirname, 'data/economy.json');
        this.loadData();
        
        // VIP প্রাইস
        this.vipPlans = {
            1: { name: "Bronze VIP", price: 10000000, dailyBonus: 100000 },
            2: { name: "Silver VIP", price: 30000000, dailyBonus: 300000 },
            3: { name: "Gold VIP", price: 69000000, dailyBonus: 690000 },
            4: { name: "Diamond VIP", price: 109000000, dailyBonus: 1090000 },
            5: { name: "Royal VIP", price: 1000000000, dailyBonus: 5000000 }
        };
    }

    loadData() {
        try {
            if (fs.existsSync(this.dataPath)) {
                this.data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
            } else {
                this.data = { users: {}, transactions: [] };
                this.saveData();
            }
        } catch (error) {
            console.error('Error loading economy data:', error);
            this.data = { users: {}, transactions: [] };
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
            console.error('Error saving economy data:', error);
        }
    }

    // ইউজার ডাটা পাওয়া
    getUser(userId, username = 'User') {
        if (!this.data.users[userId]) {
            this.data.users[userId] = {
                userId: userId,
                username: username,
                cash: 1000000, // Starting cash 1 million
                bank: 0,
                total: 1000000,
                isVip: false,
                vipLevel: 0,
                vipExpires: null,
                dailyClaimed: null,
                vipDailyClaimed: null,
                totalEarned: 0,
                totalSpent: 0,
                gambleWins: 0,
                gambleLosses: 0,
                dailyTasks: {},
                lastWork: null,
                level: 1,
                xp: 0
            };
            this.saveData();
        } else if (username !== 'User' && this.data.users[userId].username !== username) {
            this.data.users[userId].username = username;
            this.saveData();
        }
        
        return this.data.users[userId];
    }

    // ব্যালেন্স চেক
    checkBalance(userId) {
        const user = this.getUser(userId);
        user.total = user.cash + user.bank;
        this.saveData();
        return user;
    }

    // টাকা যোগ
    addMoney(userId, amount, type = 'cash', reason = 'Added') {
        const user = this.getUser(userId);
        
        if (type === 'cash') {
            user.cash += amount;
        } else if (type === 'bank') {
            user.bank += amount;
        }
        
        user.total = user.cash + user.bank;
        user.totalEarned += amount;
        
        this.logTransaction(userId, 'add', amount, { reason });
        this.saveData();
        
        return user;
    }

    // টাকা কমান
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
        
        this.logTransaction(userId, 'remove', amount, { reason });
        this.saveData();
        
        return { success: true, user };
    }

    // ট্রান্সফার
    transferMoney(senderId, receiverId, amount) {
        const sender = this.getUser(senderId);
        const receiver = this.getUser(receiverId);
        
        if (sender.bank < amount) {
            return { success: false, message: 'Insufficient bank balance' };
        }
        
        // VIP বোনাস চেক
        let vipBonus = 0;
        if (sender.vipLevel >= 1) {
            vipBonus = Math.floor(amount * (sender.vipLevel * 0.01));
        }
        
        const totalAmount = amount + vipBonus;
        
        sender.bank -= amount;
        receiver.bank += totalAmount;
        
        sender.total = sender.cash + sender.bank;
        receiver.total = receiver.cash + receiver.bank;
        
        sender.totalSpent += amount;
        receiver.totalEarned += totalAmount;
        
        // ট্রানজেকশন লগ
        this.logTransaction(senderId, 'transfer_sent', amount, { to: receiverId, vipBonus });
        this.logTransaction(receiverId, 'transfer_received', totalAmount, { from: senderId, vipBonus });
        
        this.saveData();
        
        return {
            success: true,
            sender: sender,
            receiver: receiver,
            vipBonus: vipBonus,
            totalAmount: totalAmount
        };
    }

    // গ্যাম্বলিং
    gamble(userId, amount, gameType) {
        const user = this.getUser(userId);
        
        if (user.cash < amount) {
            return { success: false, message: 'Insufficient cash' };
        }
        
        // VIP বোনাস
        let winChance = 45;
        if (user.vipLevel >= 1) {
            winChance += (user.vipLevel * 5);
        }
        
        const isWin = Math.random() * 100 <= winChance;
        
        if (isWin) {
            const multiplier = 1.5 + Math.random() * 2.5; // 1.5x - 4x
            const winAmount = Math.floor(amount * multiplier);
            
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            
            this.logTransaction(userId, 'gamble_win', winAmount, { game: gameType, bet: amount });
            this.saveData();
            
            return {
                success: true,
                win: true,
                amount: winAmount,
                multiplier: multiplier,
                user: user
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            
            this.logTransaction(userId, 'gamble_loss', amount, { game: gameType });
            this.saveData();
            
            return {
                success: true,
                win: false,
                amount: amount,
                user: user
            };
        }
    }

    // ডেইলি টাস্ক
    completeDailyTask(userId, taskId, reward) {
        const user = this.getUser(userId);
        const today = new Date().toDateString();
        
        // চেক যদি আজকে already claimed
        if (user.dailyTasks && user.dailyTasks[today] && user.dailyTasks[today].includes(taskId)) {
            return { success: false, message: 'Already claimed this task today' };
        }
        
        // টাকা যোগ
        user.cash += reward;
        user.totalEarned += reward;
        
        // টাস্ক মার্ক
        if (!user.dailyTasks) user.dailyTasks = {};
        if (!user.dailyTasks[today]) user.dailyTasks[today] = [];
        user.dailyTasks[today].push(taskId);
        
        this.logTransaction(userId, 'daily_task', reward, { taskId });
        this.saveData();
        
        return { success: true, user };
    }

    // কাজ করে টাকা আয়
    work(userId, salary) {
        const user = this.getUser(userId);
        const now = Date.now();
        
        // Cooldown চেক (1 hour)
        if (user.lastWork && (now - user.lastWork) < 3600000) {
            const remaining = Math.ceil((3600000 - (now - user.lastWork)) / 60000);
            return { success: false, message: `Wait ${remaining} minutes` };
        }
        
        user.cash += salary;
        user.totalEarned += salary;
        user.lastWork = now;
        
        this.logTransaction(userId, 'work', salary);
        this.saveData();
        
        return { success: true, user };
    }

    // VIP কিনা
    buyVip(userId, vipLevel) {
        const user = this.getUser(userId);
        const plan = this.vipPlans[vipLevel];
        
        if (!plan) {
            return { success: false, message: 'Invalid VIP level' };
        }
        
        if (user.cash < plan.price) {
            return { success: false, message: 'Insufficient cash' };
        }
        
        user.cash -= plan.price;
        user.isVip = true;
        user.vipLevel = vipLevel;
        
        // 30 দিনের জন্য VIP
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        user.vipExpires = expireDate.getTime();
        
        user.totalSpent += plan.price;
        
        this.logTransaction(userId, 'vip_purchase', plan.price, { vipLevel });
        this.saveData();
        
        return { success: true, user, plan };
    }

    // VIP ডেইলি বোনাস
    claimVipDaily(userId) {
        const user = this.getUser(userId);
        
        if (!user.isVip || user.vipLevel === 0) {
            return { success: false, message: 'You are not VIP' };
        }
        
        // VIP এক্সপায়ার চেক
        if (user.vipExpires && Date.now() > user.vipExpires) {
            user.isVip = false;
            user.vipLevel = 0;
            this.saveData();
            return { success: false, message: 'VIP expired' };
        }
        
        const today = new Date().toDateString();
        if (user.vipDailyClaimed === today) {
            return { success: false, message: 'Already claimed today' };
        }
        
        const bonus = this.vipPlans[user.vipLevel].dailyBonus;
        user.cash += bonus;
        user.totalEarned += bonus;
        user.vipDailyClaimed = today;
        
        this.logTransaction(userId, 'vip_daily', bonus);
        this.saveData();
        
        return { success: true, user, bonus };
    }

    // লিডারবোর্ড
    getLeaderboard(type = 'total', limit = 10) {
        const users = Object.values(this.data.users);
        
        let sortedUsers = [];
        
        switch(type) {
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
        }
        
        return sortedUsers.slice(0, limit);
    }

    // ট্রানজেকশন লগ
    logTransaction(userId, type, amount, details = {}) {
        const transaction = {
            userId,
            type,
            amount,
            details,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        this.data.transactions.push(transaction);
        
        // সর্বোচ্চ 1000 ট্রানজেকশন রাখা
        if (this.data.transactions.length > 1000) {
            this.data.transactions = this.data.transactions.slice(-1000);
        }
    }
}

// Global economy instance
const economy = new EconomySystem();

module.exports = economy;
