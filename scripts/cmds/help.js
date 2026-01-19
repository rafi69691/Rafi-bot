const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "4.0",
    author: "RAFI | Developer",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View all commands with beautiful gaming theme",
    },
    longDescription: {
      en: "View command usage and list all commands with casino/gaming theme layout",
    },
    category: "info",
    guide: {
      en: "help [cmdName]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      let msg = "";

      // 🎰 CASINO THEME HEADER
      msg += `╔══════════════════════════════════════╗\n`;
      msg += `║        🎰 𝗥𝗔𝗙𝗜 𝗕𝗢𝗧 𝗖𝗔𝗦𝗜𝗡𝗢 🎰        ║\n`;
      msg += `║          𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨                ║\n`;
      msg += `╚══════════════════════════════════════╝\n\n`;
      
      msg += `🎮 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n`;
      msg += `📊 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commands.size}\n`;
      msg += `👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿: 𝗥𝗔𝗙𝗜\n`;
      msg += `🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/share/1AT5HsAFqC/\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      // 🎯 GAMBLING GAMES SECTION (প্রথমে)
      msg += `🎰 ━━━━━━━【 𝗚𝗔𝗠𝗕𝗟𝗜𝗡𝗚 𝗚𝗔𝗠𝗘𝗦 】━━━━━━ 🎰\n\n`;
      
      const gamblingGames = [
        { name: "🪙 𝗖𝗢𝗜𝗡𝗙𝗟𝗜𝗣", cmd: "gamble coinflip", desc: "50% win chance | 1.8x-2.2x" },
        { name: "🎲 𝗗𝗜𝗖𝗘 𝗚𝗔𝗠𝗘", cmd: "gamble dice", desc: "Roll dice | 1.5x-6.0x" },
        { name: "🎰 𝗦𝗟𝗢𝗧𝗦", cmd: "gamble slots", desc: "Slot machine | 3.0x-10.0x" },
        { name: "🎡 𝗥𝗢𝗨𝗟𝗘𝗧𝗧𝗘", cmd: "gamble roulette", desc: "Roulette wheel | 2.0x-36.0x" },
        { name: "🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞", cmd: "gamble blackjack", desc: "Card game | 1.5x-3.0x" },
        { name: "♠️ 𝗣𝗢𝗞𝗘𝗥", cmd: "gamble poker", desc: "Texas Hold'em | 2.0x-10.0x" },
        { name: "💎 𝗕𝗔𝗖𝗖𝗔𝗥𝗔𝗧", cmd: "gamble baccarat", desc: "Baccarat game | 1.0x-8.0x" },
        { name: "⚡ 𝗖𝗥𝗔𝗦𝗛", cmd: "gamble crash", desc: "Crash game | 1.0x-100.0x" },
        { name: "💣 𝗠𝗜𝗡𝗘𝗦", cmd: "gamble mines", desc: "Minesweeper | 1.0x-25.0x" },
        { name: "🎯 𝗣𝗟𝗜𝗡𝗞𝗢", cmd: "gamble plinko", desc: "Plinko drop | 1.0x-50.0x" }
      ];
      
      // 2 কলামে গেমস শো করা
      const midPoint = Math.ceil(gamblingGames.length / 2);
      const leftColumn = gamblingGames.slice(0, midPoint);
      const rightColumn = gamblingGames.slice(midPoint);
      
      for (let i = 0; i < midPoint; i++) {
        const leftGame = leftColumn[i];
        const rightGame = rightColumn[i];
        
        let row = `┣ ${leftGame.name}`;
        row = row.padEnd(25);
        
        if (rightGame) {
          row += `┃ ${rightGame.name}`;
        }
        
        msg += `${row}\n`;
        
        // Description row
        let descRow = `┃ ${leftGame.desc}`;
        descRow = descRow.padEnd(35);
        
        if (rightGame) {
          descRow += `┃ ${rightGame.desc}`;
        }
        
        msg += `${descRow}\n\n`;
      }
      
      msg += `🎮 𝗨𝘀𝗮𝗴𝗲: ${prefix}𝗴𝗮𝗺𝗯𝗹𝗲 [𝗮𝗺𝗼𝘂𝗻𝘁] [𝗴𝗮𝗺𝗲]\n`;
      msg += `📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${prefix}𝗴𝗮𝗺𝗯𝗹𝗲 𝟭𝟬𝟬𝟬 𝗰𝗼𝗶𝗻𝗳𝗹𝗶𝗽\n\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      // 💰 ECONOMY SYSTEM
      msg += `💰 ━━━━━━━【 𝗘𝗖𝗢𝗡𝗢𝗠𝗬 𝗦𝗬𝗦𝗧𝗘𝗠 】━━━━━━ 💰\n\n`;
      
      const economyCommands = [
        { cmd: "balance", desc: "Check your balance & VIP status" },
        { cmd: "deposit [amount]", desc: "Deposit cash to bank" },
        { cmd: "withdraw [amount]", desc: "Withdraw from bank" },
        { cmd: "transfer [amount] @user", desc: "Send money to friends" },
        { cmd: "bank", desc: "View bank details" },
        { cmd: "daily", desc: "Daily tasks & rewards" },
        { cmd: "work", desc: "Work hourly jobs" },
        { cmd: "leaderboard", desc: "Top 10 richest players" },
        { cmd: "stats", desc: "View your statistics" }
      ];
      
      economyCommands.forEach(cmd => {
        msg += `┣ ${prefix}${cmd.cmd.padEnd(20)} ┃ ${cmd.desc}\n`;
      });
      
      msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      // 💎 VIP SYSTEM
      msg += `💎 ━━━━━━━【 𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 】━━━━━━ 💎\n\n`;
      
      const vipCommands = [
        { cmd: "vip plans", desc: "View VIP packages & prices" },
        { cmd: "vip buy [1-5]", desc: "Purchase VIP membership" },
        { cmd: "vip status", desc: "Check your VIP status" },
        { cmd: "vip daily", desc: "Claim daily VIP bonus" },
        { cmd: "vipshop list", desc: "VIP exclusive items" },
        { cmd: "vip casino [amount]", desc: "High-stakes VIP casino" },
        { cmd: "vip double", desc: "Double daily (Gold+ VIP)" }
      ];
      
      vipCommands.forEach(cmd => {
        msg += `┣ ${prefix}${cmd.cmd.padEnd(25)} ┃ ${cmd.desc}\n`;
      });
      
      msg += `\n🎯 𝗩𝗜𝗣 𝗣𝗿𝗶𝗰𝗲𝘀:\n`;
      msg += `┣ 🟤 Bronze: 10,000,000 টাকা\n`;
      msg += `┣ ⚪ Silver: 30,000,000 টাকা\n`;
      msg += `┣ 🟡 Gold: 69,000,000 টাকা\n`;
      msg += `┣ 🔷 Diamond: 109,000,000 টাকা\n`;
      msg += `┣ 👑 Royal: 1,000,000,000 টাকা\n\n`;
      
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      // 👑 ADMIN COMMANDS
      const adminCmds = [];
      for (const [name, value] of commands) {
        if (value.config.role >= 2) {
          adminCmds.push(name);
        }
      }
      
      if (adminCmds.length > 0 && role >= 2) {
        msg += `👑 ━━━━━━━【 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 】━━━━━━ 👑\n\n`;
        
        adminCmds.forEach((cmd, index) => {
          msg += `┣ ${prefix}${cmd}`;
          if ((index + 1) % 3 === 0) msg += `\n`;
          else msg += ` `.repeat(15 - cmd.length);
        });
        
        msg += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      }

      // 📊 QUICK STATS & TIPS
      msg += `📊 ━━━━━━━【 𝗤𝗨𝗜𝗖𝗞 𝗧𝗜𝗣𝗦 】━━━━━━ 📊\n\n`;
      
      const tips = [
        `🎯 Start with ${prefix}balance to check your money`,
        `🎰 Try ${prefix}gamble 1000 coinflip for quick play`,
        `💎 VIP members get +5% to +25% gambling bonus`,
        `📅 Use ${prefix}daily for free money every day`,
        `💼 Work hourly with ${prefix}work to earn cash`,
        `🏆 Check ${prefix}leaderboard to see top players`,
        `🔧 Use ${prefix}help [command] for detailed info`
      ];
      
      tips.forEach(tip => {
        msg += `┣ ${tip}\n`;
      });
      
      msg += `\n══════════════════════════════════════════\n`;
      msg += `🎮 𝗚𝗮𝗺𝗶𝗻𝗴 𝗙𝘂𝗻 | 💰 𝗥𝗲𝗮𝗹 𝗘𝗰𝗼𝗻𝗼𝗺𝘆 | 💎 𝗩𝗜𝗣 𝗕𝗲𝗻𝗲𝗳𝗶𝘁𝘀\n`;
      msg += `👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: 𝗥𝗔𝗙𝗜\n`;
      msg += `📞 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/share/1AT5HsAFqC/\n`;
      msg += `══════════════════════════════════════════\n\n`;
      msg += `💡 𝗧𝗶𝗽: Use ${prefix}help gamble for game details\n`;
      msg += `⏰ 𝗔𝘂𝘁𝗼-𝗱𝗲𝗹𝗲𝘁𝗲: 90 seconds`;

      try {
        const sentMessage = await message.reply({ body: msg });

        setTimeout(() => {
          message.unsend(sentMessage.messageID);
        }, 90000);

      } catch (error) {
        console.error("Error sending help message:", error);
        await message.reply(
          `🎰 **RAFI BOT CASINO** 🎰\n\n` +
          `💰 **Economy:** ${prefix}balance, ${prefix}gamble\n` +
          `🎮 **Games:** coinflip, dice, slots, roulette\n` +
          `💎 **VIP:** ${prefix}vip plans\n\n` +
          `👑 Developer: RAFI`
        );
      }

    } else {
      // নির্দিষ্ট কমান্ডের হেল্প
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(
          `🎰 **Command Not Found!** 🎰\n\n` +
          `🔍 Command: ${commandName}\n\n` +
          `🎮 **Available Games:**\n` +
          `• coinflip - 50% win chance\n` +
          `• dice - Dice rolling game\n` +
          `• slots - Slot machine\n` +
          `• roulette - Roulette wheel\n` +
          `• blackjack - Card game\n\n` +
          `💰 **Use:** ${prefix}help (for all commands)`
        );
        return;
      }

      const configCommand = command.config;
      const roleText = this.roleTextToString(configCommand.role);
      const author = configCommand.author || "RAFI";
      
      const longDescription = configCommand.longDescription 
        ? configCommand.longDescription.en || configCommand.longDescription 
        : configCommand.shortDescription?.en || configCommand.shortDescription || "No description available";
      
      const guideBody = configCommand.guide?.en || configCommand.guide || "No specific usage guide";
      const usage = guideBody
        .replace(/{p}/g, prefix)
        .replace(/{n}/g, configCommand.name)
        .replace(/{pn}/g, `${prefix}${configCommand.name}`);

      // 🎰 GAMBLE COMMAND SPECIAL VIEW
      if (commandName === 'gamble') {
        const response = 
          `╔══════════════════════════════════════════╗\n` +
          `║           🎰 𝗚𝗔𝗠𝗕𝗟𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠 🎰         ║\n` +
          `╚══════════════════════════════════════════╝\n\n` +
          
          `🎀 **Command:** ${configCommand.name}\n` +
          `📌 **Aliases:** ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
          `👑 **Author:** ${author}\n` +
          `⭐ **Version:** ${configCommand.version || "1.0"}\n` +
          `👥 **Role:** ${roleText}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          
          `📝 **Description:**\n${this.wrapText(longDescription, 40)}\n\n` +
          
          `🎮 **Available Games:**\n\n` +
          `🪙 𝗖𝗢𝗜𝗡𝗙𝗟𝗜𝗣\n` +
          `┣ Chance: 50%\n` +
          `┣ Multiplier: 1.8x - 2.2x\n` +
          `┣ Usage: ${prefix}gamble [amount] coinflip\n\n` +
          
          `🎲 𝗗𝗜𝗖𝗘 𝗚𝗔𝗠𝗘\n` +
          `┣ Chance: 50%\n` +
          `┣ Multiplier: 1.5x - 6.0x\n` +
          `┣ Usage: ${prefix}gamble [amount] dice\n\n` +
          
          `🎰 𝗦𝗟𝗢𝗧𝗦\n` +
          `┣ Chance: 35%\n` +
          `┣ Multiplier: 3.0x - 10.0x\n` +
          `┣ Usage: ${prefix}gamble [amount] slots\n\n` +
          
          `🎡 𝗥𝗢𝗨𝗟𝗘𝗧𝗧𝗘\n` +
          `┣ Chance: 48%\n` +
          `┣ Multiplier: 2.0x - 36.0x\n` +
          `┣ Usage: ${prefix}gamble [amount] roulette\n\n` +
          
          `🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞\n` +
          `┣ Chance: 42%\n` +
          `┣ Multiplier: 1.5x - 3.0x\n` +
          `┣ Usage: ${prefix}gamble [amount] blackjack\n\n` +
          
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          
          `💎 **VIP Benefits:**\n` +
          `┣ 🟤 Bronze: +5% win chance\n` +
          `┣ ⚪ Silver: +10% win chance\n` +
          `┣ 🟡 Gold: +15% win chance\n` +
          `┣ 🔷 Diamond: +20% win chance\n` +
          `┣ 👑 Royal: +25% win chance\n\n` +
          
          `📚 **Usage Guide:**\n\`\`\`${usage}\`\`\`\n\n` +
          
          `💡 **Examples:**\n` +
          `• ${prefix}gamble 1000 coinflip\n` +
          `• ${prefix}gamble 5000 slots\n` +
          `• ${prefix}gamble 10000 dice\n\n` +
          
          `⚠️ **Minimum Bet:** 100 টাকা\n` +
          `💰 **Check Balance:** ${prefix}balance\n` +
          `💎 **VIP Info:** ${prefix}vip plans\n\n` +
          
          `══════════════════════════════════════════\n` +
          `🎰 𝗚𝗮𝗺𝗯𝗹𝗶𝗻𝗴 𝗙𝘂𝗻 | 💰 𝗥𝗲𝗮𝗹 𝗠𝗼𝗻𝗲𝘆 | 💎 𝗩𝗜𝗣 𝗕𝗼𝗻𝘂𝘀\n` +
          `👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆 𝗥𝗔𝗙𝗜`;

        const helpMessage = await message.reply(response);
        setTimeout(() => message.unsend(helpMessage.messageID), 80000);
        
      } else if (commandName === 'vip') {
        // VIP COMMAND SPECIAL VIEW
        const response = 
          `╔══════════════════════════════════════════╗\n` +
          `║           💎 𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 💎            ║\n` +
          `╚══════════════════════════════════════════╝\n\n` +
          
          `🎀 **Command:** ${configCommand.name}\n` +
          `📌 **Aliases:** ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
          `👑 **Author:** ${author}\n` +
          `⭐ **Version:** ${configCommand.version || "1.0"}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          
          `📝 **Description:**\n${this.wrapText(longDescription, 40)}\n\n` +
          
          `💰 **VIP Packages & Prices:**\n\n` +
          `🟤 𝗕𝗥𝗢𝗡𝗭𝗘 𝗩𝗜𝗣\n` +
          `┣ Price: 10,000,000 টাকা\n` +
          `┣ Daily Bonus: 100,000 টাকা\n` +
          `┣ Gambling Bonus: +5% win chance\n` +
          `┣ Transfer Bonus: +1%\n` +
          `┣ Duration: 30 days\n\n` +
          
          `⚪ 𝗦𝗜𝗟𝗩𝗘𝗥 𝗩𝗜𝗣\n` +
          `┣ Price: 30,000,000 টাকা\n` +
          `┣ Daily Bonus: 300,000 টাকা\n` +
          `┣ Gambling Bonus: +10% win chance\n` +
          `┣ Transfer Bonus: +3%\n` +
          `┣ Duration: 30 days\n\n` +
          
          `🟡 𝗚𝗢𝗟𝗗 𝗩𝗜𝗣\n` +
          `┣ Price: 69,000,000 টাকা\n` +
          `┣ Daily Bonus: 690,000 টাকা\n` +
          `┣ Gambling Bonus: +15% win chance\n` +
          `┣ Transfer Bonus: +5%\n` +
          `┣ Duration: 30 days\n\n` +
          
          `🔷 𝗗𝗜𝗔𝗠𝗢𝗡𝗗 𝗩𝗜𝗣\n` +
          `┣ Price: 109,000,000 টাকা\n` +
          `┣ Daily Bonus: 1,090,000 টাকা\n` +
          `┣ Gambling Bonus: +20% win chance\n` +
          `┣ Transfer Bonus: +8%\n` +
          `┣ Duration: 30 days\n\n` +
          
          `👑 𝗥𝗢𝗬𝗔𝗟 𝗩𝗜𝗣\n` +
          `┣ Price: 1,000,000,000 টাকা\n` +
          `┣ Daily Bonus: 5,000,000 টাকা\n` +
          `┣ Gambling Bonus: +25% win chance\n` +
          `┣ Transfer Bonus: +15%\n` +
          `┣ Duration: 30 days\n\n` +
          
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          
          `📚 **Usage Guide:**\n\`\`\`${usage}\`\`\`\n\n` +
          
          `💡 **Examples:**\n` +
          `• ${prefix}vip plans - View packages\n` +
          `• ${prefix}vip buy 3 - Buy Gold VIP\n` +
          `• ${prefix}vip status - Check your VIP\n` +
          `• ${prefix}vip daily - Claim daily bonus\n\n` +
          
          `🎰 **VIP Exclusive Features:**\n` +
          `✅ Daily cash bonuses\n` +
          `✅ Higher gambling win chances\n` +
          `✅ Transfer bonuses\n` +
          `✅ VIP casino access\n` +
          `✅ Double daily bonus (Gold+)\n` +
          `✅ VIP shop with exclusive items\n\n` +
          
          `⚠️ **Requirement:** Must have enough balance!\n` +
          `💰 **Check Balance:** ${prefix}balance\n` +
          `🎮 **Gambling:** ${prefix}gamble\n\n` +
          
          `══════════════════════════════════════════\n` +
          `💎 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗕𝗲𝗻𝗲𝗳𝗶𝘁𝘀 | 💰 𝗥𝗲𝗮𝗹 𝗩𝗮𝗹𝘂𝗲 | 🎰 𝗘𝘅𝗰𝗹𝘂𝘀𝗶𝘃𝗲`;

        const helpMessage = await message.reply(response);
        setTimeout(() => message.unsend(helpMessage.messageID), 80000);
        
      } else {
        // REGULAR COMMAND VIEW
        const response = 
          `╔══════════════════════════════════════════╗\n` +
          `║         📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗛𝗘𝗟𝗣 📖           ║\n` +
          `╚══════════════════════════════════════════╝\n\n` +
          
          `🎀 **Name:** ${configCommand.name}\n` +
          (configCommand.aliases && configCommand.aliases.length > 0 
            ? `📌 **Aliases:** ${configCommand.aliases.join(", ")}\n` 
            : ``) +
          `📂 **Category:** ${this.getCategoryEmoji(configCommand.category)} ${configCommand.category || "General"}\n` +
          `👑 **Author:** ${author}\n` +
          `⭐ **Version:** ${configCommand.version || "1.0"}\n` +
          `👥 **Role:** ${roleText}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          
          `📝 **Description:**\n${this.wrapText(longDescription, 40)}\n\n` +
          
          `📚 **Usage:**\n\`\`\`${usage}\`\`\`\n\n` +
          
          `💡 **Examples:**\n${this.getCommandExamples(configCommand.name, prefix)}\n\n` +
          
          `🔗 **Related Commands:**\n${this.getRelatedCommands(configCommand.name, commands)}\n\n` +
          
          `⚠️ **Note:** Use ${prefix}help for all commands\n` +
          `⏰ **Auto-delete:** 80 seconds\n\n` +
          
          `══════════════════════════════════════════\n` +
          `👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆 𝗥𝗔𝗙𝗜 | 🎮 𝗚𝗮𝗺𝗶𝗻𝗴 𝗕𝗼𝘁`;

        const helpMessage = await message.reply(response);
        setTimeout(() => message.unsend(helpMessage.messageID), 80000);
      }
    }
  },

  // হেল্পার ফাংশনসমূহ
  getCategoryEmoji(category) {
    const emojiMap = {
      'economy': '💰',
      'game': '🎮',
      'gambling': '🎰',
      'fun': '😄',
      'tools': '🛠️',
      'utility': '🔧',
      'admin': '👑',
      'owner': '🤴',
      'nsfw': '🔞',
      'image': '🖼️',
      'info': 'ℹ️',
      'music': '🎵',
      'search': '🔍',
      'vip': '💎'
    };
    return emojiMap[category?.toLowerCase()] || '📁';
  },

  roleTextToString(roleText) {
    switch (roleText) {
      case 0: return "👤 All Users";
      case 1: return "👮 Group Admin";
      case 2: return "👑 Bot Admin";
      case 3: return "🤴 Owner Only";
      default: return "Unknown Role";
    }
  },

  wrapText(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        lines.push(`┃ ${currentLine.trim()}`);
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    
    if (currentLine.trim()) {
      lines.push(`┃ ${currentLine.trim()}`);
    }
    
    return lines.join('\n');
  },

  getCommandExamples(commandName, prefix) {
    const examples = {
      'balance': `┃ • ${prefix}balance\n┃ • ${prefix}balance @user`,
      'deposit': `┃ • ${prefix}deposit 1000\n┃ • ${prefix}deposit all`,
      'withdraw': `┃ • ${prefix}withdraw 500\n┃ • ${prefix}withdraw 50%`,
      'transfer': `┃ • ${prefix}transfer 1000 @friend\n┃ • ${prefix}transfer 5000 @user`,
      'gamble': `┃ • ${prefix}gamble 1000 coinflip\n┃ • ${prefix}gamble 5000 slots\n┃ • ${prefix}gamble 2000 dice`,
      'vip': `┃ • ${prefix}vip plans\n┃ • ${prefix}vip buy 3\n┃ • ${prefix}vip status\n┃ • ${prefix}vip daily`,
      'vipshop': `┃ • ${prefix}vipshop list\n┃ • ${prefix}vipshop buy lucky_charm`,
      'daily': `┃ • ${prefix}daily\n┃ • ${prefix}daily claim 1`,
      'work': `┃ • ${prefix}work\n┃ • ${prefix}work 3`,
      'bank': `┃ • ${prefix}bank\n┃ • ${prefix}bank deposit 1000`,
      'leaderboard': `┃ • ${prefix}leaderboard\n┃ • ${prefix}leaderboard vip`,
      'stats': `┃ • ${prefix}stats\n┃ • ${prefix}stats @user`
    };
    
    return examples[commandName] || `┃ • ${prefix}${commandName} [parameters]`;
  },

  getRelatedCommands(commandName, commands) {
    const relatedMap = {
      'balance': 'deposit, withdraw, transfer, bank, stats',
      'deposit': 'balance, withdraw, bank, transfer',
      'withdraw': 'balance, deposit, bank, transfer',
      'transfer': 'balance, deposit, withdraw',
      'gamble': 'balance, vip, daily, work, stats',
      'vip': 'vipshop, balance, gamble, daily',
      'vipshop': 'vip, balance, vip daily',
      'daily': 'work, balance, gamble',
      'work': 'daily, balance, gamble',
      'bank': 'balance, deposit, withdraw',
      'leaderboard': 'balance, stats, gamble',
      'stats': 'balance, leaderboard, gamble'
    };
    
    const related = relatedMap[commandName];
    if (!related) return "┃ No related commands";
    
    return related.split(', ').map(cmd => `┃ • ${cmd}`).join('\n');
  }
};
