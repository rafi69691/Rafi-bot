const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "RAFI | Developer",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "help cmdName",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╭─────────⭓\n│ ⭐ RAFI BOT HELP MENU ⭐\n╰─────────⭓\n`; 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      // First show ECONOMY category at top
      if (categories["economy"]) {
        msg += `\n╭─────⭓ ECONOMY`;
        const names = categories["economy"].commands.sort();
        for (let i = 0; i < names.length; i += 3) {
          const cmds = names.slice(i, i + 2).map((item) => `💰 ${item}`);
          msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
        }
        msg += `\n╰────────────⭓\n`;
        delete categories["economy"];
      }

      // Then show other categories
      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────⭓ ${category.toUpperCase()}`;

          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => `✧${item}`);
            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
          }

          msg += `\n╰────────────⭓\n`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n⭔ RAFI Bot has ${totalCommands} commands\n⭔ Type ${prefix}help <command name> to learn Usage\n`;
      msg += `\n📌 ECONOMY COMMANDS:\n`;
      msg += `💰 balance - Check your balance\n`;
      msg += `💰 deposit [amount] - Deposit to bank\n`;
      msg += `💰 withdraw [amount] - Withdraw from bank\n`;
      msg += `💰 transfer [amount] [@user] - Transfer money\n`;
      msg += `💰 bank - View bank details\n`;
      msg += `💰 leaderboard - Top 10 richest\n`;
      msg += `\n👑 ADMIN ECONOMY:\n`;
      msg += `⚡ admin add [@user] [amount]\n`;
      msg += `⚡ admin remove [@user] [amount]\n`;
      msg += `⚡ admin set [@user] [true/false]\n`;
      
      msg += `\n╭─✦ DEVELOPER: RAFI\n├‣ FACEBOOK\n╰‣: https://www.facebook.com/share/1AT5HsAFqC/`;

      try {
        const hh = await message.reply({ body: msg });

        // Automatically unsend the message after 80 seconds
        setTimeout(() => {
          message.unsend(hh.messageID);
        }, 80000);

      } catch (error) {
        console.error("Error sending help message:", error);
      }

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found in RAFI Bot.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "RAFI";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{he}/g, prefix).replace(/{lp}/g, configCommand.name);

        const response = `╭─────────⭓\n│ 🎀 NAME: ${configCommand.name}\n│ 📃 Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "No aliases"}\n├──‣ INFO\n│ 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${longDescription}\n│ 👑 𝗔𝘂𝘁𝗵𝗼𝗿: RAFI\n│ 📚 𝗚𝘂𝗶𝗱𝗲: ${usage}\n├──‣ Usage\n│ ⭐ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}\n│ ♻️ 𝗥𝗼𝗹𝗲: ${roleText}\n╰────────────⭓`;

        const helpMessage = await message.reply(response);

        setTimeout(() => {
          message.unsend(helpMessage.messageID);
        }, 80000);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
