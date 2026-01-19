const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.0",
    author: "RAFI | Developer",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View all commands with beautiful formatting",
    },
    longDescription: {
      en: "View command usage and list all commands with beautiful organized layout",
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
      const categories = {};
      let msg = "";

      // সুন্দর HEADER
      msg += `╔══════════════════════╗\n`;
      msg += `║      🎮 RAFI BOT     ║\n`;
      msg += `║    HELP COMMANDS     ║\n`;
      msg += `╚══════════════════════╝\n\n`;
      
      msg += `📁 **Prefix:** ${prefix}\n`;
      msg += `📊 **Total Commands:** ${commands.size}\n`;
      msg += `👑 **Developer:** RAFI\n`;
      msg += `🔗 **Facebook:** fb.com/share/1AT5HsAFqC/\n`;
      msg += `─`.repeat(30) + `\n\n`;

      // ক্যাটাগরি সংগ্রহ করুন
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category?.toLowerCase() || "uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      // 📊 **ECONOMY SYSTEM** (প্রথমে শো করা)
      const economyCmds = categories["economy"]?.commands.sort() || [];
      if (economyCmds.length > 0) {
        msg += `📊 ━━━━━━【 ECONOMY 】━━━━━━ 📊\n\n`;
        
        // মেইন ইকোনমি কমান্ড
        const mainEconomy = ['balance', 'deposit', 'withdraw', 'transfer', 'bank'];
        msg += `💰 **Main Economy:**\n`;
        msg += `├─ ${mainEconomy.map(cmd => `• ${cmd}`).join('\n├─ ')}\n\n`;
        
        // গ্যাম্বলিং কমান্ড
        const gamblingCmds = economyCmds.filter(cmd => 
          ['gamble', 'gambletop', 'slots', 'dice', 'coinflip', 'roulette'].includes(cmd)
        );
        if (gamblingCmds.length > 0) {
          msg += `🎰 **Gambling Games:**\n`;
          msg += `├─ ${gamblingCmds.map(cmd => `• ${cmd}`).join('\n├─ ')}\n\n`;
        }
        
        // VIP সিস্টেম
        const vipCmds = economyCmds.filter(cmd => 
          ['vip', 'vipshop', 'viptop'].includes(cmd)
        );
        if (vipCmds.length > 0) {
          msg += `💎 **VIP System:**\n`;
          msg += `├─ ${vipCmds.map(cmd => `• ${cmd}`).join('\n├─ ')}\n\n`;
        }
        
        // অন্যান্য ইকোনমি
        const otherEconomy = economyCmds.filter(cmd => 
          ![...mainEconomy, ...gamblingCmds, ...vipCmds].includes(cmd)
        );
        if (otherEconomy.length > 0) {
          msg += `📈 **Other Economy:**\n`;
          msg += `├─ ${otherEconomy.map(cmd => `• ${cmd}`).join('\n├─ ')}\n\n`;
        }
        
        delete categories["economy"];
        msg += `─`.repeat(30) + `\n\n`;
      }

      // অন্যান্য ক্যাটাগরি
      const sortedCategories = Object.keys(categories).sort();
      
      for (const category of sortedCategories) {
        if (category === "info") continue;
        
        const categoryName = category.toUpperCase();
        const categoryEmoji = this.getCategoryEmoji(category);
        const categoryCommands = categories[category].commands.sort();
        
        if (categoryCommands.length === 0) continue;
        
        msg += `${categoryEmoji} ━━━━━━【 ${categoryName} 】━━━━━━ ${categoryEmoji}\n\n`;
        
        // 3 কলামে কমান্ড শো করা
        const chunkSize = Math.ceil(categoryCommands.length / 3);
        const chunks = [];
        
        for (let i = 0; i < categoryCommands.length; i += chunkSize) {
          chunks.push(categoryCommands.slice(i, i + chunkSize));
        }
        
        // সারি বাই সারি শো করা
        const maxRows = Math.max(...chunks.map(chunk => chunk.length));
        
        for (let row = 0; row < maxRows; row++) {
          let rowText = "";
          for (let col = 0; col < chunks.length; col++) {
            if (chunks[col][row]) {
              rowText += `• ${chunks[col][row].padEnd(15)}`;
            } else {
              rowText += " ".repeat(17);
            }
          }
          msg += `${rowText.trim()}\n`;
        }
        
        msg += `\n`;
      }

      // 📚 **QUICK GUIDE SECTION**
      msg += `📚 ━━━━━━【 QUICK GUIDE 】━━━━━━ 📚\n\n`;
      
      msg += `🎮 **HOW TO USE COMMANDS:**\n`;
      msg += `├─ ${prefix}command [parameter]\n`;
      msg += `├─ Example: ${prefix}gamble 1000\n`;
      msg += `├─ Example: ${prefix}balance @user\n\n`;
      
      // 💰 **ECONOMY GUIDE**
      msg += `💰 **ECONOMY GUIDE:**\n`;
      msg += `├─ Start with ${prefix}balance\n`;
      msg += `├─ Earn: ${prefix}daily, ${prefix}work, ${prefix}gamble\n`;
      msg += `├─ Manage: ${prefix}deposit, ${prefix}withdraw\n`;
      msg += `├─ VIP: ${prefix}vip plans\n\n`;
      
      // 🎰 **GAMBLING GAMES**
      msg += `🎰 **GAMBLING GAMES:**\n`;
      msg += `├─ ${prefix}gamble [amount] [game]\n`;
      msg += `├─ Games: coinflip, dice, slots, roulette\n`;
      msg += `├─ VIPs get +5% to +25% win chance\n\n`;
      
      // 💎 **VIP SYSTEM**
      msg += `💎 **VIP SYSTEM (PAID):**\n`;
      msg += `├─ Bronze: 10M | Silver: 30M\n`;
      msg += `├─ Gold: 69M | Diamond: 109M\n`;
      msg += `├─ Royal: 1B | Use: ${prefix}vip buy [1-5]\n\n`;
      
      // ⚠️ **IMPORTANT NOTES**
      msg += `⚠️ **IMPORTANT NOTES:**\n`;
      msg += `├─ All money transactions are virtual\n`;
      msg += `├─ VIP requires real balance\n`;
      msg += `├─ Admin commands: ${prefix}reset, ${prefix}admin\n`;
      msg += `├─ Support: fb.com/share/1AT5HsAFqC/\n`;
      
      msg += `\n${"═".repeat(35)}`;
      msg += `\n💡 **Tip:** Use ${prefix}help [command] for details\n`;
      msg += `🌟 **Example:** ${prefix}help gamble\n`;
      msg += `📞 **Developer:** RAFI\n`;
      msg += `${"═".repeat(35)}`;

      try {
        const sentMessage = await message.reply({ body: msg });

        // 90 সেকেন্ড পর মেসেজ ডিলিট
        setTimeout(() => {
          message.unsend(sentMessage.messageID);
        }, 90000);

      } catch (error) {
        console.error("Error sending help message:", error);
        // Fallback simple message
        await message.reply(
          `📚 **RAFI BOT HELP**\n\n` +
          `Use: ${prefix}help [command]\n` +
          `Example: ${prefix}help gamble\n\n` +
          `💰 **Economy:** balance, deposit, withdraw, transfer\n` +
          `🎰 **Gambling:** gamble, slots, dice, coinflip\n` +
          `💎 **VIP:** vip, vipshop, viptop\n\n` +
          `👑 Developer: RAFI`
        );
      }

    } else {
      // নির্দিষ্ট কমান্ডের হেল্প
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(
          `❌ Command "${commandName}" not found!\n\n` +
          `🔍 Available commands:\n` +
          `💰 Economy: balance, deposit, withdraw, transfer\n` +
          `🎰 Gambling: gamble, slots, dice, coinflip\n` +
          `💎 VIP: vip, vipshop\n\n` +
          `📋 Use: ${prefix}help (without command name)`
        );
      } else {
        const configCommand = command.config;
        const roleText = this.roleTextToString(configCommand.role);
        const author = configCommand.author || "RAFI";
        
        // ক্যাটাগরি ইমোজি
        const categoryEmoji = this.getCategoryEmoji(configCommand.category);
        
        const longDescription = configCommand.longDescription 
          ? configCommand.longDescription.en || configCommand.longDescription 
          : configCommand.shortDescription?.en || configCommand.shortDescription || "No description available";
        
        const guideBody = configCommand.guide?.en || configCommand.guide || "No specific usage guide";
        const usage = guideBody
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name)
          .replace(/{pn}/g, `${prefix}${configCommand.name}`);

        // সুন্দর ফরম্যাটেড রেসপন্স
        const response = 
          `╔══════════════════════════════════╗\n` +
          `║         📖 COMMAND HELP          ║\n` +
          `╚══════════════════════════════════╝\n\n` +
          
          `🎀 **Name:** ${configCommand.name}\n` +
          (configCommand.aliases && configCommand.aliases.length > 0 
            ? `📌 **Aliases:** ${configCommand.aliases.join(", ")}\n` 
            : ``) +
          `📂 **Category:** ${categoryEmoji} ${configCommand.category || "General"}\n` +
          `👑 **Author:** ${author}\n` +
          `⭐ **Version:** ${configCommand.version || "1.0"}\n` +
          `👥 **Role:** ${roleText}\n` +
          `─`.repeat(40) + `\n\n` +
          
          `📝 **Description:**\n${this.wrapText(longDescription, 35)}\n\n` +
          
          `📚 **Usage:**\n\`\`\`${usage}\`\`\`\n\n` +
          
          `💡 **Examples:**\n${this.getCommandExamples(configCommand.name, prefix)}\n\n` +
          
          `🔗 **Related Commands:**\n${this.getRelatedCommands(configCommand.name, commands)}\n\n` +
          
          `${"═".repeat(40)}\n` +
          `💡 Type ${prefix}help for all commands\n` +
          `👑 Developed by RAFI`;

        const helpMessage = await message.reply(response);

        // 80 সেকেন্ড পর ডিলিট
        setTimeout(() => {
          message.unsend(helpMessage.messageID);
        }, 80000);
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
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
    
    return lines.map(line => `  ${line}`).join('\n');
  },

  getCommandExamples(commandName, prefix) {
    const examples = {
      'balance': `• ${prefix}balance\n• ${prefix}balance @user`,
      'deposit': `• ${prefix}deposit 1000\n• ${prefix}deposit all`,
      'withdraw': `• ${prefix}withdraw 500\n• ${prefix}withdraw 50%`,
      'transfer': `• ${prefix}transfer 1000 @friend\n• ${prefix}transfer 5000 @user`,
      'gamble': `• ${prefix}gamble 1000 coinflip\n• ${prefix}gamble 5000 slots\n• ${prefix}gamble 2000 dice`,
      'vip': `• ${prefix}vip plans\n• ${prefix}vip buy 3\n• ${prefix}vip status\n• ${prefix}vip daily`,
      'vipshop': `• ${prefix}vipshop list\n• ${prefix}vipshop buy lucky_charm`,
      'daily': `• ${prefix}daily\n• ${prefix}daily claim 1`,
      'work': `• ${prefix}work\n• ${prefix}work 3`,
      'bank': `• ${prefix}bank\n• ${prefix}bank deposit 1000`,
      'leaderboard': `• ${prefix}leaderboard\n• ${prefix}leaderboard vip`,
      'stats': `• ${prefix}stats\n• ${prefix}stats @user`
    };
    
    return examples[commandName] || `• ${prefix}${commandName} [parameters]`;
  },

  getRelatedCommands(commandName, commands) {
    const relatedMap = {
      'balance': 'deposit, withdraw, transfer, bank',
      'deposit': 'balance, withdraw, bank, transfer',
      'withdraw': 'balance, deposit, bank, transfer',
      'transfer': 'balance, deposit, withdraw',
      'gamble': 'balance, vip, gambletop, slots',
      'vip': 'vipshop, balance, gamble, viptop',
      'vipshop': 'vip, balance, vip daily',
      'daily': 'work, balance, gamble',
      'work': 'daily, balance, gamble',
      'bank': 'balance, deposit, withdraw',
      'leaderboard': 'balance, stats, viptop',
      'stats': 'balance, leaderboard, gambletop'
    };
    
    const related = relatedMap[commandName];
    if (!related) return "No related commands";
    
    return related.split(', ').map(cmd => `• ${cmd}`).join('\n');
  }
};
