// scripts/cmds/vip.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "vip",
    aliases: ["ভিআইপি", "প্রিমিয়াম", "ভিপি"],
    version: "4.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "VIP membership with real balance system"
    },
    longDescription: {
      en: "Purchase VIP using your balance and get instant benefits"
    },
    category: "economy",
    guide: {
      en: "{pn} buy [level]\n{pn} status\n{pn} daily\n{pn} plans"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const userName = await usersData.getName(senderID);
    const action = args[0]?.toLowerCase() || 'plans';
    
    if (action === 'buy' || action === 'purchase') {
      const level = parseInt(args[1]);
      
      if (!level || level < 1 || level > 5) {
        return message.reply(`❌ Invalid VIP level! Choose 1-5\n📋 Use !vip plans to see all`);
      }
      
      // ✅ রিয়েল-টাইম VIP কেনা
      const result = economy.buyVip(senderID, level);
      
      if (!result.success) {
        return message.reply(`❌ ${result.message}\n💰 Check balance: !balance`);
      }
      
      const userData = result.user;
      const plan = result.plan;
      
      const purchaseMsg = `🎉 **VIP PURCHASE SUCCESSFUL!** 🎉\n\n` +
                         `👤 User: ${userName}\n` +
                         `✨ Level: ${plan.name}\n` +
                         `💰 Price: ${plan.price.toLocaleString()} টাকা\n` +
                         `📅 Duration: 30 days\n\n` +
                         
                         `💰 **New Balance:**\n` +
                         `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                         `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                         `📊 Total: ${userData.total.toLocaleString()} টাকা\n\n` +
                         
                         `✨ **VIP Benefits Activated:**\n` +
                         `✅ Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                         `✅ +${level * 5}% Gambling Win Chance\n` +
                         `✅ +${level}% Transfer Bonus\n` +
                         `✅ Exclusive VIP Games\n\n` +
                         
                         `💎 **Commands Unlocked:**\n` +
                         `• !vip daily - Claim ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                         `• VIP Casino Games\n` +
                         `• VIP Shop Access\n\n` +
                         
                         `📊 Check status: !vip status\n` +
                         `💰 Balance: !balance`;
      
      await message.reply(purchaseMsg);
      
    } else if (action === 'daily') {
      // ✅ রিয়েল-টাইম VIP ডেইলি
      const result = economy.claimVipDaily(senderID);
      
      if (!result.success) {
        return message.reply(`❌ ${result.message}`);
      }
      
      const userData = result.user;
      const bonus = result.bonus;
      
      const dailyMsg = `🎁 **VIP DAILY BONUS CLAIMED!** 🎁\n\n` +
                      `👤 User: ${userName}\n` +
                      `💰 **Bonus Received:** ${bonus.toLocaleString()} টাকা\n\n` +
                      
                      `💰 **New Balance:**\n` +
                      `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                      `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                      `📊 Total: ${userData.total.toLocaleString()} টাকা\n\n` +
                      
                      `📅 **Next Bonus:** 24 hours\n` +
                      `📊 VIP Status: !vip status\n` +
                      `🎮 Play games: !gamble`;
      
      await message.reply(dailyMsg);
      
    } else if (action === 'status') {
      const userData = economy.getUser(senderID);
      
      let statusMsg = `🌟 **VIP STATUS** 🌟\n\n` +
                     `👤 User: ${userName}\n`;
      
      if (userData.isVip && userData.vipLevel > 0) {
        const plan = economy.vipPlans[userData.vipLevel];
        const daysLeft = userData.vipExpires ? 
          Math.ceil((userData.vipExpires - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
        
        statusMsg += `✨ Level: ${plan.name}\n` +
                    `💰 Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                    `🎰 Gambling Bonus: +${userData.vipLevel * 5}%\n` +
                    `💸 Transfer Bonus: +${userData.vipLevel}%\n` +
                    `📅 Days Left: ${daysLeft}\n\n` +
                    
                    `💰 **Your Balance:**\n` +
                    `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                    `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                    `📊 Total: ${userData.total.toLocaleString()} টাকা`;
      } else {
        statusMsg += `❌ **NO VIP MEMBERSHIP**\n\n` +
                    `💎 **Benefits You're Missing:**\n` +
                    `✅ Daily Cash Bonuses\n` +
                    `✅ Higher Gambling Wins\n` +
                    `✅ Transfer Bonuses\n` +
                    `✅ Exclusive Games\n\n` +
                    
                    `💰 **Your Balance:** ${userData.total.toLocaleString()} টাকা\n` +
                    `📋 View plans: !vip plans`;
      }
      
      await message.reply(statusMsg);
      
    } else if (action === 'plans') {
      let plansMsg = `💎 **VIP MEMBERSHIP PLANS** 💎\n\n`;
      plansMsg += `✨ **EXCLUSIVE VIP BENEFITS:**\n`;
      plansMsg += `✅ Daily Cash Bonuses\n`;
      plansMsg += `✅ Higher Gambling Win Chance\n`;
      plansMsg += `✅ Transfer Cash Bonuses\n`;
      plansMsg += `✅ Special VIP Commands\n\n`;
      
      plansMsg += `📊 **AVAILABLE PLANS:**\n\n`;
      
      for (let i = 1; i <= 5; i++) {
        const plan = economy.vipPlans[i];
        plansMsg += `${i}. **${plan.name}**\n`;
        plansMsg += `   💰 Price: ${plan.price.toLocaleString()} টাকা\n`;
        plansMsg += `   🎁 Daily: ${plan.dailyBonus.toLocaleString()} টাকা\n`;
        plansMsg += `   🎰 Gambling: +${i * 5}% win chance\n`;
        plansMsg += `   💸 Transfer: +${i}% bonus\n\n`;
      }
      
      plansMsg += `⚠️ **IMPORTANT:**\n`;
      plansMsg += `• Must have enough money in balance\n`;
      plansMsg += `• Check balance: !balance\n`;
      plansMsg += `• VIP cannot be transferred\n\n`;
      
      plansMsg += `📝 **PURCHASE:** !vip buy [1-5]\n`;
      plansMsg += `📊 **CHECK STATUS:** !vip status\n`;
      plansMsg += `💰 **BALANCE:** !balance`;
      
      await message.reply(plansMsg);
      
    } else {
      await message.reply(`💎 **VIP SYSTEM** 💎\n\n` +
                         `✨ Premium membership with real money!\n\n` +
                         `📚 **COMMANDS:**\n` +
                         `• !vip plans - View VIP packages & prices\n` +
                         `• !vip buy [1-5] - Purchase VIP\n` +
                         `• !vip status - Check your VIP status\n` +
                         `• !vip daily - Claim daily bonus\n\n` +
                         
                         `💰 **REQUIREMENT:** Must have enough balance!\n` +
                         `💵 Check: !balance`);
    }
  }
};
