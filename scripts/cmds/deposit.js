const economy = require('../economy');

module.exports = {
  config: {
    name: "deposit",
    aliases: ["জমা", "ডিপোজিট"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Deposit money to bank" },
    longDescription: { en: "Deposit your cash to bank account" },
    category: "economy",
    guide: { en: "{pn} [amount]" }
  },
  onStart: async function ({ message, event, args }) {
    const amount = parseInt(args[0]);
    if (!amount) return message.reply("❌ Amount required! Example: !deposit 1000");
    
    const result = economy.removeMoney(event.senderID, amount, 'cash', 'Deposit to bank');
    if (!result.success) return message.reply(result.message);
    
    economy.addMoney(event.senderID, amount, 'bank', 'Deposited from cash');
    
    await message.reply(`✅ Deposited ${amount.toLocaleString()} টাকা to bank!\n💵 Cash: ${result.cash.toLocaleString()}\n🏦 Bank: ${(result.bank + amount).toLocaleString()}`);
  }
};
