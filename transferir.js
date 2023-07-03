const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transferir-money')
    .setDescription('Transfiere monedas a otro usuario')
    .addUserOption(option =>
      option.setName('destinatario')
        .setDescription('Usuario al que deseas transferir las monedas')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de monedas a transferir')
        .setRequired(true)),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    const senderId = interaction.user.id;
    const recipientId = interaction.options.getUser('destinatario').id;
    const amount = interaction.options.getInteger('cantidad');

    if (senderId === recipientId) {
      await interaction.reply('No puedes transferir monedas a ti mismo.');
      return;
    }

    const senderBalance = economyDB.get(`balances.${senderId}`) || 0;

    if (senderBalance < amount) {
      await interaction.reply('No tienes suficientes monedas para realizar esta transferencia.');
      return;
    }

    const recipientBalance = economyDB.get(`balances.${recipientId}`) || 0;

    economyDB.set(`balances.${senderId}`, senderBalance - amount);
    economyDB.set(`balances.${recipientId}`, recipientBalance + amount);

    const embed = {
      color: '006400',
      title: 'Transferencia de Monedas',
      description: `Has transferido ${amount} monedas a <@${recipientId}>.`,
      timestamp: new Date(),
      footer: {
        text: '¡Transferencia exitosa!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
