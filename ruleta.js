const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ruleta-rusa')
    .setDescription('Juega a la ruleta rusa'),
  async execute(interaction) {
    const chambers = 6; // Número de cámaras del tambor de la pistola
    const bullet = Math.floor(Math.random() * chambers) + 1; // Cámara en la que se encuentra la bala

    let result = '';
    let coinsEarned = Math.floor(Math.random() * 100) + 1; // Cantidad aleatoria de monedas ganadas (hasta un máximo de 100)
    let coinsLost = Math.floor(Math.random() * 1000) + 1; // Cantidad aleatoria de monedas perdidas (hasta un máximo de 1000)

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const userBalance = economyDB.get(`balances.${interaction.user.id}`) || 0;

    let newBalance = userBalance;

    if (Math.random() < 0.5) {
      if (bullet === 1) {
        newBalance -= coinsLost;
        result = `¡BANG! Has sido alcanzado por la bala y has perdido ${coinsLost} monedas.`;
      } else {
        newBalance += coinsEarned;
        result = `Has tenido suerte. La bala no estaba en esta cámara y ganas ${coinsEarned} monedas.`;
      }
    } else {
      if (bullet === 1) {
        newBalance += coinsEarned;
        result = `¡Click! Has sobrevivido por poco. La bala estaba en esta cámara y ganas ${coinsEarned} monedas.`;
      } else {
        result = `¡Click! Has sobrevivido. La bala no estaba en esta cámara y no pierdes ninguna moneda.`;
      }
    }

    economyDB.set(`balances.${interaction.user.id}`, newBalance);

    const embed = {
      color: '006400',
      title: 'Ruleta Rusa',
      description: result,
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
