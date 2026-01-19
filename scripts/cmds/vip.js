module.exports = {
  config: {
    name: "vip",
    aliases: ["ভিআইপি"],
    version: "2.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "VIP membership system"
    },
    longDescription: {
      en: "Purchase and manage VIP membership for extra benefits"
    },
    category: "economy",
    guide: {
      en: "{pn} buy\n{pn} status\n{pn} daily\n{pn} plans\n{pn} leaderboard"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const action = args[0]?.toLowerCase() || 'plans';
    const userName = await usersData.getName(event.senderID);
    
    switch (action) {
      case 'buy':
      case 'purchase':
        const level = parseInt(args[1]);
        
        if (!level || level < 1 || level > 5) {
          return message.reply(`💎 **VIP PURCHASE** 💎\n\n` +
                              `Select VIP level (1-5):\n\n` +
                              `1. 🟤 Bronze VIP - 5,000,000 টাকা (7 days)\n` +
                              `2. ⚪ Silver VIP - 15,000,000 টাকা (15 days)\n` +
                              `3. 🟡 Gold VIP - 30,000,000 টাকা (30 days)\n` +
                              `4. 🔷 Diamond VIP - 50,000,000 টাকা (30 days)\n` +
                              `5. 👑 Royal VIP - 100,000,000 টাকা (30 days)\n\n` +
                              `📝 Usage: !vip buy [level]\n` +
                              `Example: !vip buy 3`);
        }
        
        // এখানে ইকোনমি সিস্টেম থেকে purchaseVip কল করুন
        // const result = await economy.purchaseVip(event.senderID, level);
        
        const vipPlans = {
          1: { name: "Bronze VIP", price: 5000000, duration: 7, color: "🟤" },
          2: { name: "Silver VIP", price: 15000000, duration: 15, color: "⚪" },
          3: { name: "Gold VIP", price: 30000000, duration: 30, color: "🟡" },
          4: { name: "Diamond VIP", price: 50000000, duration: 30, color: "🔷" },
          5: { name: "Royal VIP", price: 100000000, duration: 30, color: "👑" }
        };
        
        const plan = vipPlans[level];
        const response = `🎉 **Congratulations ${userName}!** 🎉\n\n` +
                        `✅ Successfully purchased **${plan.name}**!\n` +
                        `💰 Price: ${plan.price.toLocaleString()} টাকা\n` +
                        `📅 Duration: ${plan.duration} days\n\n` +
                        `✨ **VIP Benefits Activated:**\n` +
                        `• Daily Cash Bonus\n` +
                        `• Higher Gambling Win Chance\n` +
                        `• Transfer Bonuses\n` +
                        `• Special VIP Commands\n\n` +
                        `💎 Use !vip daily to claim your bonus`;
        
        await message.reply(response);
        break;
        
      case 'status':
      case 'info':
        // এখানে ইকোনমি সিস্টেম থেকে checkVipStatus কল করুন
        // const status = await economy.checkVipStatus(event.senderID);
        
        const vipStatus = Math.random() > 0.5;
        
        if (vipStatus) {
          const vipLevels = ["Bronze", "Silver", "Gold", "Diamond", "Royal"];
          const level = Math.floor(Math.random() * 5) + 1;
          const daysLeft = Math.floor(Math.random() * 30) + 1;
          
          await message.reply(`🌟 **VIP STATUS** 🌟\n\n` +
                            `👤 User: ${userName}\n` +
                            `✨ Level: ${vipLevels[level-1]} VIP\n` +
                            `💰 Daily Bonus: ${(level * 50000).toLocaleString()} টাকা\n` +
                            `🎰 Gambling Bonus: +${(level * 5)}% win chance\n` +
                            `📅 Expires in: ${daysLeft} days\n\n` +
                            `💎 Total Benefits: ${(level * 1000000).toLocaleString()} টাকা`);
        } else {
          await message.reply(`❌ **You are not a VIP member!**\n\n` +
                            `✨ Purchase VIP to unlock amazing benefits!\n` +
                            `💎 Use !vip plans to see available VIP packages`);
        }
        break;
        
      case 'daily':
      case 'bonus':
        // এখানে ইকোনমি সিস্টেম থেকে claimVipDaily কল করুন
        // const daily = await economy.claimVipDaily(event.senderID);
        
        const bonusAmount = Math.floor(Math.random() * 500000) + 50000;
        await message.reply(`🎁 **VIP DAILY BONUS** 🎁\n\n` +
                          `💰 Received: ${bonusAmount.toLocaleString()} টাকা\n` +
                          `✨ Keep your VIP active to claim daily!\n\n` +
                          `⏰ Next bonus available in 24 hours\n` +
                          `💎 Use !vip status to check your VIP`);
        break;
        
      case 'plans':
      case 'packages':
        await message.reply(`💎 **VIP MEMBERSHIP PLANS** 💎\n\n` +
                          `🌟 **Exclusive Benefits for VIP Members:**\n` +
                          `✅ Daily Cash Bonus (50K - 1M টাকা)\n` +
                          `✅ Higher Gambling Win Chance (+5% to +25%)\n` +
                          `✅ Transfer Bonuses (+2% to +15% extra)\n` +
                          `✅ Special VIP Commands\n` +
                          `✅ VIP Casino Access\n` +
                          `✅ Double Daily Bonus (Gold+)\n\n` +
                          
                          `📊 **Available Plans:**\n\n` +
                          `1. 🟤 **Bronze VIP**\n` +
                          `   • Price: 5,000,000 টাকা\n` +
                          `   • Duration: 7 days\n` +
                          `   • Daily: 50,000 টাকা\n` +
                          `   • Gamble: +5% win chance\n\n` +
                          
                          `2. ⚪ **Silver VIP**\n` +
                          `   • Price: 15,000,000 টাকা\n` +
                          `   • Duration: 15 days\n` +
                          `   • Daily: 150,000 টাকা\n` +
                          `   • Gamble: +10% win chance\n` +
                          `   • VIP Casino Access\n\n` +
                          
                          `3. 🟡 **Gold VIP**\n` +
                          `   • Price: 30,000,000 টাকা\n` +
                          `   • Duration: 30 days\n` +
                          `   • Daily: 300,000 টাকা\n` +
                          `   • Gamble: +15% win chance\n` +
                          `   • Double Daily Bonus\n\n` +
                          
                          `4. 🔷 **Diamond VIP**\n` +
                          `   • Price: 50,000,000 টাকা\n` +
                          `   • Duration: 30 days\n` +
                          `   • Daily: 500,000 টাকা\n` +
                          `   • Gamble: +20% win chance\n\n` +
                          
                          `5. 👑 **Royal VIP**\n` +
                          `   • Price: 100,000,000 টাকা\n` +
                          `   • Duration: 30 days\n` +
                          `   • Daily: 1,000,000 টাকা\n` +
                          `   • Gamble: +25% win chance\n\n` +
                          
                          `📝 **Purchase:** !vip buy [level]\n` +
                          `📊 **Check Status:** !vip status\n` +
                          `🎁 **Claim Daily:** !vip daily`);
        break;
        
      case 'leaderboard':
      case 'top':
        // এখানে ইকোনমি সিস্টেম থেকে getVipLeaderboard কল করুন
        // const vipTop = await economy.getVipLeaderboard(10);
        
        const vipLeaders = [
          { username: "RAFI", level: 5, color: "👑", benefits: 5000000 },
          { username: "VIP_User1", level: 4, color: "🔷", benefits: 3000000 },
          { username: "VIP_User2", level: 3, color: "🟡", benefits: 2000000 },
          { username: "VIP_User3", level: 3, color: "🟡", benefits: 1500000 },
          { username: "VIP_User4", level: 2, color: "⚪", benefits: 1000000 },
          { username: "VIP_User5", level: 2, color: "⚪", benefits: 800000 },
          { username: "VIP_User6", level: 1, color: "🟤", benefits: 500000 },
          { username: "VIP_User7", level: 1, color: "🟤", benefits: 400000 },
          { username: "VIP_User8", level: 1, color: "🟤", benefits: 300000 },
          { username: "VIP_User9", level: 1, color: "🟤", benefits: 200000 }
        ];
        
        let response = `🏆 **TOP VIP MEMBERS** 🏆\n\n`;
        
        vipLeaders.forEach((user, index) => {
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔸";
          const levels = ["", "Bronze", "Silver", "Gold", "Diamond", "Royal"];
          response += `${medal} ${index + 1}. ${user.username}\n`;
          response += `   ${user.color} ${levels[user.level]} VIP\n`;
          response += `   💰 Benefits: ${user.benefits.toLocaleString()} টাকা\n`;
        });
        
        response += `\n💎 Become a VIP: !vip plans`;
        await message.reply(response);
        break;
        
      case 'casino':
        const amount = parseInt(args[1]);
        if (!amount || isNaN(amount)) {
          return message.reply(`🎰 **VIP CASINO** 🎰\n\n` +
                              `🎯 Exclusive high-stakes gambling for VIP members!\n` +
                              `✨ Better odds than regular gambling\n` +
                              `💰 Higher multipliers (2.5x - 4.5x)\n\n` +
                              `📝 Usage: !vip casino [amount]\n` +
                              `Example: !vip casino 100000\n\n` +
                              `🔒 Requires: Silver VIP or higher\n` +
                              `💎 Check: !vip status`);
        }
        
        await message.reply(`🎰 **VIP CASINO** 🎰\n\n` +
                          `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                          `🎯 Playing VIP Casino...\n\n` +
                          `✨ Exclusive for VIP members only!`);
        break;
        
      case 'double':
        await message.reply(`🎁 **VIP DOUBLE DAILY** 🎁\n\n` +
                          `✨ Get double your daily bonus!\n` +
                          `💰 Regular bonus × 2\n\n` +
                          `🔒 Requires: Gold VIP or higher\n` +
                          `⏰ Available once daily\n\n` +
                          `💎 Use: !vip double\n` +
                          `📊 Check: !vip status`);
        break;
        
      default:
        await message.reply(`💎 **VIP SYSTEM** 💎\n\n` +
                          `✨ Exclusive benefits for premium members!\n\n` +
                          `📚 **Available Commands:**\n` +
                          `• !vip plans - View VIP packages\n` +
                          `• !vip buy [level] - Purchase VIP\n` +
                          `• !vip status - Check your VIP status\n` +
                          `• !vip daily - Claim daily bonus\n` +
                          `• !vip leaderboard - Top VIP members\n` +
                          `• !vip casino [amount] - VIP Casino\n` +
                          `• !vip double - Double daily (Gold+)\n\n` +
                          `🌟 **VIP Benefits:**\n` +
                          `✅ Daily Cash Bonus\n` +
                          `✅ Higher Win Chance\n` +
                          `✅ Transfer Bonuses\n` +
                          `✅ Special Commands\n` +
                          `✅ VIP Casino Access`);
    }
  }
};
