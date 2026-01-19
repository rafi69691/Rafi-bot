// scripts/cmds/balance.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "তহবিল", "ব্যালেন্স", "টাকা"],
    version: "3.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Check your real-time economy balance"
    },
    longDescription: {
      en: "Check your current cash, bank balance and VIP status with real updates"
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
      
      // ✅ রিয়েল-টাইম ডাটা লোড
      const userData = economy.getUser(targetID, userName);
      
      // VIP ইনফো
      const vipLevels = {
        0: { name: "No VIP", color: "⚪", icon: "" },
        1: { name: "Bronze VIP", color: "🟤", icon: "🟤" },
        2: { name: "Silver VIP", color: "⚪", icon: "⚪" },
        3: { name: "Gold VIP", color: "🟡", icon: "🟡" },
        4: { name: "Diamond VIP", color: "🔷", icon: "🔷" },
        5: { name: "Royal VIP", color: "👑", icon: "👑" }
      };
      
      const vipInfo = vipLevels[userData.vipLevel] || vipLevels[0];
      
      // VIP এক্সপায়ার চেক
      let vipExpiryInfo = "";
      if (userData.isVip && userData.vipExpires) {
        const daysLeft = Math.ceil((userData.vipExpires - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
          vipExpiryInfo = `⏰ Expires in: ${daysLeft} days`;
        } else {
          vipExpiryInfo = "⚠️ VIP Expired";
        }
      }
      
      const response = `💰 **${userName}'s Balance** 💰\n\n` +
                      `💵 **Cash:** ${userData.cash.toLocaleString()} টাকা\n` +
                      `🏦 **Bank:** ${userData.bank.toLocaleString()} টাকা\n` +
                      `📊 **Total:** ${userData.total.toLocaleString()} টাকা\n\n` +
                      
                      `${vipInfo.icon} **VIP Status:** ${vipInfo.name}\n` +
                      (userData.isVip ? 
                       `🎁 Daily Bonus: ${economy.vipPlans[userData.vipLevel]?.dailyBonus.toLocaleString() || 0} টাকা\n` +
                       `${vipExpiryInfo}\n` : 
                       `💎 No VIP - Use !vip plans\n`) +
                      `\n📈 **Statistics:**\n` +
                      `📥 Total Earned: ${userData.totalEarned.toLocaleString()} টাকা\n` +
                      `📤 Total Spent: ${userData.totalSpent.toLocaleString()} টাকা\n` +
                      `🎰 Gambling: ${userData.gambleWins}W/${userData.gambleLosses}L\n\n` +
                      
                      `💡 **Commands:**\n` +
                      `💰 !deposit [amount] - ব্যাংকে জমা\n` +
                      `💰 !withdraw [amount] - ব্যাংক থেকে তুলুন\n` +
                      `💰 !transfer [amount] [@user] - পাঠান\n` +
                      `🎰 !gamble - টাকা বাজি করুন\n` +
                      `📅 !daily - ডেইলি টাস্ক\n` +
                      `💼 !work - কাজ করে আয় করুন`;
      
      await message.reply(response);
      
    } catch (error) {
      console.error("Balance command error:", error);
      await message.reply("❌ ব্যালেন্স চেক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  }
};
