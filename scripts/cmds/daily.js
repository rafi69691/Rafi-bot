// scripts/cmds/daily.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "daily",
    aliases: ["দৈনিক", "ডেইলি", "dailybonus", "টাস্ক"],
    version: "2.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Complete daily tasks and earn money"
    },
    longDescription: {
      en: "Complete daily tasks to earn cash with instant balance updates"
    },
    category: "economy",
    guide: {
      en: "{pn} or {pn} claim [task_id]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const userName = await usersData.getName(senderID);
    const action = args[0]?.toLowerCase() || 'list';
    
    const dailyTasks = {
      1: { name: "Daily Login", reward: 10000, description: "Just check in daily" },
      2: { name: "Balance Check", reward: 5000, description: "Check your balance 3 times" },
      3: { name: "Play Gamble", reward: 20000, description: "Play any gambling game once" },
      4: { name: "Win a Game", reward: 50000, description: "Win any gambling game" },
      5: { name: "Transfer Money", reward: 15000, description: "Transfer money to someone" },
      6: { name: "Work Once", reward: 25000, description: "Work at any job" },
      7: { name: "Be VIP", reward: 100000, description: "Be a VIP member" },
      8: { name: "Play 3 Games", reward: 30000, description: "Play 3 different games" }
    };
    
    if (action === 'list' || action === 'tasks') {
      let tasksList = `📅 **DAILY TASKS** 📅\n\n`;
      tasksList += `👤 Welcome, ${userName}!\n`;
      tasksList += `💰 Complete tasks to earn money!\n\n`;
      
      Object.entries(dailyTasks).forEach(([id, task]) => {
        tasksList += `🔸 **Task ${id}:** ${task.name}\n`;
        tasksList += `📝 ${task.description}\n`;
        tasksList += `💰 Reward: ${task.reward.toLocaleString()} টাকা\n`;
        tasksList += `🎯 Claim: !daily claim ${id}\n\n`;
      });
      
      tasksList += `📝 **Total Available:** 265,000 টাকা\n`;
      tasksList += `🔄 **Resets every 24 hours**\n\n`;
      tasksList += `💡 **Note:** Balance updates instantly after claiming!`;
      
      await message.reply(tasksList);
      
    } else if (action === 'claim') {
      const taskId = parseInt(args[1]);
      const task = dailyTasks[taskId];
      
      if (!task) {
        return message.reply(`❌ Invalid task ID! Use !daily to see all tasks`);
      }
      
      // ✅ রিয়েল-টাইম টাস্ক কমপ্লিশন
      const result = economy.completeDailyTask(senderID, taskId, task.reward);
      
      if (!result.success) {
        return message.reply(`❌ ${result.message}`);
      }
      
      const userData = result.user;
      
      const claimMsg = `✅ **TASK COMPLETED!** ✅\n\n` +
                      `🔸 Task ${taskId}: ${task.name}\n` +
                      `📝 ${task.description}\n\n` +
                      `💰 **Reward Received:** ${task.reward.toLocaleString()} টাকা\n\n` +
                      
                      `💰 **New Balance:**\n` +
                      `💵 Cash: ${userData.cash.toLocaleString()} টাকা\n` +
                      `🏦 Bank: ${userData.bank.toLocaleString()} টাকা\n` +
                      `📊 Total: ${userData.total.toLocaleString()} টাকা\n\n` +
                      
                      `📈 **Total Earned:** ${userData.totalEarned.toLocaleString()} টাকা\n` +
                      `🔄 Next task: !daily`;
      
      await message.reply(claimMsg);
      
    } else {
      await message.reply(`📅 **DAILY TASKS SYSTEM** 📅\n\n` +
                         `💰 Earn money daily with tasks!\n\n` +
                         `📚 **Commands:**\n` +
                         `• !daily - View all tasks\n` +
                         `• !daily claim [1-8] - Claim reward\n\n` +
                         `💡 **Features:**\n` +
                         `✅ Instant balance updates\n` +
                         `✅ Real-time money earning\n` +
                         `✅ Daily reset system\n` +
                         `✅ VIP bonus tasks available`);
    }
  }
};
