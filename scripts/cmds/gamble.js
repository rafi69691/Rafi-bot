// scripts/cmds/gamble.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "gamble",
    aliases: ["bet", "জুয়া", "গ্যাম্বল", "বাজি"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Play gambling games"
    },
    longDescription: {
      en: "Play various gambling games to win money"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount] [game]\nGames: coinflip, dice, slots, roulette, blackjack"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const amount = parseInt(args[0]);
    const gameType = args[1]?.toLowerCase() || 'coinflip';
    
    if (!amount || isNaN(amount) || amount <= 0) {
      const gamesList = `🎰 **RAFI GAMBLING GAMES** 🎰\n\n` +
                       `💰 Usage: !gamble [amount] [game]\n\n` +
                       `🎮 **Available Games:**\n` +
                       `1. 🪙 **coinflip** - 50% win chance (2x multiplier)\n` +
                       `2. 🎲 **dice** - Roll dice (1.5x-6x multiplier)\n` +
                       `3. 🎰 **slots** - Slot machine (3x-10x multiplier)\n` +
                       `4. 🎡 **roulette** - Roulette wheel (2x-36x multiplier)\n` +
                       `5. 🃏 **blackjack** - Card game (1.5x-3x multiplier)\n\n` +
                       `💎 **VIP Bonus:** +5% to +25% extra win chance\n\n` +
                       `📝 **Examples:**\n` +
                       `!gamble 1000 coinflip\n` +
                       `!gamble 5000 slots\n` +
                       `!gamble 10000 dice`;
      
      return message.reply(gamesList);
    }
    
    const userName = await usersData.getName(senderID);
    
    // ✅ গ্যাম্বলিং রেজাল্ট
    const result = economy.gamble(senderID, amount, gameType);
    
    if (!result.success) {
      return message.reply(result.message);
    }
    
    if (result.win) {
      await message.reply(`🎉 **${gameType.toUpperCase()} - JACKPOT!** 🎉\n\n` +
                         `👤 Player: ${userName}\n` +
                         `🎮 Game: ${gameType}\n` +
                         `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                         `📈 Multiplier: ${result.multiplier}x\n` +
                         `💵 Won: ${result.amount.toLocaleString()} টাকা\n` +
                         `✨ Profit: ${(result.amount - amount).toLocaleString()} টাকা\n\n` +
                         
                         `💰 **New Cash:** ${result.newCash.toLocaleString()} টাকা\n` +
                         `🏦 **Bank:** (check with !balance)\n\n` +
                         
                         `🎰 **Play Again:**\n` +
                         `!gamble ${Math.floor(amount * 1.5)} ${gameType}\n` +
                         `!gamble ${amount} dice`);
    } else {
      await message.reply(`😔 **${gameType.toUpperCase()} - LOST!**\n\n` +
                         `👤 Player: ${userName}\n` +
                         `🎮 Game: ${gameType}\n` +
                         `💰 Bet: ${amount.toLocaleString()} টাকা\n` +
                         `💸 Lost: ${amount.toLocaleString()} টাকা\n\n` +
                         
                         `💰 **New Cash:** ${result.newCash.toLocaleString()} টাকা\n` +
                         `🏦 **Bank:** (check with !balance)\n\n` +
                         
                         `💡 **Tips:**\n` +
                         `• Start with smaller bets\n` +
                         `• Try different games\n` +
                         `• Become VIP for better chances\n` +
                         `• Check !balance before gambling`);
    }
  }
};
