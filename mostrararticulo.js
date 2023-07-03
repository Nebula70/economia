const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mostrar-articulos')
    .setDescription('Muestra la lista de artículos disponibles en la tienda'),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    // Obtener la lista de artículos desde la base de datos
    const items = economyDB.get('items') || [];

    if (items.length === 0) {
      await interaction.reply('No hay artículos disponibles en la tienda.');
      return;
    }

    const embed = {
      color: '006400',
      title: 'Artículos Disponibles',
      description: '¡Echa un vistazo a nuestros productos!',
      timestamp: new Date(),
      fields: [],
      footer: {
        text: 'Tienda',
      },
    };

    // Agregar los campos al embed para cada artículo
    items.forEach((item, index) => {
      const field = {
        name: `${index + 1}. ${item.name}`,
        value: `Descripción: ${item.description}\nPrecio: ${item.price} monedas`,
        inline: false,
      };
      embed.fields.push(field);
    });

    await interaction.reply({ embeds: [embed] });
  },
};
