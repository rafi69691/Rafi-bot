// economy.js
const { User, Transaction } = require('./models/User');

class EconomySystem {
    constructor() {
        this.MAX_CASH = 1000000000000;
        this.MAX_BANK = 1000000000000;
        
        // VIP Pricing and Benefits
        this.VIP_PLANS = {
            1: { name: "Bronze VIP", price: 5000000, duration: 7, color: "🟤", dailyBonus: 50000, gambleBonus: 5, transferBonus: 2 },
            2: { name: "Silver VIP", price: 15000000, duration: 15, color: "⚪", dailyBonus: 150000, gambleBonus: 10, transferBonus: 5 },
            3: { name: "Gold VIP", price: 30000000, duration: 30, color: "🟡", dailyBonus: 300000, gambleBonus: 15, transferBonus: 8 },
            4: { name: "Diamond VIP", price: 50000000, duration: 30, color: "🔷", dailyBonus: 500000, gambleBonus: 20, transferBonus: 12 },
            5: { name: "Royal VIP", price: 100000000, duration: 30, color: "👑", dailyBonus: 1000000, gambleBonus: 25, transferBonus: 15 }
        };
    }

    // ইউজার তৈরি বা পাওয়া
    async getUser(userId, username = 'User') {
        let user = await User.findOne({ userId });
        
        if (!user) {
            user = await User.create({
                userId,
                username,
                cash: 1000000000,
                bank: 0
            });
        } else if (username !== 'User' && user.username !== username) {
            user.username = username;
            await user.save();
        }
        
        return user;
    }

    // VIP Benefits Check
    async getVipBenefits(userId) {
        const user = await this.getUser(userId);
        const vipInfo = user.getVipInfo();
        const hasActiveVip = user.hasVipBenefits();
        
        return {
            isVip: user.isVip,
            vipLevel: user.vipLevel,
            vipName: vipInfo.name,
            vipColor: vipInfo.color,
            dailyBonus: vipInfo.dailyBonus,
            gambleBonus: vipInfo.gambleBonus,
            transferBonus: vipInfo.transferBonus,
            expires: user.vipExpires,
            hasActiveVip: hasActiveVip,
            daysLeft: hasActiveVip ? 
                Math.ceil((user.vipExpires - new Date()) / (1000 * 60 * 60 * 24)) : 0
        };
    }

    // VIP কিনা
    async purchaseVip(userId, vipLevel) {
        const user = await this.getUser(userId);
        const vipPlan = this.VIP_PLANS[vipLevel];
        
        if (!vipPlan) {
            return { success: false, message: 'Invalid VIP level' };
        }
        
        if (user.cash < vipPlan.price) {
            return { success: false, message: `Insufficient cash! You need ${vipPlan.price.toLocaleString()} টাকা` };
        }
        
        // Calculate expiration date
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + vipPlan.duration);
        
        // Apply VIP
        user.cash -= vipPlan.price;
        user.isVip = true;
        user.vipLevel = vipLevel;
        user.vipExpires = expireDate;
        user.vipPurchases += 1;
        user.totalSpent += vipPlan.price;
        
        await user.save();
        
        // Log transaction
        await this.logTransaction(userId, 'vip_purchase', vipPlan.price, {
            description: `Purchased ${vipPlan.name} for ${vipPlan.duration} days`,
            vipLevel: vipLevel
        });
        
        return {
            success: true,
            message: `🎉 **Congratulations!** 🎉\n\n` +
                    `✅ Successfully purchased **${vipPlan.name}**!\n` +
                    `💰 Price: ${vipPlan.price.toLocaleString()} টাকা\n` +
                    `📅 Duration: ${vipPlan.duration} days\n` +
                    `⏰ Expires: ${expireDate.toLocaleDateString()}\n\n` +
                    `✨ **Benefits Activated:**\n` +
                    `• Daily Bonus: ${vipPlan.dailyBonus.toLocaleString()} টাকা\n` +
                    `• Gambling Bonus: +${vipPlan.gambleBonus}% win chance\n` +
                    `• Transfer Bonus: +${vipPlan.transferBonus}% extra cash\n` +
                    `• Special Commands Access`,
            vipPlan: vipPlan,
            expires: expireDate
        };
    }

    // VIP Daily Bonus Claim
    async claimVipDaily(userId) {
        const user = await this.getUser(userId);
        const vipBenefits = await this.getVipBenefits(userId);
        
        if (!vipBenefits.hasActiveVip) {
            return { success: false, message: 'You are not an active VIP member' };
        }
        
        // Check if already claimed today
        const now = new Date();
        const lastClaim = user.vipDailyClaimed;
        
        if (lastClaim) {
            const lastClaimDate = new Date(lastClaim);
            if (lastClaimDate.toDateString() === now.toDateString()) {
                const nextClaim = new Date(lastClaimDate);
                nextClaim.setDate(nextClaim.getDate() + 1);
                nextClaim.setHours(0, 0, 0, 0);
                
                const hoursLeft = Math.ceil((nextClaim - now) / (1000 * 60 * 60));
                return { 
                    success: false, 
                    message: `You already claimed your VIP bonus today!\nNext bonus available in ${hoursLeft} hours.`
                };
            }
        }
        
        // Give daily bonus
        const dailyBonus = vipBenefits.dailyBonus;
        user.cash += dailyBonus;
        user.totalEarned += dailyBonus;
        user.totalVipBenefits += dailyBonus;
        user.vipDailyClaimed = now;
        
        await user.save();
        
        await this.logTransaction(userId, 'vip_daily', dailyBonus, {
            description: `Claimed VIP daily bonus`,
            vipLevel: user.vipLevel
        });
        
        return {
            success: true,
            message: `🎁 **VIP Daily Bonus Claimed!** 🎁\n\n` +
                    `💰 Received: ${dailyBonus.toLocaleString()} টাকা\n` +
                    `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n` +
                    `📅 Next bonus available tomorrow\n\n` +
                    `✨ VIP Level: ${vipBenefits.vipColor} ${vipBenefits.vipName}\n` +
                    `⏰ VIP Expires in: ${vipBenefits.daysLeft} days`,
            bonus: dailyBonus,
            newCash: user.cash
        };
    }

    // VIP Gambling Bonus (Enhanced gambling for VIPs)
    async vipGamble(userId, amount, gameType = 'normal') {
        const user = await this.getUser(userId);
        const vipBenefits = await this.getVipBenefits(userId);
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        const MIN_BET = 100;
        const MAX_BET = vipBenefits.hasActiveVip ? 5000000 : 1000000; // VIPs can bet more
        
        if (amount < MIN_BET) return { success: false, message: `Minimum bet is ${MIN_BET}` };
        if (amount > MAX_BET) return { success: false, message: `Maximum bet is ${MAX_BET.toLocaleString()}` };
        
        // Enhanced win chance for VIPs
        let baseWinChance = 45;
        if (vipBenefits.hasActiveVip) {
            baseWinChance += vipBenefits.gambleBonus;
        }
        
        const random = Math.random() * 100;
        const isWin = random <= baseWinChance;
        
        // Enhanced multiplier for VIPs
        let baseMultiplier = 1.5;
        let maxMultiplier = 3.0;
        
        if (vipBenefits.hasActiveVip) {
            baseMultiplier += vipBenefits.vipLevel * 0.1;
            maxMultiplier += vipBenefits.vipLevel * 0.2;
        }
        
        const winMultiplier = baseMultiplier + Math.random() * (maxMultiplier - baseMultiplier);
        const winAmount = Math.floor(amount * winMultiplier);
        
        if (isWin) {
            // Extra bonus for VIPs
            let vipBonus = 0;
            if (vipBenefits.hasActiveVip) {
                vipBonus = Math.floor(winAmount * 0.05 * vipBenefits.vipLevel); // 5% extra per level
            }
            
            const totalWin = winAmount + vipBonus;
            
            user.cash += totalWin;
            user.totalEarned += totalWin;
            user.gambleWins += 1;
            user.totalVipBenefits += vipBonus;
            await user.save();
            
            await this.logTransaction(userId, 'vip_gamble_win', totalWin, {
                description: `Won VIP gamble (bonus: ${vipBonus})`,
                vipLevel: user.vipLevel
            });
            
            let vipMessage = '';
            if (vipBonus > 0) {
                vipMessage = `✨ **VIP BONUS:** +${vipBonus.toLocaleString()} টাকা\n`;
            }
            
            return {
                success: true,
                win: true,
                message: `🎉 **VIP GAMBLE - JACKPOT!** 🎉\n\n` +
                        `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                        `🎰 Game: ${gameType}\n` +
                        `📈 Multiplier: ${winMultiplier.toFixed(2)}x\n` +
                        `💰 Won: ${winAmount.toLocaleString()} টাকা\n` +
                        vipMessage +
                        `💰 Total Won: ${totalWin.toLocaleString()} টাকা\n` +
                        `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n` +
                        `✨ VIP Win Chance: ${baseWinChance}%`,
                amountWon: totalWin,
                vipBonus: vipBonus
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            await this.logTransaction(userId, 'gamble_lose', amount, {
                description: `Lost gamble`,
                vipLevel: user.vipLevel
            });
            
            return {
                success: true,
                win: false,
                message: `😔 **Better Luck Next Time!**\n\n` +
                        `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                        `🎰 Game: ${gameType}\n` +
                        `💸 Lost: ${amount.toLocaleString()} টাকা\n` +
                        `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n` +
                        (vipBenefits.hasActiveVip ? 
                         `✨ Your VIP Win Chance: ${baseWinChance}%\n` : 
                         `🎰 Win Chance: ${baseWinChance}%\n`) +
                        `💡 VIP members have higher win chances!`,
                amountLost: amount
            };
        }
    }

    // VIP Transfer Bonus
    async vipTransfer(senderId, receiverId, amount) {
        const sender = await this.getUser(senderId);
        const receiver = await this.getUser(receiverId);
        const senderVip = await this.getVipBenefits(senderId);
        
        if (senderId === receiverId) {
            return { success: false, message: 'You cannot transfer money to yourself!' };
        }
        
        if (amount <= 0) return { success: false, message: 'Amount must be positive' };
        if (amount > sender.bank) return { success: false, message: 'Insufficient bank balance' };
        
        // VIP Transfer Bonus
        let vipBonus = 0;
        if (senderVip.hasActiveVip) {
            vipBonus = Math.floor(amount * (senderVip.transferBonus / 100));
        }
        
        const totalAmount = amount + vipBonus;
        
        // Check limits
        if (receiver.bank + totalAmount > this.MAX_BANK) {
            return { 
                success: false, 
                message: `Receiver's bank limit reached!`
            };
        }
        
        sender.bank -= amount;
        receiver.bank += totalAmount;
        
        // Update stats
        sender.totalSpent += amount;
        receiver.totalEarned += totalAmount;
        
        if (vipBonus > 0) {
            receiver.totalVipBenefits += vipBonus;
        }
        
        await sender.save();
        await receiver.save();
        
        // Log transactions
        await this.logTransaction(senderId, 'vip_transfer_sent', amount, {
            toUser: receiver.username,
            description: `Transferred with VIP bonus: ${vipBonus}`,
            vipLevel: sender.vipLevel
        });
        
        await this.logTransaction(receiverId, 'vip_transfer_received', totalAmount, {
            fromUser: sender.username,
            description: `Received with VIP bonus: ${vipBonus}`,
            vipLevel: sender.vipLevel
        });
        
        let bonusMessage = '';
        if (vipBonus > 0) {
            bonusMessage = `✨ **VIP BONUS:** +${vipBonus.toLocaleString()} টাকা\n`;
        }
        
        return {
            success: true,
            message: `✅ **VIP Transfer Successful!** ✅\n\n` +
                    `💰 Amount: ${amount.toLocaleString()} টাকা\n` +
                    bonusMessage +
                    `💰 Total Sent: ${totalAmount.toLocaleString()} টাকা\n` +
                    `👤 To: ${receiver.username}\n` +
                    `🏦 Your Bank: ${sender.bank.toLocaleString()} টাকা\n` +
                    (senderVip.hasActiveVip ? 
                     `✨ Your VIP Level: ${senderVip.vipColor} ${senderVip.vipName}\n` +
                     `🎁 Transfer Bonus: +${senderVip.transferBonus}%` : ''),
            totalAmount: totalAmount,
            vipBonus: vipBonus
        };
    }

    // Check VIP Status
    async checkVipStatus(userId) {
        const user = await this.getUser(userId);
        const vipBenefits = await this.getVipBenefits(userId);
        
        if (!vipBenefits.hasActiveVip) {
            return {
                isVip: false,
                message: `❌ **You are not a VIP member!**\n\n` +
                        `✨ Purchase VIP to unlock amazing benefits:\n` +
                        `• Daily Cash Bonus\n` +
                        `• Higher Gambling Win Chance\n` +
                        `• Transfer Bonuses\n` +
                        `• Special Commands\n\n` +
                        `💎 Use !vip buy to see available plans`
            };
        }
        
        const vipPlan = this.VIP_PLANS[user.vipLevel];
        
        return {
            isVip: true,
            message: `🌟 **VIP STATUS** 🌟\n\n` +
                    `✨ Level: ${vipBenefits.vipColor} **${vipBenefits.vipName}**\n` +
                    `💰 Daily Bonus: ${vipPlan.dailyBonus.toLocaleString()} টাকা\n` +
                    `🎰 Gambling Bonus: +${vipPlan.gambleBonus}% win chance\n` +
                    `💸 Transfer Bonus: +${vipPlan.transferBonus}% extra cash\n` +
                    `📅 Expires: ${user.vipExpires.toLocaleDateString()}\n` +
                    `⏰ Days Left: ${vipBenefits.daysLeft} days\n\n` +
                    `💎 **Total VIP Benefits Received:** ${user.totalVipBenefits.toLocaleString()} টাকা\n` +
                    `🎁 Use !vip daily to claim daily bonus`,
            vipInfo: vipBenefits,
            daysLeft: vipBenefits.daysLeft,
            totalBenefits: user.totalVipBenefits
        };
    }

    // VIP Leaderboard
    async getVipLeaderboard(limit = 10) {
        const users = await User.find({ isVip: true, vipExpires: { $gt: new Date() } })
            .sort({ vipLevel: -1, totalVipBenefits: -1 })
            .limit(limit);
        
        return users.map((user, index) => {
            const vipInfo = user.getVipInfo();
            return {
                rank: index + 1,
                username: user.username,
                vipLevel: user.vipLevel,
                vipName: vipInfo.name,
                vipColor: vipInfo.color,
                totalBenefits: user.totalVipBenefits,
                daysLeft: Math.ceil((user.vipExpires - new Date()) / (1000 * 60 * 60 * 24))
            };
        });
    }

    // Renew VIP
    async renewVip(userId, vipLevel) {
        const user = await this.getUser(userId);
        const vipPlan = this.VIP_PLANS[vipLevel];
        
        if (!vipPlan) {
            return { success: false, message: 'Invalid VIP level' };
        }
        
        if (user.cash < vipPlan.price) {
            return { success: false, message: `Insufficient cash! You need ${vipPlan.price.toLocaleString()} টাকা` };
        }
        
        // Calculate new expiration date
        let expireDate = new Date();
        if (user.vipExpires && user.vipExpires > new Date()) {
            // Add to existing VIP
            expireDate = new Date(user.vipExpires);
        }
        expireDate.setDate(expireDate.getDate() + vipPlan.duration);
        
        // Apply VIP
        user.cash -= vipPlan.price;
        user.isVip = true;
        user.vipLevel = vipLevel;
        user.vipExpires = expireDate;
        user.vipPurchases += 1;
        user.totalSpent += vipPlan.price;
        
        await user.save();
        
        await this.logTransaction(userId, 'vip_renew', vipPlan.price, {
            description: `Renewed ${vipPlan.name} for ${vipPlan.duration} days`,
            vipLevel: vipLevel
        });
        
        return {
            success: true,
            message: `♻️ **VIP Renewed Successfully!** ♻️\n\n` +
                    `✅ Renewed **${vipPlan.name}**\n` +
                    `💰 Price: ${vipPlan.price.toLocaleString()} টাকা\n` +
                    `📅 New Expiry: ${expireDate.toLocaleDateString()}\n` +
                    `⏰ Total Duration: ${vipPlan.duration} days added\n\n` +
                    `✨ Continue enjoying VIP benefits!`,
            vipPlan: vipPlan,
            expires: expireDate
        };
    }

    // Special VIP Command: Double Daily
    async vipDoubleDaily(userId) {
        const user = await this.getUser(userId);
        const vipBenefits = await this.getVipBenefits(userId);
        
        if (!vipBenefits.hasActiveVip || vipBenefits.vipLevel < 3) {
            return { 
                success: false, 
                message: 'This feature requires Gold VIP or higher!'
            };
        }
        
        // Check if already used today
        const now = new Date();
        if (user.lastVipReward && user.lastVipReward.toDateString() === now.toDateString()) {
            return { 
                success: false, 
                message: 'You have already used VIP Double Daily today!'
            };
        }
        
        const doubleBonus = vipBenefits.dailyBonus * 2;
        user.cash += doubleBonus;
        user.totalEarned += doubleBonus;
        user.totalVipBenefits += doubleBonus;
        user.lastVipReward = now;
        
        await user.save();
        
        await this.logTransaction(userId, 'vip_double_daily', doubleBonus, {
            description: 'VIP Double Daily bonus claimed',
            vipLevel: user.vipLevel
        });
        
        return {
            success: true,
            message: `🎁 **VIP DOUBLE DAILY BONUS!** 🎁\n\n` +
                    `💰 Received: ${doubleBonus.toLocaleString()} টাকা\n` +
                    `✨ Regular Bonus: ${vipBenefits.dailyBonus.toLocaleString()} টাকা\n` +
                    `✨ Extra Bonus: ${vipBenefits.dailyBonus.toLocaleString()} টাকা\n` +
                    `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n\n` +
                    `🌟 VIP Level: ${vipBenefits.vipColor} ${vipBenefits.vipName}\n` +
                    `⏰ Available once daily for Gold+ VIPs`,
            bonus: doubleBonus
        };
    }

    // VIP Casino (Special high-stakes gambling for VIPs)
    async vipCasino(userId, amount) {
        const user = await this.getUser(userId);
        const vipBenefits = await this.getVipBenefits(userId);
        
        if (!vipBenefits.hasActiveVip || vipBenefits.vipLevel < 2) {
            return { 
                success: false, 
                message: 'VIP Casino requires Silver VIP or higher!'
            };
        }
        
        const MIN_BET = 10000;
        const MAX_BET = 10000000;
        
        if (amount < MIN_BET) return { success: false, message: `Minimum bet for VIP Casino is ${MIN_BET.toLocaleString()}` };
        if (amount > MAX_BET) return { success: false, message: `Maximum bet for VIP Casino is ${MAX_BET.toLocaleString()}` };
        if (amount > user.cash) return { success: false, message: 'Insufficient cash' };
        
        // VIP Casino has better odds
        const winChance = 40 + (vipBenefits.vipLevel * 3); // 46% to 55%
        const random = Math.random() * 100;
        const isWin = random <= winChance;
        
        const multiplier = 2 + (vipBenefits.vipLevel * 0.5); // 2.5x to 4.5x
        const winAmount = Math.floor(amount * multiplier);
        
        if (isWin) {
            user.cash += winAmount;
            user.totalEarned += winAmount;
            user.gambleWins += 1;
            user.totalVipBenefits += (winAmount - amount);
            await user.save();
            
            return {
                success: true,
                win: true,
                message: `🎰 **VIP CASINO JACKPOT!** 🎰\n\n` +
                        `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                        `📈 Multiplier: ${multiplier.toFixed(1)}x\n` +
                        `💰 Won: ${winAmount.toLocaleString()} টাকা\n` +
                        `✨ Profit: ${(winAmount - amount).toLocaleString()} টাকা\n` +
                        `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n\n` +
                        `🌟 Exclusive VIP Casino Win Chance: ${winChance}%`,
                amountWon: winAmount
            };
        } else {
            user.cash -= amount;
            user.totalSpent += amount;
            user.gambleLosses += 1;
            await user.save();
            
            return {
                success: true,
                win: false,
                message: `🎰 **VIP CASINO** 🎰\n\n` +
                        `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                        `💸 Lost: ${amount.toLocaleString()} টাকা\n` +
                        `💵 New Cash: ${user.cash.toLocaleString()} টাকা\n\n` +
                        `🌟 VIP Casino Win Chance: ${winChance}%\n` +
                        `💡 Try again, high risk high reward!`,
                amountLost: amount
            };
        }
    }
}

module.exports = EconomySystem;
