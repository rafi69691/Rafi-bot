module.exports = {
  config: {
    name: "bank",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View your bank account details"
    },
    longDescription: {
      en: "Check your bank balance and transaction history"
    },
    category: "economy",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const userName = await usersData.getName(event.senderID);
    
    // এখানে ডাটাবেস থেকে ব্যাংক ডাটা লোড করুন
    const bankBalance = 1500;
    const cashBalance = 500;
    const total = bankBalance + cashBalance;
    
    const response = `🏦 **${userName}'s Bank Account** 🏦\n\n` +
                    `💰 Bank Balance: ${bankBalance} $\n` +
                    `💵 Cash Balance: ${cashBalance} $\n` +
                    `💳 Total Assets: ${total} $\n\n` +
                    `📊 Account Status: ACTIVE\n` +
                    `⭐ Interest Rate: 5% monthly`;
    
    await message.reply(response);
  }
};
