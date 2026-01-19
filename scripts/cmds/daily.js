// scripts/cmds/daily.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "daily",
    aliases: ["দৈনিক", "ডেইলি", "dailybonus"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Complete daily tasks to earn money"
    },
    longDescription: {
      en: "Complete daily tasks and challenges to earn cash rewards"
    },
    category: "economy",
    guide: {
      en: "{pn} or {pn} claim [task_number]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const userName = await usersData.getName(senderID);
    const action = args[0]?.toLowerCase() || 'list';
    
    const dailyTasks = {
      1: { name: "Daily Login", reward: 10000, description: "Check in daily" },
      2: { name: "Balance Check", reward: 5000, description: "Check your balance" },
      3: { name: "Play Gamble", reward: 20000, description: "Play any gambling game" },
      4: { name: "Win a Game", reward: 50000, description: "Win any gambling game" },
      5: { name: "Be VIP", reward: 100000, description: "Be a VIP member" }
    };
    
    if (action === 'list') {
      let tasksList = `📅 **DAILY TASKS** 📅\n\n`;
      tasksList += `👤 Welcome, ${userName}!\n`;
      tasksList += `💰 Complete tasks to earn money!\n\n`;
      
      Object.entries(dailyTasks).forEach(([id, task]) => {
        tasksList += `🔸 **Task ${id}:** ${task.name}\n`;
        tasksList += `📝 ${task.description}\n`;
        tasksList += `💰 Reward: ${task.reward.toLocaleString()} টাকা\n`;
        tasksList += `🎯 Claim: !daily claim ${id}\n\n`;
      });
      
      tasksList += `📝 **Total Available:** 185,000 টাকা\n`;
      tasksList += `🔄 **Resets every 24 hours**\n\n`;
      tasksList += `💡 **Note:** Balance updates instantly!`;
      
      await message.reply(tasksList);
      
    } else if (action === 'claim') {
      const taskId = parseInt(args[1]);
      const task = dailyTasks[taskId];
      
      if (!task) {
        return message.reply(`❌ Invalid task ID! Use !daily to see all tasks`);
      }
      
      // ✅ টাস্ক কমপ্লিশন
      const result = economy.completeDailyTask(senderID, taskId, task.reward);
      
      if (!result.success) {
        return message.reply(result.message);
      }
      
      await message.reply(`✅ **TASK COMPLETED!** ✅\n\n` +
                         `🔸 Task ${taskId}: ${task.name}\n` +
                         `📝 ${task.description}\n\n` +
                         `💰 **Reward Received:** ${task.reward.toLocaleString()} টাকা\n` +
                         `💵 **New Cash:** ${result.newCash.toLocaleString()} টাকা\n\n` +
                         
                         `📊 **Total Earned:** (check with !balance)\n` +
                         `🔄 Next task: !daily`);
    }
  }
};
