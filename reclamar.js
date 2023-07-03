const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reclamar')
    .setDescription('Reclama un artículo del inventario')
    .addIntegerOption(option =>
      option.setName('indice')
        .setDescription('Índice del artículo que deseas reclamar')
        .setRequired(true)),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    // Obtener el índice del artículo desde la opción
    const index = interaction.options.getInteger('indice');

    // Obtener el inventario del usuario desde la base de datos
    const inventory = economyDB.get(`inventory.${interaction.user.id}`) || [];

    if (index < 1 || index > inventory.length) {
      await interaction.reply('El índice proporcionado es inválido.');
      return;
    }

    const item = inventory[index - 1];

    // Restar el artículo del inventario del usuario
    inventory.splice(index - 1, 1);
    economyDB.set(`inventory.${interaction.user.id}`, inventory);

    const embed = {
      color: '006400',
      title: 'Reclamar Artículo',
      description: `Has reclamado el artículo ${item.name} de tu inventario,  si es una recompensa crea ticket.`,
      timestamp: new Date(),
      footer: {
        text: '¡Reclamación exitosa!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
