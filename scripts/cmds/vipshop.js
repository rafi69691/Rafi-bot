// scripts/cmds/vipshop.js
module.exports = {
  config: {
    name: "vipshop",
    aliases: ["vipstore", "ভিআইপিশপ"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "VIP exclusive shop"
    },
    longDescription: {
      en: "Purchase exclusive items available only for VIP members"
    },
    category: "economy",
    guide: {
      en: "{pn} list\n{pn} buy [item]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const action = args[0]?.toLowerCase() || 'list';
    const userName = await usersData.getName(event.senderID);
    
    const vipItems = {
      "lucky_charm": {
        name: "🍀 লাকি চার্ম",
        price: 500000,
        description: "Increase gambling win chance by 10% for 24 hours",
        vipRequired: 1,
        color: "🟤"
      },
      "money_bag": {
        name: "💰 মানি ব্যাগ",
        price: 1000000,
        description: "Get 2x daily bonus for 3 days",
        vipRequired: 2,
        color: "⚪"
      },
      "golden_dice": {
        name: "🎲 গোল্ডেন ডাইস",
        price: 2000000,
        description: "Guaranteed win on next dice game",
        vipRequired: 3,
        color: "🟡"
      },
      "diamond_card": {
        name: "💎 ডায়মন্ড কার্ড",
        price: 5000000,
        description: "50% discount on next VIP purchase",
        vipRequired: 4,
        color: "🔷"
      },
      "royal_crown": {
        name: "👑 রয়্যাল ক্রাউন",
        price: 10000000,
        description: "Become Royal VIP for 7 days",
        vipRequired: 5,
        color: "👑"
      },
      "transfer_boost": {
        name: "⚡ ট্রান্সফার বুস্ট",
        price: 300000,
        description: "+20% transfer bonus for 24 hours",
        vipRequired: 1,
        color: "🟤"
      },
      "daily_multiplier": {
        name: "🎯 ডেইলি মাল্টিপ্লায়ার",
        price: 800000,
        description: "3x daily bonus for today",
        vipRequired: 2,
        color: "⚪"
      },
      "vip_extend": {
        name: "⏰ VIP এক্সটেন্ড",
        price: 3000000,
        description: "Extend your VIP by 7 days",
        vipRequired: 1,
        color: "🟤"
      }
    };
    
    const vipLevelNames = {
      1: "Bronze VIP",
      2: "Silver VIP", 
      3: "Gold VIP",
      4: "Diamond VIP",
      5: "Royal VIP"
    };
    
    if (action === 'list' || action === 'shop' || action === '') {
      let shopList = `🛍️ **VIP EXCLUSIVE SHOP** 🛍️\n\n`;
      shopList += `👤 Welcome, ${userName}!\n`;
      shopList += `✨ Only available for VIP members!\n\n`;
      shopList += `📦 **Available Items:**\n\n`;
      
      Object.entries(vipItems).forEach(([id, item]) => {
        shopList += `${item.color} ${item.name}\n`;
        shopList += `💰 Price: ${item.price.toLocaleString()} টাকা\n`;
        shopList += `📝 ${item.description}\n`;
        shopList += `🔒 Requires: ${vipLevelNames[item.vipRequired]}\n`;
        shopList += `🛒 Buy: !vipshop buy ${id}\n\n`;
      });
      
      shopList += `📌 **How to buy:**\n`;
      shopList += `!vipshop buy [item_id]\n\n`;
      shopList += `💎 **Check VIP Status:** !vip status\n`;
      shopList += `🛍️ **VIP Plans:** !vip plans\n`;
      shopList += `💰 **Need more money?** Play !gamble or wait for !vip daily`;
      
      await message.reply(shopList);
      
    } else if (action === 'buy') {
      const itemId = args[1];
      
      if (!itemId || !vipItems[itemId]) {
        return message.reply(`❌ **Invalid Item!**\n\n` +
                           `🛍️ Use !vipshop list to see available items\n` +
                           `📦 Item ID must be one of:\n` +
                           `• lucky_charm\n• money_bag\n• golden_dice\n• diamond_card\n• royal_crown\n• transfer_boost\n• daily_multiplier\n• vip_extend`);
      }
      
      const item = vipItems[itemId];
      
      // এখানে চেক করুন ইউজার VIP কিনা এবং যথেষ্ট টাকা আছে কিনা
      // const userVipLevel = await economy.getVipLevel(event.senderID);
      // const userBalance = await economy.checkBalance(event.senderID);
      
      // Temporary check
      const userVipLevel = 1; // ডেমো ভ্যালু
      const userBalance = 1000000; // ডেমো ভ্যালু
      
      if (userVipLevel < item.vipRequired) {
        const requiredLevel = vipLevelNames[item.vipRequired];
        return message.reply(`❌ **VIP Level Required!**\n\n` +
                           `🔒 This item requires: ${requiredLevel}\n` +
                           `📊 Your VIP Level: ${userVipLevel > 0 ? vipLevelNames[userVipLevel] : "No VIP"}\n\n` +
                           `💎 Upgrade VIP: !vip buy ${item.vipRequired}\n` +
                           `📋 Check plans: !vip plans`);
      }
      
      if (userBalance < item.price) {
        return message.reply(`❌ **Insufficient Funds!**\n\n` +
                           `💰 Item Price: ${item.price.toLocaleString()} টাকা\n` +
                           `💵 Your Balance: ${userBalance.toLocaleString()} টাকা\n` +
                           `📉 Needed: ${(item.price - userBalance).toLocaleString()} more\n\n` +
                           `💡 Earn more:\n` +
                           `• Claim !vip daily\n` +
                           `• Play !gamble\n` +
                           `• Wait for daily reset`);
      }
      
      // Purchase successful
      const purchaseMsg = `✅ **Purchase Successful!** ✅\n\n` +
                         `🛍️ Item: ${item.color} ${item.name}\n` +
                         `💰 Price: ${item.price.toLocaleString()} টাকা\n` +
                         `📝 Effect: ${item.description}\n\n` +
                         `✨ Item has been added to your inventory!\n` +
                         `📦 Check your items in VIP dashboard\n\n` +
                         `💎 Use it from your VIP menu\n` +
                         `🔄 Effect will activate immediately`;
      
      await message.reply(purchaseMsg);
      
      // এখানে ইউজারের ব্যালেন্স আপডেট করুন এবং আইটেম যোগ করুন
      // await economy.deductMoney(event.senderID, item.price);
      // await economy.addItemToInventory(event.senderID, itemId);
      
    } else {
      await message.reply(`🛍️ **VIP SHOP HELP** 🛍️\n\n` +
                         `📚 Available Commands:\n` +
                         `• !vipshop list - View all VIP items\n` +
                         `• !vipshop buy [item_id] - Purchase item\n\n` +
                         `💎 Requirements:\n` +
                         `• Must be VIP member\n` +
                         `• Enough money in balance\n\n` +
                         `🔒 VIP Check: !vip status\n` +
                         `💰 Balance Check: !balance`);
    }
  }
};
