const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dar-dinero')
    .setDescription('Da dinero a otro usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario al que deseas dar dinero')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de dinero a dar')
        .setRequired(true)),
  async execute(interaction) {
    // Verificar si el usuario que ejecuta el comando es administrador
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply('No tienes permisos para ejecutar este comando.');
      return;
    }

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    const recipientId = interaction.options.getUser('usuario').id;
    const amount = interaction.options.getInteger('cantidad');

    if (amount <= 0) {
      await interaction.reply('La cantidad proporcionada debe ser mayor a cero.');
      return;
    }

    // Obtener el saldo actual del usuario destinatario
    const recipientBalance = economyDB.get(`balances.${recipientId}`) || 0;

    // Añadir la cantidad proporcionada al saldo del destinatario
    economyDB.set(`balances.${recipientId}`, recipientBalance + amount);

    const embed = {
      color: '006400',
      title: 'Transferencia de Dinero',
      description: `Has dado ${amount} monedas a <@${recipientId}>.`,
      timestamp: new Date(),
      footer: {
        text: 'Comando de Economía',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
