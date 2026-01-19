module.exports = {
  config: {
    name: "deposit",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Deposit money to bank"
    },
    longDescription: {
      en: "Deposit your cash to bank account"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const amount = parseInt(args[0]);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply("❌ Please enter a valid amount to deposit.\nExample: !deposit 500");
    }
    
    // এখানে ডাটাবেস লজিক যোগ করুন
    // Check if user has enough cash
    // Deposit to bank
    
    const response = `✅ Successfully deposited ${amount} $ to your bank!\n` +
                    `💵 Cash: -${amount} $\n` +
                    `🏦 Bank: +${amount} $`;
    
    await message.reply(response);
  }
};
