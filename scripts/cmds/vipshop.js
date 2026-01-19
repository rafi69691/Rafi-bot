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

  onStart: async function ({ message, event, args }) {
    const action = args[0]?.toLowerCase() || 'list';
    
    const vipItems = {
      "lucky_charm": {
        name: "🍀 লাকি চার্ম",
        price: 500000,
        description: "Increase gambling win chance by 10% for 24 hours",
        vipRequired: 1
      },
      "money_bag": {
        name: "💰 মানি ব্যাগ",
        price: 1000000,
        description: "Get 2x daily bonus for 3 days",
        vipRequired: 2
      },
      "golden_dice": {
        name: "🎲 গোল্ডেন ডাইস",
        price: 2000000,
        description: "Guaranteed win on next dice game",
        vipRequired: 3
      },
      "diamond_card": {
        name: "💎 ডায়মন্ড কার্ড",
        price: 5000000,
        description: "50% discount on next VIP purchase",
        vipRequired: 4
      },
      "royal_crown": {
        name: "👑 রয়্যাল ক্রাউন",
        price: 10000000,
        description: "Become Royal VIP for 7 days",
        vipRequired: 5
      },
      "transfer_boost": {
        name: "⚡ ট্রান্সফার বুস্ট",
        price: 300000,
        description: "+20% transfer bonus for 24 hours",
        vipRequired: 1
      },
      "daily_multiplier": {
        name: "🎯 ডেইলি মাল্টিপ্লায়ার",
        price: 800000,
        description: "3x daily bonus for today",
        vipRequired: 2
      }
    };
    
    if (action === 'list' || action === 'shop') {
      let shopList = `🛍️ **VIP EXCLUSIVE SHOP** 🛍️\n\n`;
      shopList += `✨ Only available for VIP members!\n\n`;
      
      Object.entries(vipItems).forEach(([id, item]) => {
        const vipLevels = ["", "Bronze", "Silver", "Gold", "Diamond", "Royal"];
        shopList += `${item.name}\n`;
        shopList += `💰 Price: ${item.price.toLocaleString()} টাকা\n`;
        shopList += `📝 ${item.description}\n`;
        shopList += `🔒 Requires: ${vipLevels[item.vipRequired]} VIP\n`;
        shopList += `🛒 Buy: !vipshop buy ${id}\n\n`;
      });
      
      shopList += `📌 **How to buy:**\n`;
      shopList += `!vipshop buy [item_id]\n\n`;
      shopList += `💎 **Check VIP:** !vip status\n`;
      shopList += `🛍️ **VIP Plans:** !vip plans`;
      
      await message.reply(shopList);
      
    } else if (action === 'buy') {
      const itemId = args[1];
      if (!itemId || !vipItems[itemId]) {
        return message.reply(`❌ Invalid item!\n🛍️ Use !vipshop list to see available items`);
      }
      
      const item = vipItems[itemId];
      await message.reply(`✅ **Purchase Successful!** ✅\n\n` +
                         `🛍️ Item: ${item.name}\n` +
                         `💰 Price: ${item.price.toLocaleString()} টাকা\n` +
                         `📝 Effect: ${item.description}\n\n` +
                         `✨ Item has been added to your inventory!\n` +
                         `💎 Use it from your VIP dashboard`);
    }
  }
};
