const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Muestra el saldo actual')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario del que deseas ver el saldo')),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const balance = economyDB.get(`balances.${user.id}`) || 0;

    const embed = {
      color: '006400',
      title: 'Saldo Actual',
      description: `${user.username}, tu saldo actual es: ${balance} monedas.`,
      timestamp: new Date(),
      footer: {
        text: '¡Sigue ahorrando!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
