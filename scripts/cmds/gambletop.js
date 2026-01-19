module.exports = {
  config: {
    name: "gambletop",
    aliases: ["গ্যাম্বলটপ", "জুয়াটপ"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View gambling leaderboard"
    },
    longDescription: {
      en: "See top gamblers with highest wins"
    },
    category: "economy",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    // এখানে ইকোনমি সিস্টেম থেকে গ্যাম্বল লিডারবোর্ড লোড করুন
    // const topGamblers = await economy.getGambleLeaderboard(10);
    
    // Temporary data
    const topGamblers = [
      { username: "RAFI", gambleWins: 150, gambleLosses: 50, winRate: 75 },
      { username: "Player2", gambleWins: 120, gambleLosses: 80, winRate: 60 },
      { username: "Player3", gambleWins: 100, gambleLosses: 60, winRate: 63 },
      { username: "Player4", gambleWins: 90, gambleLosses: 70, winRate: 56 },
      { username: "Player5", gambleWins: 80, gambleLosses: 90, winRate: 47 },
      { username: "Player6", gambleWins: 70, gambleLosses: 60, winRate: 54 },
      { username: "Player7", gambleWins: 65, gambleLosses: 75, winRate: 46 },
      { username: "Player8", gambleWins: 60, gambleLosses: 40, winRate: 60 },
      { username: "Player9", gambleWins: 55, gambleLosses: 65, winRate: 46 },
      { username: "Player10", gambleWins: 50, gambleLosses: 50, winRate: 50 }
    ];
    
    let response = `🎰 **TOP 10 গ্যাম্বলারস** 🎰\n\n`;
    
    topGamblers.forEach((player, index) => {
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔸";
      response += `${medal} ${index + 1}. ${player.username}\n`;
      response += `   ✅ জয়: ${player.gambleWins} | ❌ হার: ${player.gambleLosses} | 📊 রেট: ${player.winRate}%\n`;
    });
    
    response += `\n💡 Tips: জুয়া খেলতে !gamble [amount] [game] ব্যবহার করুন`;
    
    await message.reply(response);
  }
};
