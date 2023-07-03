const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apostar')
    .setDescription('Apuesta una cantidad de monedas')
    .addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad de monedas a apostar').setRequired(true)),

  async execute(interaction) {
    const user = interaction.user;
    const amount = interaction.options.getInteger('cantidad');

    if (isNaN(amount) || amount <= 0) {
      const embed = {
        color: 0xFF0000,
        description: 'Debes ingresar una cantidad válida de monedas.',
      };

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const saldoUsuario = economyDB.get(`balances.${user.id}`) || 0;

    if (amount > saldoUsuario) {
      const embed = {
        color: 0xFF0000,
        description: 'No tienes suficientes monedas para realizar esa apuesta.',
      };

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const resultado = Math.random() < 0.5 ? 'ganada' : 'perdida';
    const ganancia = resultado === 'ganada' ? amount * 4 : 0;
    const nuevoSaldo = saldoUsuario + ganancia - amount;

    economyDB.set(`balances.${user.id}`, nuevoSaldo);

    const embed = {
      color: resultado === 'ganada' ? 0x00FF00 : 0xFF0000,
      description: `${user.username}, has realizado una apuesta de ${amount} monedas y has ${resultado} la apuesta. Tu saldo actual es: ${nuevoSaldo} monedas.`,
    };

    await interaction.reply({ embeds: [embed] });
  },
};
