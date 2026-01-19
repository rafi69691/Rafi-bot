// scripts/cmds/gamble.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "gamble",
    aliases: ["bet", "জুয়া", "গ্যাম্বল", "বাজি"],
    version: "4.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Gamble with real-time balance updates"
    },
    longDescription: {
      en: "Play gambling games and see instant balance updates"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount] [game]\nGames: coinflip, dice, slots, roulette"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const amount = parseInt(args[0]);
    const gameType = args[1]?.toLowerCase() || 'coinflip';
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply(`🎰 **RAFI GAMBLING** 🎰\n\n` +
                          `💰 Usage: !gamble [amount] [game]\n\n` +
                          `🎮 **Available Games:**\n` +
                          `• coinflip - 50% win chance (2x)\n` +
                          `• dice - Dice game (1-6x)\n` +
                          `• slots - Slot machine (3-100x)\n` +
                          `• roulette - Roulette (1-36x)\n\n` +
                          `💎 **VIP Bonus:** +5% to +25% extra win chance\n\n` +
                          `📝 **Examples:**\n` +
                          `!gamble 1000 coinflip\n` +
                          `!gamble 5000 slots`);
    }
    
    const userName = await usersData.getName(senderID);
    
    // ✅ রিয়েল-টাইম গ্যাম্বলিং
    const result = economy.gamble(senderID, amount, gameType);
    
    if (!result.success) {
      return message.reply(`❌ ${result.message}`);
    }
    
    const userData = result.user;
    
    if (result.win) {
      await message.reply(`🎉 **JACKPOT! YOU WON!** 🎉\n\n` +
                         `👤 Player: ${userName}\n` +
                         `🎮 Game: ${gameType.toUpperCase()}\n` +
                         `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                         `📈 Multiplier: ${result.multiplier.toFixed(2)}x\n` +
                         `💵 Won: ${result.amount.toLocaleString()} টাকা\n` +
                         `✨ Profit: ${(result.amount - amount).toLocaleString()} টাকা\n\n` +
                         
                         `💰 **New Balance:**\n` +
                         `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                         `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                         `📊 Total: ${userData.total.toLocaleString()} টাকা\n\n` +
                         
                         `🎯 **Statistics:**\n` +
                         `✅ Wins: ${userData.gambleWins}\n` +
                         `❌ Losses: ${userData.gambleLosses}\n\n` +
                         
                         `🎰 Play again: !gamble ${amount} ${gameType}`);
    } else {
      await message.reply(`😔 **BETTER LUCK NEXT TIME!**\n\n` +
                         `👤 Player: ${userName}\n` +
                         `🎮 Game: ${gameType.toUpperCase()}\n` +
                         `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                         `💸 Lost: ${amount.toLocaleString()} টাকা\n\n` +
                         
                         `💰 **New Balance:**\n` +
                         `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                         `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                         `📊 Total: ${userData.total.toLocaleString()} টাকা\n\n` +
                         
                         `🎯 **Statistics:**\n` +
                         `✅ Wins: ${userData.gambleWins}\n` +
                         `❌ Losses: ${userData.gambleLosses}\n\n` +
                         
                         `💡 Tip: Become VIP for better chances!\n` +
                         `💎 Check: !vip plans`);
    }
  }
};
