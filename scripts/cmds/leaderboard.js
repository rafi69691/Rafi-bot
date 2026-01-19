module.exports = {
  config: {
    name: "leaderboard",
    aliases: ["top", "rich"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View top 10 richest users"
    },
    longDescription: {
      en: "See the ranking of richest users in the bot"
    },
    category: "economy",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, usersData }) {
    try {
      // এখানে ডাটাবেস থেকে শীর্ষ ১০ ইউজার লোড করুন
      // উদাহরণ ডাটা:
      const topUsers = [
        { name: "RAFI", total: 10000 },
        { name: "User2", total: 8000 },
        { name: "User3", total: 6500 },
        { name: "User4", total: 5000 },
        { name: "User5", total: 4500 },
        { name: "User6", total: 3000 },
        { name: "User7", total: 2500 },
        { name: "User8", total: 2000 },
        { name: "User9", total: 1500 },
        { name: "User10", total: 1000 }
      ];
      
      let response = "🏆 **TOP 10 RICHEST USERS** 🏆\n\n";
      
      topUsers.forEach((user, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔸";
        response += `${medal} ${index + 1}. ${user.name} - 💰 ${user.total} $\n`;
      });
      
      response += `\n💡 Keep earning to climb the leaderboard!`;
      
      await message.reply(response);
    } catch (error) {
      console.error(error);
      await message.reply("❌ Error loading leaderboard.");
    }
  }
};
