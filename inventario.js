const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('Muestra el inventario del usuario'),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    // Obtener el inventario del usuario desde la base de datos
    const inventory = economyDB.get(`inventory.${interaction.user.id}`) || [];

    if (inventory.length === 0) {
      await interaction.reply('Tu inventario está vacío.');
      return;
    }

    const inventoryList = inventory.map((item, index) => `${index + 1}. ${item.name}`).join('\n');

    const embed = {
      color: '006400',
      title: 'Inventario',
      description: `Inventario de ${interaction.user.username}:\n${inventoryList}`,
      timestamp: new Date(),
      footer: {
        text: '¡Disfruta de tus artículos!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
