module.exports = {
  config: {
    name: "gamble",
    aliases: ["bet", "জুয়া"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Gamble your money"
    },
    longDescription: {
      en: "Gamble with different games to win or lose money"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount] [game]\nGames: normal, coinflip, dice, slots"
    }
  },

  onStart: async function ({ message, event, args }) {
    const amount = parseInt(args[0]);
    const gameType = args[1] || 'normal';
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply(`🎰 **গ্যাম্বলিং গেমস** 🎰\n\n` +
                          `💰 !gamble [amount] [game]\n\n` +
                          `🎮 **গেমস লিস্ট:**\n` +
                          `• normal - সাধারণ জুয়া (45% জিতার সম্ভাবনা)\n` +
                          `• coinflip - কয়েন ফ্লিপ (50%)\n` +
                          `• dice - ডাইস গেম\n` +
                          `• slots - স্লটস মেশিন\n\n` +
                          `📝 **উদাহরণ:**\n` +
                          `!gamble 500 normal\n` +
                          `!gamble 1000 coinflip\n` +
                          `!gamble 2000 slots`);
    }
    
    // এখানে আপনার ইকোনমি সিস্টেম থেকে gamble ফাংশন কল করুন
    // const result = await economy.gambleGame(event.senderID, gameType, amount);
    
    // Temporary response
    const games = {
      normal: { winChance: 45, multiplier: "1.5x-3x" },
      coinflip: { winChance: 50, multiplier: "1.8x" },
      dice: { winChance: 50, multiplier: "2x" },
      slots: { winChance: 30, multiplier: "3x-10x" }
    };
    
    const game = games[gameType] || games.normal;
    const isWin = Math.random() * 100 <= game.winChance;
    
    if (isWin) {
      const winAmount = Math.floor(amount * (1.5 + Math.random() * 1.5));
      await message.reply(`🎉 **জিতেছেন!** 🎉\n\n` +
                         `🎮 গেম: ${gameType}\n` +
                         `💰 বাজি: ${amount} টাকা\n` +
                         `💰 জিতেছেন: ${winAmount} টাকা\n` +
                         `🎰 জিতার সম্ভাবনা: ${game.winChance}%\n` +
                         `💵 নেট প্রফিট: ${winAmount - amount} টাকা`);
    } else {
      await message.reply(`😔 **হারিয়েছেন!**\n\n` +
                         `🎮 গেম: ${gameType}\n` +
                         `💰 বাজি: ${amount} টাকা\n` +
                         `💸 হারিয়েছেন: ${amount} টাকা\n` +
                         `🎰 জিতার সম্ভাবনা: ${game.winChance}%\n` +
                         `💡 আবার চেষ্টা করুন!`);
    }
  }
};
