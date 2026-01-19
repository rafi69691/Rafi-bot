module.exports = {
  config: {
    name: "withdraw",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Withdraw money from bank"
    },
    longDescription: {
      en: "Withdraw money from your bank account to cash"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const amount = parseInt(args[0]);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply("❌ Please enter a valid amount to withdraw.\nExample: !withdraw 300");
    }
    
    // এখানে ডাটাবেস লজিক যোগ করুন
    // Check if user has enough bank balance
    // Withdraw to cash
    
    const response = `✅ Successfully withdrawn ${amount} $ from your bank!\n` +
                    `💵 Cash: +${amount} $\n` +
                    `🏦 Bank: -${amount} $`;
    
    await message.reply(response);
  }
};
