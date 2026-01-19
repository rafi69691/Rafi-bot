// economy.js
const User = require('./models/User');

class EconomySystem {
    constructor() {
        this.users = new Map();
    }

    // ইউজার তৈরি বা পাওয়া
    async getUser(userId, username = 'User') {
        let user = await User.findOne({ userId });
        
        if (!user) {
            user = await User.create({
                userId,
                username,
                cash: 1000,
                bank: 0
            });
        }
        
        return user;
    }

    // ব্যালেন্স চেক
    async checkBalance(userId) {
        const user = await this.getUser(userId);
        return {
            cash: user.cash,
            bank: user.bank,
            total: user.total
        };
    }

    // ব্যাংকে টাকা জমা
    async deposit(userId, amount) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        user.cash -= amount;
        user.bank += amount;
        await user.save();
        
        return {
            success: true,
            message: `💰 ${amount} টাকা ব্যাংকে জমা দেওয়া হয়েছে`,
            cash: user.cash,
            bank: user.bank
        };
    }

    // ব্যাংক থেকে টাকা তোলা
    async withdraw(userId, amount) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.bank) return { success: false, message: 'Insufficient bank balance' };
        
        user.bank -= amount;
        user.cash += amount;
        await user.save();
        
        return {
            success: true,
            message: `💰 ${amount} টাকা ব্যাংক থেকে তুলে নেওয়া হয়েছে`,
            cash: user.cash,
            bank: user.bank
        };
    }

    // টাকা ট্রান্সফার (ব্যাংক থেকে ব্যাংক)
    async transfer(senderId, receiverId, amount) {
        const sender = await this.getUser(senderId);
        const receiver = await this.getUser(receiverId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > sender.bank) return { success: false, message: 'Insufficient bank balance' };
        
        sender.bank -= amount;
        receiver.bank += amount;
        
        await sender.save();
        await receiver.save();
        
        return {
            success: true,
            message: `💰 ${amount} টাকা ট্রান্সফার করা হয়েছে`,
            senderBalance: sender.bank,
            receiverName: receiver.username
        };
    }

    // অ্যাডমিন টাকা যোগ করতে পারবে
    async adminAddMoney(adminId, targetUserId, amount, type = 'cash') {
        const admin = await this.getUser(adminId);
        
        // চেক করি অ্যাডমিন কিনা
        if (!admin.isAdmin) {
            return { success: false, message: 'Only admin can use this command' };
        }
        
        const targetUser = await this.getUser(targetUserId);
        
        if (type === 'cash') {
            targetUser.cash += amount;
        } else if (type === 'bank') {
            targetUser.bank += amount;
        }
        
        await targetUser.save();
        
        return {
            success: true,
            message: `✅ ${amount} টাকা ${type === 'cash' ? 'ক্যাশ' : 'ব্যাংক'} এ যোগ করা হয়েছে`,
            targetUser: targetUser.username,
            newBalance: type === 'cash' ? targetUser.cash : targetUser.bank
        };
    }

    // অ্যাডমিন টাকা সরাতে পারবে
    async adminRemoveMoney(adminId, targetUserId, amount, type = 'cash') {
        const admin = await this.getUser(adminId);
        
        if (!admin.isAdmin) {
            return { success: false, message: 'Only admin can use this command' };
        }
        
        const targetUser = await this.getUser(targetUserId);
        
        if (type === 'cash' && targetUser.cash < amount) {
            return { success: false, message: 'Target user has insufficient cash' };
        }
        if (type === 'bank' && targetUser.bank < amount) {
            return { success: false, message: 'Target user has insufficient bank balance' };
        }
        
        if (type === 'cash') {
            targetUser.cash -= amount;
        } else if (type === 'bank') {
            targetUser.bank -= amount;
        }
        
        await targetUser.save();
        
        return {
            success: true,
            message: `⚠️ ${amount} টাকা ${type === 'cash' ? 'ক্যাশ' : 'ব্যাংক'} থেকে সরানো হয়েছে`,
            targetUser: targetUser.username
        };
    }

    // র‍্যাঙ্কিং সিস্টেম
    async getLeaderboard(limit = 10) {
        const users = await User.find()
            .sort({ total: -1 })
            .limit(limit);
        
        return users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            cash: user.cash,
            bank: user.bank,
            total: user.total
        }));
    }

    // অ্যাডমিন সেট করতে পারবে
    async setAdmin(userId, makeAdmin = true) {
        const user = await this.getUser(userId);
        user.isAdmin = makeAdmin;
        await user.save();
        
        return {
            success: true,
            message: makeAdmin 
                ? `✅ ${user.username} কে অ্যাডমিন বানানো হয়েছে` 
                : `❌ ${user.username} এর অ্যাডমিন পদত্যাগ করা হয়েছে`
        };
    }
}

module.exports = EconomySystem;
