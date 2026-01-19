module.exports = {
  config: {
    name: "gamble",
    aliases: ["bet", "জুয়া", "গ্যাম্বল"],
    version: "2.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Gamble your money with VIP benefits"
    },
    longDescription: {
      en: "Gamble with different games and get VIP bonuses for higher win chances"
    },
    category: "economy",
    guide: {
      en: "{pn} [amount] [game]\nGames: normal, coinflip, dice, slots, blackjack"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID, threadID } = event;
    const amount = parseInt(args[0]);
    const gameType = args[1]?.toLowerCase() || 'normal';
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply(`🎰 **RAFI GAMBLING SYSTEM** 🎰\n\n` +
                          `💰 Usage: !gamble [amount] [game]\n\n` +
                          `🎮 **AVAILABLE GAMES:**\n` +
                          `• normal - Regular gambling (45% win chance)\n` +
                          `• coinflip - Coin flip game (50%)\n` +
                          `• dice - Dice rolling game\n` +
                          `• slots - Slot machine\n` +
                          `• blackjack - Blackjack card game\n\n` +
                          `💎 **VIP BONUSES:**\n` +
                          `✨ Bronze VIP: +5% win chance\n` +
                          `✨ Silver VIP: +10% win chance\n` +
                          `✨ Gold VIP: +15% win chance\n` +
                          `✨ Diamond VIP: +20% win chance\n` +
                          `✨ Royal VIP: +25% win chance\n\n` +
                          `📝 **Examples:**\n` +
                          `!gamble 500 normal\n` +
                          `!gamble 1000 coinflip\n` +
                          `!gamble 2000 slots\n` +
                          `!gamble 5000 blackjack`);
    }
    
    // VIP সিস্টেম চেক
    const userName = await usersData.getName(senderID);
    
    // VIP লেভেল ডেটা (আপনার ইকোনমি সিস্টেম থেকে আসবে)
    const vipLevels = {
      0: { name: "No VIP", bonus: 0, color: "⚪" },
      1: { name: "Bronze VIP", bonus: 5, color: "🟤" },
      2: { name: "Silver VIP", bonus: 10, color: "⚪" },
      3: { name: "Gold VIP", bonus: 15, color: "🟡" },
      4: { name: "Diamond VIP", bonus: 20, color: "🔷" },
      5: { name: "Royal VIP", bonus: 25, color: "👑" }
    };
    
    // এখানে ইকোনমি সিস্টেম থেকে VIP ডাটা লোড করুন
    // const userData = await economy.getUser(senderID);
    // const vipLevel = userData.vipLevel || 0;
    // const isVip = userData.isVip || false;
    
    // Temporary VIP data - পরবর্তীতে আপনার ইকোনমি সিস্টেম থেকে replace করুন
    const vipLevel = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
    const isVip = vipLevel > 0;
    const vipInfo = vipLevels[vipLevel] || vipLevels[0];
    
    // Game configurations with VIP bonuses
    const games = {
      normal: { 
        baseWinChance: 45, 
        multiplierMin: 1.5, 
        multiplierMax: 3.0,
        description: "Regular gambling game"
      },
      coinflip: { 
        baseWinChance: 50, 
        multiplierMin: 1.8, 
        multiplierMax: 2.5,
        description: "Heads or Tails game"
      },
      dice: { 
        baseWinChance: 50, 
        multiplierMin: 1.8, 
        multiplierMax: 3.0,
        description: "Dice rolling game"
      },
      slots: { 
        baseWinChance: 30, 
        multiplierMin: 3.0, 
        multiplierMax: 10.0,
        description: "Slot machine game"
      },
      blackjack: { 
        baseWinChance: 42, 
        multiplierMin: 2.0, 
        multiplierMax: 3.5,
        description: "Blackjack card game"
      }
    };
    
    const game = games[gameType] || games.normal;
    
    // Apply VIP bonus to win chance
    let winChance = game.baseWinChance;
    let vipBonusMessage = '';
    
    if (isVip && vipInfo.bonus > 0) {
      winChance += vipInfo.bonus;
      vipBonusMessage = `\n✨ **VIP BONUS:** +${vipInfo.bonus}% win chance (${vipInfo.color} ${vipInfo.name})\n`;
    }
    
    // Check minimum and maximum bet limits
    const minBet = 100;
    const maxBet = isVip ? 1000000 : 500000; // VIPs can bet more
    
    if (amount < minBet) {
      return message.reply(`❌ Minimum bet is ${minBet.toLocaleString()} টাকা`);
    }
    
    if (amount > maxBet) {
      return message.reply(`❌ Maximum bet is ${maxBet.toLocaleString()} টাকা${isVip ? ' (VIP limit)' : ''}`);
    }
    
    // Check if user has enough cash (এখানে আপনার ডাটাবেস চেক যোগ করুন)
    // const userBalance = await economy.checkBalance(senderID);
    // if (amount > userBalance.cash) {
    //   return message.reply(`❌ Insufficient cash! You have ${userBalance.cash.toLocaleString()} টাকা`);
    // }
    
    // Gambling logic
    const random = Math.random() * 100;
    const isWin = random <= winChance;
    
    // Calculate win amount with multiplier
    const multiplier = game.multiplierMin + Math.random() * (game.multiplierMax - game.multiplierMin);
    const winAmount = Math.floor(amount * multiplier);
    
    // Extra VIP bonus for wins
    let vipExtraBonus = 0;
    if (isWin && isVip && vipLevel >= 3) { // Gold VIP and above get extra bonus
      vipExtraBonus = Math.floor(winAmount * 0.1); // 10% extra bonus for Gold+ VIP
    }
    
    const totalWin = winAmount + vipExtraBonus;
    
    if (isWin) {
      let winMessage = `🎉 **JACKPOT! YOU WON!** 🎉\n\n`;
      winMessage += `👤 Player: ${userName}\n`;
      winMessage += `🎮 Game: ${gameType.toUpperCase()}\n`;
      winMessage += `💰 Bet: ${amount.toLocaleString()} টাকা\n`;
      winMessage += `📈 Multiplier: ${multiplier.toFixed(2)}x\n`;
      winMessage += `💰 Base Win: ${winAmount.toLocaleString()} টাকা\n`;
      
      if (vipExtraBonus > 0) {
        winMessage += `✨ VIP Extra Bonus: +${vipExtraBonus.toLocaleString()} টাকা\n`;
      }
      
      winMessage += vipBonusMessage;
      winMessage += `💰 **Total Won: ${totalWin.toLocaleString()} টাকা**\n`;
      winMessage += `💵 Net Profit: ${(totalWin - amount).toLocaleString()} টাকা\n`;
      
      if (isVip) {
        winMessage += `\n💎 VIP Level: ${vipInfo.color} ${vipInfo.name}\n`;
        winMessage += `🎯 Your Win Chance: ${winChance}%\n`;
      } else {
        winMessage += `\n💡 Tip: Become VIP for higher win chances!\n`;
        winMessage += `🎰 Base Win Chance: ${game.baseWinChance}%`;
      }
      
      // Update database here
      // await economy.updateBalance(senderID, totalWin - amount);
      
      await message.reply(winMessage);
      
    } else {
      let loseMessage = `😔 **BETTER LUCK NEXT TIME!**\n\n`;
      loseMessage += `👤 Player: ${userName}\n`;
      loseMessage += `🎮 Game: ${gameType.toUpperCase()}\n`;
      loseMessage += `💰 Bet: ${amount.toLocaleString()} টাকা\n`;
      loseMessage += `💸 Lost: ${amount.toLocaleString()} টাকা\n`;
      
      loseMessage += vipBonusMessage;
      
      if (isVip) {
        loseMessage += `\n💎 VIP Level: ${vipInfo.color} ${vipInfo.name}\n`;
        loseMessage += `🎯 Your Win Chance Was: ${winChance}%\n`;
        loseMessage += `💡 VIPs win more often! Try again.`;
      } else {
        loseMessage += `\n🎰 Win Chance: ${winChance}%\n`;
        loseMessage += `💎 Become VIP for +5% to +25% extra win chance!`;
      }
      
      // Update database here
      // await economy.updateBalance(senderID, -amount);
      
      await message.reply(loseMessage);
    }
    
    // Log the gambling transaction
    const logMessage = `${userName} gambled ${amount} টাকা on ${gameType} - ${isWin ? 'WON' : 'LOST'} ${isWin ? totalWin : amount} টাকা`;
    console.log(logMessage);
  }
};
