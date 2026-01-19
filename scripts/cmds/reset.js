// scripts/cmds/reset.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "reset",
    aliases: ["রিসেট", "রিস্টার্ট"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 2, // শুধু অ্যাডমিনদের জন্য
    shortDescription: {
      en: "Reset economy system"
    },
    longDescription: {
      en: "Reset all users' money, VIP, and transactions (Admin only)"
    },
    category: "economy",
    guide: {
      en: "{pn} [type]\nTypes: all, money, vip"
    }
  },

  onStart: async function ({ message, event, args }) {
    const type = args[0]?.toLowerCase() || 'all';
    const adminId = event.senderID;
    
    // ✅ ইকোনমি রিসেট
    const result = economy.resetEconomy(type, adminId);
    
    if (!result.success) {
      return message.reply(`❌ ${result.message}`);
    }
    
    await message.reply(`🔄 **ECONOMY RESET COMPLETE** 🔄\n\n` +
                       `${result.message}\n\n` +
                       `📊 **Reset Type:** ${type.toUpperCase()}\n` +
                       `👑 **Admin:** System Admin\n` +
                       `⏰ **Time:** ${new Date().toLocaleString()}\n\n` +
                       `💡 **Note:** All users affected\n` +
                       `💰 Check: !balance`);
  }
};
