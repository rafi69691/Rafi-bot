module.exports = {
  config: {
    name: "transfer",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Transfer money to another user"
    },
    longDescription: {
      en: "Transfer money from your bank to another user's bank"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount] [@user]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    if (args.length < 2) {
      return message.reply("❌ Usage: !transfer [amount] [@user]\nExample: !transfer 500 @RAFI");
    }
    
    const amount = parseInt(args[0]);
    const targetID = args[1].replace(/@/g, "");
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply("❌ Please enter a valid amount.");
    }
    
    if (targetID === event.senderID) {
      return message.reply("❌ You cannot transfer money to yourself!");
    }
    
    // এখানে ডাটাবেস লজিক যোগ করুন
    // Check sender's bank balance
    // Transfer to receiver
    
    const senderName = await usersData.getName(event.senderID);
    const receiverName = await usersData.getName(targetID);
    
    const response = `✅ ${senderName} transferred ${amount} $ to ${receiverName}!\n` +
                    `🏦 Your bank: -${amount} $\n` +
                    `🏦 ${receiverName}'s bank: +${amount} $`;
    
    await message.reply(response);
  }
};
