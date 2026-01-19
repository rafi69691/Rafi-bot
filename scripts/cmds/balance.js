// scripts/cmds/balance.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "তহবিল", "ব্যালেন্স", "টাকা"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Check your economy balance"
    },
    longDescription: {
      en: "Check your cash, bank balance and VIP status"
    },
    category: "economy",
    guide: {
      en: "{pn} or {pn} [@user]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const { senderID } = event;
      let targetID = senderID;
      
      if (args[0] && args[0].startsWith('@')) {
        targetID = args[0].replace('@', '').replace('<', '').replace('>', '');
      }
      
      const userName = await usersData.getName(targetID);
      
      // ✅ রিয়েল ডাটা লোড
      const balanceData = economy.checkBalance(targetID);
      
      // VIP ইনফো
      const vipLevels = {
        0: { name: "No VIP", color: "⚪", icon: "" },
        1: { name: "Bronze VIP", color: "🟤", icon: "🟤" },
        2: { name: "Silver VIP", color: "⚪", icon: "⚪" },
        3: { name: "Gold VIP", color: "🟡", icon: "🟡" },
        4: { name: "Diamond VIP", color: "🔷", icon: "🔷" },
        5: { name: "Royal VIP", color: "👑", icon: "👑" }
      };
      
      const vipInfo = vipLevels[balanceData.vipLevel] || vipLevels[0];
      
      const response = `💰 **${balanceData.username}'s Balance** 💰\n\n` +
                      `💵 **Cash:** ${balanceData.cash.toLocaleString()} টাকা\n` +
                      `🏦 **Bank:** ${balanceData.bank.toLocaleString()} টাকা\n` +
                      `📊 **Total:** ${balanceData.total.toLocaleString()} টাকা\n\n` +
                      
                      `${vipInfo.icon} **VIP Status:** ${vipInfo.name}\n` +
                      (balanceData.isVip ? 
                       `✨ Daily Bonus Available\n` : 
                       `💎 Use !vip plans to upgrade\n`) +
                      `\n💡 **Commands:**\n` +
                      `• !deposit [amount] - ব্যাংকে জমা\n` +
                      `• !withdraw [amount] - ব্যাংক থেকে তুলুন\n` +
                      `• !transfer [amount] [@user] - পাঠান\n` +
                      `• !gamble - টাকা বাজি করুন`;
      
      await message.reply(response);
      
    } catch (error) {
      console.error("Balance error:", error);
      await message.reply("❌ Error checking balance. Please try again.");
    }
  }
};
