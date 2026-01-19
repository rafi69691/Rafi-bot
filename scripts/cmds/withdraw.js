const economy = require('../economy');

module.exports = {
  config: {
    name: "withdraw",
    aliases: ["তোলা", "উইথড্র"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Withdraw money from bank" },
    longDescription: { en: "Withdraw money from bank to cash" },
    category: "economy",
    guide: { en: "{pn} [amount]" }
  },
  onStart: async function ({ message, event, args }) {
    const amount = parseInt(args[0]);
    if (!amount) return message.reply("❌ Amount required! Example: !withdraw 1000");
    
    const result = economy.removeMoney(event.senderID, amount, 'bank', 'Withdraw from bank');
    if (!result.success) return message.reply(result.message);
    
    economy.addMoney(event.senderID, amount, 'cash', 'Withdrew from bank');
    
    await message.reply(`✅ Withdrew ${amount.toLocaleString()} টাকা from bank!\n💵 Cash: ${(result.cash + amount).toLocaleString()}\n🏦 Bank: ${result.bank.toLocaleString()}`);
  }
};
