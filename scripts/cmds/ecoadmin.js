module.exports = {
  config: {
    name: "admin",
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 2, // শুধুমাত্র অ্যাডমিনদের জন্য
    shortDescription: {
      en: "Admin economy management"
    },
    longDescription: {
      en: "Add/remove money and manage admin roles"
    },
    category: "economy",
    guide: {
      en: "{pn} add [@user] [amount]\n{pn} remove [@user] [amount]\n{pn} set [@user] [true/false]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    if (args.length < 1) {
      return message.reply(`👑 **RAFI Admin Commands** 👑\n\n` +
                          `!admin add [@user] [amount] - Add money\n` +
                          `!admin remove [@user] [amount] - Remove money\n` +
                          `!admin set [@user] [true/false] - Set admin\n\n` +
                          `Example: !admin add @RAFI 1000`);
    }
    
    const action = args[0].toLowerCase();
    const targetID = args[1]?.replace(/@/g, "");
    const amount = parseInt(args[2]);
    const isAdmin = args[2] === "true";
    
    if (!targetID) {
      return message.reply("❌ Please mention a user with @");
    }
    
    const adminName = await usersData.getName(event.senderID);
    const targetName = await usersData.getName(targetID);
    
    switch (action) {
      case 'add':
        if (!amount || isNaN(amount) || amount <= 0) {
          return message.reply("❌ Please enter a valid amount.");
        }
        
        const addResponse = `✅ ${adminName} added ${amount} $ to ${targetName}'s account!\n` +
                           `💰 ${targetName} received: +${amount} $`;
        await message.reply(addResponse);
        break;
        
      case 'remove':
        if (!amount || isNaN(amount) || amount <= 0) {
          return message.reply("❌ Please enter a valid amount.");
        }
        
        const removeResponse = `⚠️ ${adminName} removed ${amount} $ from ${targetName}'s account!\n` +
                              `💰 ${targetName} lost: -${amount} $`;
        await message.reply(removeResponse);
        break;
        
      case 'set':
        const setResponse = isAdmin 
          ? `👑 ${adminName} promoted ${targetName} to Admin!`
          : `👤 ${adminName} demoted ${targetName} from Admin role.`;
        await message.reply(setResponse);
        break;
        
      default:
        await message.reply("❌ Invalid admin command. Use: add, remove, or set");
    }
  }
};
