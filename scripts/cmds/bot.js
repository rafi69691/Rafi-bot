// bot.js
const EconomySystem = require('./economy');
const connectDB = require('./db');
require('dotenv').config();

// Facebook/WhatsApp bot এর জন্য
// এখানে আপনার messenger-bot বা whatsapp-bot এর লাইব্রেরি ব্যবহার করুন

class EconomyBot {
    constructor() {
        this.economy = new EconomySystem();
        this.adminIds = ['100052951819398']; // আপনার Admin User IDs
        this.commands = {
            '!balance': this.handleBalance.bind(this),
            '!deposit': this.handleDeposit.bind(this),
            '!withdraw': this.handleWithdraw.bind(this),
            '!transfer': this.handleTransfer.bind(this),
            '!bank': this.handleBank.bind(this),
            '!leaderboard': this.handleLeaderboard.bind(this),
            '!admin add': this.handleAdminAdd.bind(this),
            '!admin remove': this.handleAdminRemove.bind(this),
            '!admin set': this.handleAdminSet.bind(this),
            '!help': this.handleHelp.bind(this)
        };
    }

    async init() {
        await connectDB();
        console.log('Economy Bot Started');
    }

    // কমান্ড হ্যান্ডলার
    async handleCommand(userId, username, message) {
        const args = message.trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        // Admin commands check
        const isAdmin = this.adminIds.includes(userId);
        
        switch(command) {
            case '!balance':
                return await this.handleBalance(userId);
                
            case '!deposit':
                const depositAmount = parseInt(args[0]);
                if (isNaN(depositAmount)) return 'Please provide valid amount';
                return await this.handleDeposit(userId, depositAmount);
                
            case '!withdraw':
                const withdrawAmount = parseInt(args[0]);
                if (isNaN(withdrawAmount)) return 'Please provide valid amount';
                return await this.handleWithdraw(userId, withdrawAmount);
                
            case '!transfer':
                if (args.length < 2) return 'Use: !transfer [amount] [@user]';
                const transferAmount = parseInt(args[0]);
                const receiverId = args[1]; // Facebook/WhatsApp user ID
                if (isNaN(transferAmount)) return 'Invalid amount';
                return await this.handleTransfer(userId, receiverId, transferAmount);
                
            case '!bank':
                return await this.handleBank(userId);
                
            case '!leaderboard':
                return await this.handleLeaderboard();
                
            case '!admin':
                if (!isAdmin) return 'Only admin can use this command';
                const adminCommand = args.shift();
                
                if (adminCommand === 'add') {
                    if (args.length < 2) return 'Use: !admin add [@user] [amount] [cash/bank]';
                    const targetId = args[0];
                    const amount = parseInt(args[1]);
                    const type = args[2] || 'cash';
                    return await this.handleAdminAdd(userId, targetId, amount, type);
                }
                
                if (adminCommand === 'remove') {
                    if (args.length < 2) return 'Use: !admin remove [@user] [amount] [cash/bank]';
                    const targetId = args[0];
                    const amount = parseInt(args[1]);
                    const type = args[2] || 'cash';
                    return await this.handleAdminRemove(userId, targetId, amount, type);
                }
                
                if (adminCommand === 'set') {
                    if (args.length < 2) return 'Use: !admin set [@user] [true/false]';
                    const targetId = args[0];
                    const makeAdmin = args[1] === 'true';
                    return await this.handleAdminSet(userId, targetId, makeAdmin);
                }
                break;
                
            case '!help':
                return this.handleHelp();
        }
        
        return 'Unknown command. Use !help for commands list.';
    }

    async handleBalance(userId) {
        const balance = await this.economy.checkBalance(userId);
        return `💰 আপনার ব্যালেন্স:\n💵 ক্যাশ: ${balance.cash}\n🏦 ব্যাংক: ${balance.bank}\n📊 মোট: ${balance.total}`;
    }

    async handleDeposit(userId, amount) {
        const result = await this.economy.deposit(userId, amount);
        if (!result.success) return `❌ ${result.message}`;
        return `${result.message}\n💵 ক্যাশ: ${result.cash}\n🏦 ব্যাংক: ${result.bank}`;
    }

    async handleWithdraw(userId, amount) {
        const result = await this.economy.withdraw(userId, amount);
        if (!result.success) return `❌ ${result.message}`;
        return `${result.message}\n💵 ক্যাশ: ${result.cash}\n🏦 ব্যাংক: ${result.bank}`;
    }

    async handleTransfer(senderId, receiverId, amount) {
        const result = await this.economy.transfer(senderId, receiverId, amount);
        if (!result.success) return `❌ ${result.message}`;
        return `${result.message}\n🏦 আপনার ব্যাংক ব্যালেন্স: ${result.senderBalance}`;
    }

    async handleBank(userId) {
        const balance = await this.economy.checkBalance(userId);
        return `🏦 ব্যাংক স্টেটমেন্ট:\n💰 ব্যাংক ব্যালেন্স: ${balance.bank}\n💵 ক্যাশ ব্যালেন্স: ${balance.cash}`;
    }

    async handleLeaderboard() {
        const topUsers = await this.economy.getLeaderboard(10);
        let response = '🏆 **শীর্ষ ১০ ধনী ব্যক্তি**\n\n';
        topUsers.forEach(user => {
            response += `#${user.rank} ${user.username} - 💰 ${user.total}\n`;
        });
        return response;
    }

    async handleAdminAdd(adminId, targetId, amount, type) {
        const result = await this.economy.adminAddMoney(adminId, targetId, amount, type);
        return result.success ? `✅ ${result.message}` : `❌ ${result.message}`;
    }

    async handleAdminRemove(adminId, targetId, amount, type) {
        const result = await this.economy.adminRemoveMoney(adminId, targetId, amount, type);
        return result.success ? `✅ ${result.message}` : `❌ ${result.message}`;
    }

    async handleAdminSet(adminId, targetId, makeAdmin) {
        const result = await this.economy.setAdmin(targetId, makeAdmin);
        return result.success ? result.message : `❌ ${result.message}`;
    }

    handleHelp() {
        return `📚 **ইকোনমি বট কমান্ডস** 📚
        
👤 **সাধারণ কমান্ড:**
!balance - আপনার ব্যালেন্স চেক করুন
!deposit [amount] - ব্যাংকে টাকা জমা দিন
!withdraw [amount] - ব্যাংক থেকে টাকা তুলুন
!transfer [amount] [@user] - টাকা ট্রান্সফার করুন
!bank - ব্যাংক ডিটেইলস
!leaderboard - র‍্যাঙ্কিং দেখুন

👑 **অ্যাডমিন কমান্ড (শুধু অ্যাডমিনদের জন্য):**
!admin add [@user] [amount] [cash/bank] - ইউজারকে টাকা দিন
!admin remove [@user] [amount] [cash/bank] - ইউজারের টাকা কমান
!admin set [@user] [true/false] - অ্যাডমিন সেট করুন

💡 Example: !deposit 500`;
    }
}

// Facebook/WhatsApp bot এর সাথে সংযোগ
const bot = new EconomyBot();

// Facebook bot এর সাথে ইন্টিগ্রেশন (উদাহরণ)
/*
const login = require("facebook-chat-api");

login({email: "email", password: "password"}, (err, api) => {
    if(err) return console.error(err);
    
    bot.init();
    
    api.listen((err, message) => {
        if(err) return console.error(err);
        
        const userId = message.senderID;
        const messageBody = message.body;
        
        bot.handleCommand(userId, userId, messageBody)
            .then(response => {
                api.sendMessage(response, message.threadID);
            })
            .catch(err => {
                console.error(err);
                api.sendMessage('Something went wrong', message.threadID);
            });
    });
});
*/

module.exports = bot;
