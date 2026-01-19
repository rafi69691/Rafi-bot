// scripts/cmds/work.js
const economy = require('../economy');

module.exports = {
  config: {
    name: "work",
    aliases: ["কাজ", "চাকরি", "উপার্জন"],
    version: "1.0",
    author: "RAFI",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Work to earn money hourly"
    },
    longDescription: {
      en: "Work at different jobs to earn cash every hour"
    },
    category: "economy",
    guide: {
      en: "{pn} or {pn} [job_number]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const userName = await usersData.getName(senderID);
    const jobId = parseInt(args[0]) || 1;
    
    const jobs = {
      1: { name: "Fast Food Worker", salary: 5000 },
      2: { name: "Office Clerk", salary: 10000 },
      3: { name: "Programmer", salary: 25000 },
      4: { name: "Bank Manager", salary: 50000 },
      5: { name: "CEO", salary: 100000 }
    };
    
    const job = jobs[jobId];
    
    if (!job) {
      return message.reply(`❌ Invalid job! Available: 1-5\n📋 Use !work to see all jobs`);
    }
    
    // ✅ কাজ করে টাকা আয়
    const result = economy.work(senderID, job.salary);
    
    if (!result.success) {
      return message.reply(result.message);
    }
    
    await message.reply(`✅ **WORK COMPLETED!** ✅\n\n` +
                       `💼 Job: ${job.name}\n` +
                       `💰 **Salary Earned:** ${job.salary.toLocaleString()} টাকা\n` +
                       `💵 **New Cash:** ${result.newCash.toLocaleString()} টাকা\n\n` +
                       
                       `⏰ **Cooldown:** 60 minutes\n` +
                       `🔄 Work again in 1 hour\n` +
                       `💎 Better jobs available!`);
  }
};
