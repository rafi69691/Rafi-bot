// scripts/cmds/vip.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "vip",
    aliases: ["ভিআইপি", "প্রিমিয়াম", "ভিপি"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "VIP membership system"
    },
    longDescription: {
      en: "Purchase VIP membership for extra benefits"
    },
    category: "economy",
    guide: {
      en: "{pn} plans - View VIP packages\n{pn} buy [level] - Purchase VIP\n{pn} status - Check VIP status\n{pn} daily - Claim daily bonus"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const userName = await usersData.getName(senderID);
    const action = args[0]?.toLowerCase() || 'plans';
    
    if (action === 'plans') {
      const vipPlans = economy.getVipPlans();
      
      let plansMsg = `💎 **VIP MEMBERSHIP PLANS** 💎\n\n`;
      plansMsg += `✨ **Exclusive VIP Benefits:**\n`;
      plansMsg += `✅ Daily Cash Bonus\n`;
      plansMsg += `✅ Higher Gambling Win Chance\n`;
      plansMsg += `✅ Transfer Bonuses\n`;
      plansMsg += `✅ Special VIP Commands\n\n`;
      
      plansMsg += `📊 **Available Plans:**\n\n`;
      
      for (let i = 1; i <= 5; i++) {
        const plan = vipPlans[i];
        plansMsg += `${i}. ${plan.color} **${plan.name}**\n`;
        plansMsg += `   💰 Price: ${plan.price.toLocaleString()} টাকা\n`;
        plansMsg += `   🎁 Daily: ${plan.dailyBonus.toLocaleString()} টাকা\n`;
        plansMsg += `   🎰 Gambling: +${i * 5}% win chance\n`;
        plansMsg += `   💸 Transfer: +${i}% bonus\n\n`;
      }
      
      plansMsg += `📝 **Purchase:** !vip buy [1-5]\n`;
      plansMsg += `💵 **Check Balance:** !balance\n`;
      plansMsg += `⚠️ **Requires real money in balance!**`;
      
      await message.reply(plansMsg);
      
    } else if (action === 'buy') {
      const level = parseInt(args[1]);
      
      if (!level || level < 1 || level > 5) {
        return message.reply(`❌ Invalid VIP level! Choose 1-5\n📋 Use !vip plans to see all`);
      }
      
      // ✅ VIP কিনা
      const result = economy.buyVip(senderID, level);
      
      if (!result.success) {
        return message.reply(result.message);
      }
      
      await message.reply(`🎉 **VIP PURCHASE SUCCESSFUL!** 🎉\n\n` +
                         `👤 User: ${userName}\n` +
                         `✨ Level: ${result.plan.name}\n` +
                         `💰 Price: ${result.plan.price.toLocaleString()} টাকা\n` +
                         `📅 Duration: 30 days\n\n` +
                         
                         `✨ **VIP Benefits Activated:**\n` +
                         `✅ Daily Bonus: ${result.plan.dailyBonus.toLocaleString()} টাকা\n` +
                         `✅ +${level * 5}% Gambling Win Chance\n` +
                         `✅ +${level}% Transfer Bonus\n\n` +
                         
                         `💎 **Commands Unlocked:**\n` +
                         `• !vip daily - Claim ${result.plan.dailyBonus.toLocaleString()} টাকা\n` +
                         `• VIP Casino Games\n` +
                         `• VIP Shop Access\n\n` +
                         
                         `📊 Check status: !vip status\n` +
                         `💰 Balance: !balance`);
      
    } else if (action === 'daily') {
      // ✅ VIP ডেইলি বোনাস
      const result = economy.claimVipDaily(senderID);
      
      if (!result.success) {
        return message.reply(result.message);
      }
      
      await message.reply(`🎁 **VIP DAILY BONUS CLAIMED!** 🎁\n\n` +
                         `👤 User: ${userName}\n` +
                         `💰 **Bonus Received:** ${result.bonus.toLocaleString()} টাকা\n` +
                         `💵 **New Cash:** ${result.newCash.toLocaleString()} টাকা\n\n` +
                         
                         `📅 **Next Bonus:** 24 hours\n` +
                         `📊 VIP Status: !vip status\n` +
                         `🎮 Play games: !gamble`);
      
    } else if (action === 'status') {
      const userData = economy.checkBalance(senderID);
      const vipPlans = economy.getVipPlans();
      
      let statusMsg = `🌟 **VIP STATUS** 🌟\n\n` +
                     `👤 User: ${userName}\n`;
      
      if (userData.isVip && userData.vipLevel > 0) {
        const plan = vipPlans[userData.vipLevel];
        
        statusMsg += `✨ Level: ${plan.color} ${plan.name}\n` +
                    `💰 Daily Bonus: ${plan.dailyBonus.toLocaleString()} টাকা\n` +
                    `🎰 Gambling Bonus: +${userData.vipLevel * 5}%\n` +
                    `💸 Transfer Bonus: +${userData.vipLevel}%\n\n` +
                    
                    `💰 **Your Balance:**\n` +
                    `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                    `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                    `📊 Total: ${userData.total.toLocaleString()} টাকা`;
      } else {
        statusMsg += `❌ **NO VIP MEMBERSHIP**\n\n` +
                    `💎 **Benefits You're Missing:**\n` +
                    `✅ Daily Cash Bonuses\n` +
                    `✅ Higher Gambling Wins\n` +
                    `✅ Transfer Bonuses\n\n` +
                    
                    `💰 **Your Balance:** ${userData.total.toLocaleString()} টাকা\n` +
                    `📋 View plans: !vip plans`;
      }
      
      await message.reply(statusMsg);
      
    } else {
      await message.reply(`💎 **VIP SYSTEM** 💎\n\n` +
                         `✨ Premium membership with real benefits!\n\n` +
                         `📚 **Commands:**\n` +
                         `• !vip plans - View VIP packages\n` +
                         `• !vip buy [1-5] - Purchase VIP\n` +
                         `• !vip status - Check your VIP status\n` +
                         `• !vip daily - Claim daily bonus\n\n` +
                         
                         `💰 **Requires real money in balance!**\n` +
                         `💵 Check: !balance`);
    }
  }
};
