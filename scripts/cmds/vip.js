// scripts/cmds/vip.js
module.exports = {
  config: {
    name: "vip",
    aliases: ["ভিআইপি", "প্রিমিয়াম"],
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
      en: "{pn} buy [level]\n{pn} status\n{pn} daily\n{pn} plans\n{pn} leaderboard\n{pn} casino [amount]\n{pn} double"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const action = args[0]?.toLowerCase() || 'plans';
    const userName = await usersData.getName(event.senderID);
    
    const vipPlans = {
      1: { 
        name: "Bronze VIP", 
        price: 5000000, 
        duration: 7, 
        color: "🟤",
        dailyBonus: 50000,
        gambleBonus: 5,
        transferBonus: 2
      },
      2: { 
        name: "Silver VIP", 
        price: 15000000, 
        duration: 15, 
        color: "⚪",
        dailyBonus: 150000,
        gambleBonus: 10,
        transferBonus: 5
      },
      3: { 
        name: "Gold VIP", 
        price: 30000000, 
        duration: 30, 
        color: "🟡",
        dailyBonus: 300000,
        gambleBonus: 15,
        transferBonus: 8
      },
      4: { 
        name: "Diamond VIP", 
        price: 50000000, 
        duration: 30, 
        color: "🔷",
        dailyBonus: 500000,
        gambleBonus: 20,
        transferBonus: 12
      },
      5: { 
        name: "Royal VIP", 
        price: 100000000, 
        duration: 30, 
        color: "👑",
        dailyBonus: 1000000,
        gambleBonus: 25,
        transferBonus: 15
      }
    };
    
    switch (action) {
      case 'buy':
      case 'purchase':
        const level = parseInt(args[1]);
        
        if (!level || level < 1 || level > 5) {
          let plansList = `💎 **VIP PURCHASE** 💎\n\n`;
          plansList += `Select VIP level (1-5):\n\n`;
          
          for (let i = 1; i <= 5; i++) {
            const plan = vipPlans[i];
            plansList += `${i}. ${plan.color} ${plan.name}\n`;
            plansList += `   💰 Price: ${plan.price.toLocaleString()} টাকা\n`;
            plansList += `   📅 Duration: ${plan.duration} days\n`;
            plansList += `   🎁 Daily: ${plan.dailyBonus.toLocaleString()} টাকা\n\n`;
          }
          
          plansList += `📝 Usage: !vip buy [level]\n`;
          plansList += `Example: !vip buy 3`;
          
          return message.reply(plansList);
        }
        
        const plan = vipPlans[level];
        
        // এখানে আপনার ইকোনমি সিস্টেম থেকে purchaseVip কল করুন
        // প্রথমে চেক করুন ইউজারের যথেষ্ট টাকা আছে কিনা
        // তারপর VIP অ্যাক্টিভেট করুন
        
        const purchaseMsg = `🎉 **Congratulations ${userName}!** 🎉\n\n` +
                          `✅ Successfully purchased **${plan.name}**!\n` +
                          `💰 Price: ${plan.price.toLocaleString()} টাকা\n` +
                          `📅 Duration: ${plan.duration} days\n\n` +
                          `✨ **VIP Benefits Activated:**\n` +
                          `• Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                          `• Gambling Bonus: +${plan.gambleBonus}% win chance\n` +
                          `• Transfer Bonus: +${plan.transferBonus}% extra cash\n` +
                          `• Special VIP Commands\n\n` +
                          `💎 Use !vip daily to claim your bonus\n` +
                          `📊 Check !vip status`;
        
        await message.reply(purchaseMsg);
        break;
        
      case 'status':
      case 'info':
        // এখানে ইকোনমি সিস্টেম থেকে VIP স্ট্যাটাস চেক করুন
        // const vipData = await economy.getVipStatus(event.senderID);
        
        // Temporary VIP status (ডেমো উদ্দেশ্যে)
        const hasVip = Math.random() > 0.5;
        
        if (hasVip) {
          const randomLevel = Math.floor(Math.random() * 5) + 1;
          const plan = vipPlans[randomLevel];
          const daysLeft = Math.floor(Math.random() * 30) + 1;
          
          const statusMsg = `🌟 **VIP STATUS** 🌟\n\n` +
                           `👤 User: ${userName}\n` +
                           `✨ Level: ${plan.color} ${plan.name}\n` +
                           `💰 Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                           `🎰 Gambling Bonus: +${plan.gambleBonus}% win chance\n` +
                           `💸 Transfer Bonus: +${plan.transferBonus}% extra cash\n` +
                           `📅 Expires in: ${daysLeft} days\n\n` +
                           `🎮 Available Commands:\n` +
                           `• !vip daily - Claim daily bonus\n` +
                           `• !vip casino - VIP Casino\n` +
                           `• !vip double - Double daily (Gold+)\n` +
                           `• !vipshop - VIP Shop`;
          
          await message.reply(statusMsg);
        } else {
          await message.reply(`❌ **You are not a VIP member!**\n\n` +
                            `✨ Purchase VIP to unlock amazing benefits!\n` +
                            `💎 Use !vip plans to see available packages\n` +
                            `💰 Starting from 5,000,000 টাকা`);
        }
        break;
        
      case 'daily':
      case 'bonus':
        // এখানে ইকোনমি সিস্টেম থেকে claimVipDaily কল করুন
        // প্রথমে চেক করুন ইউজার VIP কিনা
        // তারপর ডেইলি বোনাস দিন
        
        const bonusAmount = 50000 + Math.floor(Math.random() * 950000);
        const dailyMsg = `🎁 **VIP DAILY BONUS** 🎁\n\n` +
                        `👤 User: ${userName}\n` +
                        `💰 Received: ${bonusAmount.toLocaleString()} টাকা\n` +
                        `✨ Keep your VIP active to claim daily!\n\n` +
                        `⏰ Next bonus available in 24 hours\n` +
                        `💎 Check !vip status for more info`;
        
        await message.reply(dailyMsg);
        break;
        
      case 'plans':
      case 'packages':
        let plansMsg = `💎 **VIP MEMBERSHIP PLANS** 💎\n\n`;
        plansMsg += `🌟 **Exclusive Benefits for VIP Members:**\n`;
        plansMsg += `✅ Daily Cash Bonus (50K - 1M টাকা)\n`;
        plansMsg += `✅ Higher Gambling Win Chance (+5% to +25%)\n`;
        plansMsg += `✅ Transfer Bonuses (+2% to +15% extra)\n`;
        plansMsg += `✅ Special VIP Commands\n`;
        plansMsg += `✅ VIP Casino Access\n`;
        plansMsg += `✅ Double Daily Bonus (Gold+)\n`;
        plansMsg += `✅ Exclusive VIP Shop\n\n`;
        
        plansMsg += `📊 **Available Plans:**\n\n`;
        
        for (let i = 1; i <= 5; i++) {
          const plan = vipPlans[i];
          plansMsg += `${i}. ${plan.color} **${plan.name}**\n`;
          plansMsg += `   • Price: ${plan.price.toLocaleString()} টাকা\n`;
          plansMsg += `   • Duration: ${plan.duration} days\n`;
          plansMsg += `   • Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n`;
          plansMsg += `   • Gambling: +${plan.gambleBonus}% win chance\n`;
          plansMsg += `   • Transfer: +${plan.transferBonus}% extra\n\n`;
        }
        
        plansMsg += `📝 **Purchase:** !vip buy [level]\n`;
        plansMsg += `📊 **Check Status:** !vip status\n`;
        plansMsg += `🎁 **Claim Daily:** !vip daily\n`;
        plansMsg += `🎰 **VIP Casino:** !vip casino [amount]\n`;
        plansMsg += `🛍️ **VIP Shop:** !vipshop`;
        
        await message.reply(plansMsg);
        break;
        
      case 'leaderboard':
      case 'top':
        // এখানে ইকোনমি সিস্টেম থেকে VIP লিডারবোর্ড ডাটা আনুন
        
        const vipLeaders = [
          { name: "RAFI", level: 5, color: "👑", benefits: 5000000 },
          { name: "VIP_User1", level: 4, color: "🔷", benefits: 3000000 },
          { name: "VIP_User2", level: 3, color: "🟡", benefits: 2000000 },
          { name: "VIP_User3", level: 3, color: "🟡", benefits: 1500000 },
          { name: "VIP_User4", level: 2, color: "⚪", benefits: 1000000 },
          { name: "VIP_User5", level: 2, color: "⚪", benefits: 800000 },
          { name: "VIP_User6", level: 1, color: "🟤", benefits: 500000 },
          { name: "VIP_User7", level: 1, color: "🟤", benefits: 400000 },
          { name: "VIP_User8", level: 1, color: "🟤", benefits: 300000 },
          { name: "VIP_User9", level: 1, color: "🟤", benefits: 200000 }
        ];
        
        let leaderboardMsg = `🏆 **TOP VIP MEMBERS** 🏆\n\n`;
        
        vipLeaders.forEach((user, index) => {
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔸";
          const levels = ["", "Bronze", "Silver", "Gold", "Diamond", "Royal"];
          leaderboardMsg += `${medal} ${index + 1}. ${user.name}\n`;
          leaderboardMsg += `   ${user.color} ${levels[user.level]} VIP\n`;
          leaderboardMsg += `   💰 Total Benefits: ${user.benefits.toLocaleString()} টাকা\n`;
        });
        
        leaderboardMsg += `\n💎 Become a VIP: !vip buy [level]\n`;
        leaderboardMsg += `📊 Check VIP plans: !vip plans`;
        
        await message.reply(leaderboardMsg);
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
        
        // VIP ক্যাসিনো লজিক ইমপ্লিমেন্ট করুন
        const win = Math.random() > 0.5;
        const casinoMsg = win ? 
          `🎰 **VIP CASINO - JACKPOT!** 🎰\n\n💰 Bet: ${amount.toLocaleString()} টাকা\n✨ Won: ${(amount * 3).toLocaleString()} টাকা\n🎯 Exclusive VIP game!` :
          `🎰 **VIP CASINO** 🎰\n\n💰 Bet: ${amount.toLocaleString()} টাকা\n💸 Lost: ${amount.toLocaleString()} টাকা\n🎯 Better luck next time!`;
        
        await message.reply(casinoMsg);
        break;
        
      case 'double':
        // ডাবল ডেইলি বোনাস (শুধুমাত্র Gold+ VIP)
        await message.reply(`🎁 **VIP DOUBLE DAILY** 🎁\n\n` +
                          `✨ Get double your daily bonus!\n` +
                          `💰 Regular bonus × 2\n\n` +
                          `🔒 Requires: Gold VIP or higher\n` +
                          `⏰ Available once daily\n\n` +
                          `💎 Check your VIP level: !vip status\n` +
                          `📊 VIP plans: !vip plans`);
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
                          `🛍️ **VIP Shop:** !vipshop\n\n` +
                          `🌟 **VIP Benefits:**\n` +
                          `✅ Daily Cash Bonus\n` +
                          `✅ Higher Win Chance in Gambling\n` +
                          `✅ Transfer Bonuses\n` +
                          `✅ Special VIP Commands\n` +
                          `✅ VIP Casino Access`);
    }
  }
};
