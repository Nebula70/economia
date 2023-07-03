const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comprar')
    .setDescription('Compra un artículo de la tienda')
    .addIntegerOption(option =>
      option.setName('indice')
        .setDescription('Índice del artículo que deseas comprar')
        .setRequired(true)),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    // Obtener el índice del artículo desde la opción
    const index = interaction.options.getInteger('indice');

    // Obtener la lista de artículos desde la base de datos
    const items = economyDB.get('items') || [];

    if (index < 1 || index > items.length) {
      await interaction.reply('El índice proporcionado es inválido.');
      return;
    }

    const item = items[index - 1];

    // Verificar si el usuario tiene suficientes monedas para comprar el artículo
    const userBalance = economyDB.get(`balances.${interaction.user.id}`) || 0;

    if (userBalance < item.price) {
      await interaction.reply('No tienes suficientes monedas para comprar este artículo.');
      return;
    }

    // Restar el precio del artículo del saldo del usuario
    economyDB.set(`balances.${interaction.user.id}`, userBalance - item.price);

    // Agregar el artículo al inventario del usuario
    economyDB.push(`inventory.${interaction.user.id}`, item);

    const embed = {
      color: '006400',
      title: 'Artículo Comprado',
      description: `¡Has comprado ${item.name} por ${item.price} monedas! Disfrútalo.`,
      timestamp: new Date(),
      footer: {
        text: 'Tienda',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
