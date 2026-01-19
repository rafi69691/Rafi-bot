// economy.js
const { User, Transaction } = require('./models/User');

class EconomySystem {
    constructor() {
        this.MAX_CASH = 1000000000000; // 1 Trillion limit
        this.MAX_BANK = 1000000000000; // 1 Trillion limit
    }

    // ইউজার তৈরি বা পাওয়া
    async getUser(userId, username = 'User') {
        let user = await User.findOne({ userId });
        
        if (!user) {
            user = await User.create({
                userId,
                username,
                cash: 1000000000, // 1 billion starting
                bank: 0
            });
        } else if (username !== 'User' && user.username !== username) {
            user.username = username;
            await user.save();
        }
        
        return user;
    }

    // ট্রানজেকশন লগ
    async logTransaction(userId, type, amount, details = {}) {
        await Transaction.create({
            userId,
            type,
            amount,
            fromUser: details.fromUser,
            toUser: details.toUser,
            description: details.description
        });
    }

    // ব্যালেন্স চেক
    async checkBalance(userId) {
        const user = await this.getUser(userId);
        return {
            cash: user.cash,
            bank: user.bank,
            total: user.total,
            totalEarned: user.totalEarned,
            totalSpent: user.totalSpent
        };
    }

    // ব্যাংকে টাকা জমা (No limit)
    async deposit(userId, amount) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        // Check if bank will exceed max limit
        if (user.bank + amount > this.MAX_BANK) {
            return { 
                success: false, 
                message: `Bank limit reached! Maximum bank balance is ${this.MAX_BANK.toLocaleString()}`
            };
        }
        
        user.cash -= amount;
        user.bank += amount;
        await user.save();
        
        // Log transaction
        await this.logTransaction(userId, 'deposit', amount, {
            description: `Deposited to bank`
        });
        
        return {
            success: true,
            message: `💰 ${amount.toLocaleString()} টাকা ব্যাংকে জমা দেওয়া হয়েছে`,
            cash: user.cash,
            bank: user.bank
        };
    }

    // ব্যাংক থেকে টাকা তোলা (No limit)
    async withdraw(userId, amount) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.bank) return { success: false, message: 'Insufficient bank balance' };
        
        // Check if cash will exceed max limit
        if (user.cash + amount > this.MAX_CASH) {
            return { 
                success: false, 
                message: `Cash limit reached! Maximum cash is ${this.MAX_CASH.toLocaleString()}`
            };
        }
        
        user.bank -= amount;
        user.cash += amount;
        await user.save();
        
        await this.logTransaction(userId, 'withdraw', amount, {
            description: `Withdrew from bank`
        });
        
        return {
            success: true,
            message: `💰 ${amount.toLocaleString()} টাকা ব্যাংক থেকে তুলে নেওয়া হয়েছে`,
            cash: user.cash,
            bank: user.bank
        };
    }

    // টাকা ট্রান্সফার (No limit)
    async transfer(senderId, receiverId, amount) {
        if (senderId === receiverId) {
            return { success: false, message: 'আপনি নিজেকে টাকা পাঠাতে পারবেন না' };
        }
        
        const sender = await this.getUser(senderId);
        const receiver = await this.getUser(receiverId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > sender.bank) return { success: false, message: 'Insufficient bank balance' };
        
        // Check receiver's bank limit
        if (receiver.bank + amount > this.MAX_BANK) {
            return { 
                success: false, 
                message: `Receiver's bank limit reached!`
            };
        }
        
        sender.bank -= amount;
        receiver.bank += amount;
        
        // Update stats
        sender.totalSpent += amount;
        receiver.totalEarned += amount;
        
        await sender.save();
        await receiver.save();
        
        // Log transactions
        await this.logTransaction(senderId, 'transfer_sent', amount, {
            toUser: receiver.username,
            description: `Transferred to ${receiver.username}`
        });
        
        await this.logTransaction(receiverId, 'transfer_received', amount, {
            fromUser: sender.username,
            description: `Received from ${sender.username}`
        });
        
        return {
            success: true,
            message: `✅ ${amount.toLocaleString()} টাকা ${receiver.username} এর কাছে পাঠানো হয়েছে`,
            senderBalance: sender.bank,
            receiverName: receiver.username
        };
    }

    // গ্যাম্বলিং সিস্টেম (জুয়া খেলা)
    async gamble(userId, amount, choice = null) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        // Minimum and maximum bet
        const MIN_BET = 100;
        const MAX_BET = 1000000;
        
        if (amount < MIN_BET) return { success: false, message: `Minimum bet is ${MIN_BET.toLocaleString()}` };
        if (amount > MAX_BET) return { success: false, message: `Maximum bet is ${MAX_BET.toLocaleString()}` };
        
        // Gambling logic - 45% chance to win, 55% chance to lose
        const winChance = 45; // 45% chance to win
        const random = Math.random() * 100;
        const isWin = random <= winChance;
        
        // Win multiplier: 1.5x to 3x
        const winMultiplier = 1.5 + Math.random() * 1.5; // 1.5x - 3x
        const winAmount = Math.floor(amount * winMultiplier);
        
        if (isWin) {
            // User wins
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            await user.save();
            
            await this.logTransaction(userId, 'gamble_win', winAmount, {
                description: `Won gamble (bet: ${amount}, won: ${winAmount})`
            });
            
            return {
                success: true,
                win: true,
                message: `🎉 **জিতেছেন!** 🎉\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `💰 জিতেছেন: ${winAmount.toLocaleString()} টাকা\n` +
                        `📈 মোট আয়: ${(winAmount - amount).toLocaleString()} টাকা\n` +
                        `🎰 মাল্টিপ্লায়ার: ${winMultiplier.toFixed(2)}x\n\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                amountWon: winAmount,
                multiplier: winMultiplier.toFixed(2)
            };
        } else {
            // User loses
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            await this.logTransaction(userId, 'gamble_lose', amount, {
                description: `Lost gamble`
            });
            
            return {
                success: true,
                win: false,
                message: `😔 **হারিয়েছেন!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `💸 হারিয়েছেন: ${amount.toLocaleString()} টাকা\n` +
                        `🎰 চান্স ছিল: ${winChance}%\n\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা\n` +
                        `💡 আবার চেষ্টা করুন!`,
                amountLost: amount
            };
        }
    }

    // একাধিক গ্যাম্বলিং গেমস
    async gambleGame(userId, gameType, amount) {
        const user = await this.getUser(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        const MIN_BET = 100;
        const MAX_BET = 500000;
        
        if (amount < MIN_BET) return { success: false, message: `Minimum bet is ${MIN_BET}` };
        if (amount > MAX_BET) return { success: false, message: `Maximum bet is ${MAX_BET}` };
        
        switch (gameType) {
            case 'coinflip':
                return await this.coinFlip(userId, amount);
                
            case 'dice':
                return await this.diceGame(userId, amount);
                
            case 'slots':
                return await this.slotsGame(userId, amount);
                
            case 'blackjack':
                return await this.blackjackGame(userId, amount);
                
            default:
                return { success: false, message: 'Invalid game type' };
        }
    }

    // কয়েন ফ্লিপ গেম
    async coinFlip(userId, amount) {
        const user = await this.getUser(userId);
        
        // User chooses heads or tails
        const choices = ['heads', 'tails'];
        const userChoice = choices[Math.floor(Math.random() * choices.length)]; // Random for bot
        const coinResult = choices[Math.floor(Math.random() * choices.length)];
        
        const isWin = userChoice === coinResult;
        const winAmount = Math.floor(amount * 1.8); // 1.8x for coin flip
        
        if (isWin) {
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            await user.save();
            
            await this.logTransaction(userId, 'coinflip_win', winAmount, {
                description: `Won coinflip (choice: ${userChoice})`
            });
            
            return {
                success: true,
                win: true,
                message: `🪙 **কয়েন ফ্লিপ - জয়!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎯 আপনার চয়েস: ${userChoice}\n` +
                        `🪙 কয়েন রেজাল্ট: ${coinResult}\n` +
                        `💰 জিতেছেন: ${winAmount.toLocaleString()} টাকা\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                game: 'coinflip'
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            await this.logTransaction(userId, 'coinflip_lose', amount, {
                description: `Lost coinflip (choice: ${userChoice})`
            });
            
            return {
                success: true,
                win: false,
                message: `🪙 **কয়েন ফ্লিপ - হার!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎯 আপনার চয়েস: ${userChoice}\n` +
                        `🪙 কয়েন রেজাল্ট: ${coinResult}\n` +
                        `💸 হারিয়েছেন: ${amount.toLocaleString()} টাকা\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                game: 'coinflip'
            };
        }
    }

    // ডাইস গেম
    async diceGame(userId, amount) {
        const user = await this.getUser(userId);
        
        const userRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;
        
        const isWin = userRoll > botRoll;
        const winAmount = Math.floor(amount * 2); // 2x for dice
        
        if (isWin) {
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            await user.save();
            
            return {
                success: true,
                win: true,
                message: `🎲 **ডাইস গেম - জয়!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎲 আপনার রোল: ${userRoll}\n` +
                        `🤖 বটের রোল: ${botRoll}\n` +
                        `💰 জিতেছেন: ${winAmount.toLocaleString()} টাকা\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                game: 'dice'
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            return {
                success: true,
                win: false,
                message: `🎲 **ডাইস গেম - হার!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎲 আপনার রোল: ${userRoll}\n` +
                        `🤖 বটের রোল: ${botRoll}\n` +
                        `💸 হারিয়েছেন: ${amount.toLocaleString()} টাকা\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                game: 'dice'
            };
        }
    }

    // স্লটস মেশিন গেম
    async slotsGame(userId, amount) {
        const user = await this.getUser(userId);
        
        const symbols = ['🍒', '⭐', '🔔', '💎', '7️⃣', '🍀'];
        const reels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        // Check for wins
        let winMultiplier = 0;
        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            // All three match
            winMultiplier = 10;
        } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
            // Two match
            winMultiplier = 3;
        }
        
        if (winMultiplier > 0) {
            const winAmount = amount * winMultiplier;
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            await user.save();
            
            return {
                success: true,
                win: true,
                message: `🎰 **স্লটস মেশিন - জ্যাকপট!** 🎰\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎰 রেজাল্ট: ${reels.join(' | ')}\n` +
                        `💰 জিতেছেন: ${winAmount.toLocaleString()} টাকা\n` +
                        `📈 মাল্টিপ্লায়ার: ${winMultiplier}x\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা`,
                game: 'slots'
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            return {
                success: true,
                win: false,
                message: `🎰 **স্লটস মেশিন - হার!**\n\n` +
                        `💰 বাজি: ${amount.toLocaleString()} টাকা\n` +
                        `🎰 রেজাল্ট: ${reels.join(' | ')}\n` +
                        `💸 হারিয়েছেন: ${amount.toLocaleString()} টাকা\n` +
                        `💵 নতুন ক্যাশ: ${user.cash.toLocaleString()} টাকা\n` +
                        `💡 আবার চেষ্টা করুন!`,
                game: 'slots'
            };
        }
    }

    // ইকোনমি রিসেট/রিস্টার্ট (শুধু অ্যাডমিন)
    async resetEconomy(adminId, type = 'all') {
        const admin = await this.getUser(adminId);
        
        if (!admin.isAdmin) {
            return { success: false, message: 'শুধুমাত্র অ্যাডমিনরা ইকোনমি রিসেট করতে পারে' };
        }
        
        try {
            if (type === 'all') {
                // সব ইউজারের টাকা রিসেট
                await User.updateMany({}, {
                    $set: {
                        cash: 1000000000,
                        bank: 0,
                        totalEarned: 0,
                        totalSpent: 0,
                        gambleWins: 0,
                        gambleLosses: 0
                    }
                });
                
                // সব ট্রানজেকশন ডিলিট
                await Transaction.deleteMany({});
                
                return {
                    success: true,
                    message: '✅ সম্পূর্ণ ইকোনমি সিস্টেম রিসেট করা হয়েছে!\nসকল ইউজার পেয়েছেন 1,000,000,000 টাকা স্টার্টিং ব্যালেন্স।'
                };
                
            } else if (type === 'user') {
                // শুধু ইউজার ডাটা রিসেট
                await User.updateMany({}, {
                    $set: {
                        cash: 1000000000,
                        bank: 0
                    }
                });
                
                return {
                    success: true,
                    message: '✅ সকল ইউজারের ব্যালেন্স রিসেট করা হয়েছে!'
                };
                
            } else if (type === 'transactions') {
                // শুধু ট্রানজেকশন ডিলিট
                await Transaction.deleteMany({});
                
                return {
                    success: true,
                    message: '✅ সকল ট্রানজেকশন হিস্টরি ডিলিট করা হয়েছে!'
                };
            }
            
        } catch (error) {
            console.error('Reset error:', error);
            return { success: false, message: 'রিসেট করতে সমস্যা হয়েছে' };
        }
    }

    // অ্যাডমিন টাকা যোগ/সরান (No limit)
    async adminAddMoney(adminId, targetId, amount, type = 'cash') {
        const admin = await this.getUser(adminId);
        
        if (!admin.isAdmin) {
            return { success: false, message: 'শুধুমাত্র অ্যাডমিনরা এই কমান্ড ব্যবহার করতে পারে' };
        }
        
        const targetUser = await this.getUser(targetId);
        
        // Check limits
        if (type === 'cash' && targetUser.cash + amount > this.MAX_CASH) {
            return { 
                success: false, 
                message: `Target user's cash will exceed maximum limit of ${this.MAX_CASH.toLocaleString()}`
            };
        } else if (type === 'bank' && targetUser.bank + amount > this.MAX_BANK) {
            return { 
                success: false, 
                message: `Target user's bank will exceed maximum limit of ${this.MAX_BANK.toLocaleString()}`
            };
        }
        
        if (type === 'cash') {
            targetUser.cash += amount;
            targetUser.totalEarned += amount;
        } else if (type === 'bank') {
            targetUser.bank += amount;
            targetUser.totalEarned += amount;
        }
        
        await targetUser.save();
        
        await this.logTransaction(targetId, 'admin_add', amount, {
            fromUser: admin.username,
            description: `Admin ${admin.username} added money`
        });
        
        return {
            success: true,
            message: `✅ ${amount.toLocaleString()} টাকা ${targetUser.username} এর ${type === 'cash' ? 'ক্যাশ' : 'ব্যাংক'} এ যোগ করা হয়েছে`,
            targetUser: targetUser.username
        };
    }

    // লিডারবোর্ড
    async getLeaderboard(limit = 10) {
        const users = await User.find()
            .sort({ total: -1 })
            .limit(limit);
        
        return users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            cash: user.cash,
            bank: user.bank,
            total: user.total,
            totalEarned: user.totalEarned,
            gambleWins: user.gambleWins
        }));
    }

    // গ্যাম্বল লিডারবোর্ড
    async getGambleLeaderboard(limit = 10) {
        const users = await User.find()
            .sort({ gambleWins: -1 })
            .limit(limit);
        
        return users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            gambleWins: user.gambleWins,
            gambleLosses: user.gambleLosses,
            winRate: user.gambleWins + user.gambleLosses > 0 
                ? Math.round((user.gambleWins / (user.gambleWins + user.gambleLosses)) * 100) 
                : 0
        }));
    }

    // স্ট্যাটিস্টিক্স
    async getStats(userId) {
        const user = await this.getUser(userId);
        
        const totalGames = user.gambleWins + user.gambleLosses;
        const winRate = totalGames > 0 ? Math.round((user.gambleWins / totalGames) * 100) : 0;
        
        return {
            cash: user.cash,
            bank: user.bank,
            total: user.total,
            totalEarned: user.totalEarned,
            totalSpent: user.totalSpent,
            netProfit: user.totalEarned - user.totalSpent,
            gambleWins: user.gambleWins,
            gambleLosses: user.gambleLosses,
            totalGames: totalGames,
            winRate: winRate,
            dailyClaimed: user.dailyClaimed
        };
    }
}

module.exports = EconomySystem;
