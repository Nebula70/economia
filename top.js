const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Muestra la tabla de los primeros 10 usuarios con más dinero'),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const balances = economyDB.get('balances');

    if (!balances || Object.keys(balances).length === 0) {
      await interaction.reply('No hay información de saldos disponible.');
      return;
    }

    const sortedBalances = Object.entries(balances).sort((a, b) => b[1] - a[1]);

    const embed = {
      color: '006400',
      title: 'Tabla de los primeros 10 usuarios con más dinero',
      description: sortedBalances.slice(0, 10).map((entry, index) => `**${index + 1}.** <@${entry[0]}> - ${entry[1]} monedas`).join('\n'),
      timestamp: new Date(),
      footer: {
        text: '¡Ahorra y alcanza la cima!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
