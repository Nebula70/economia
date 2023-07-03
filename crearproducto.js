const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-producto')
    .setDescription('Crea un nuevo producto para la tienda')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('Nombre del producto')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('descripcion')
        .setDescription('Descripción del producto')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('precio')
        .setDescription('Precio del producto')
        .setRequired(true)),
  async execute(interaction) {
    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });

    // Obtener los valores proporcionados por el usuario
    const name = interaction.options.getString('nombre');
    const description = interaction.options.getString('descripcion');
    const price = interaction.options.getInteger('precio');

    // Crear el nuevo objeto de producto
    const newProduct = {
      name,
      description,
      price,
    };

    // Agregar el producto a la lista de artículos en la base de datos
    economyDB.push('items', newProduct);

    const embed = {
      color: '006400',
      title: 'Producto Creado',
      description: `¡El producto "${name}" se ha creado con éxito y está disponible en la tienda!`,
      timestamp: new Date(),
      footer: {
        text: 'Tienda',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
