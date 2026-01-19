const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "balance",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Check your economy balance"
    },
    longDescription: {
      en: "Check your cash and bank balance"
    },
    category: "economy",
    guide: {
      en: "{pn} or {pn} [@user]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const { senderID, threadID } = event;
      const targetID = args[0] ? args[0].replace(/@/g, "") : senderID;
      
      // এখানে আপনার ডাটাবেস থেকে ব্যালেন্স লোড করুন
      // উদাহরণ:
      // const userData = await usersData.get(targetID);
      // const cash = userData.money || 0;
      // const bank = userData.bank || 0;
      
      // Temporary data (আপনার ডাটাবেস অনুযায়ী পরিবর্তন করুন)
      const cash = 1000;
      const bank = 500;
      const total = cash + bank;
      
      const userName = await usersData.getName(targetID);
      
      const response = `💰 **${userName}'s Balance** 💰\n\n` +
                      `💵 Cash: ${cash} $\n` +
                      `🏦 Bank: ${bank} $\n` +
                      `📊 Total: ${total} $\n\n` +
                      `💡 Use: !deposit, !withdraw, !transfer`;
      
      await message.reply(response);
    } catch (error) {
      console.error(error);
      await message.reply("❌ Error checking balance. Please try again.");
    }
  }
};
