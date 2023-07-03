const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lanzar-dado')
    .setDescription('Lanza un dado para ganar o perder monedas'),
  async execute(interaction) {
    const user = interaction.user;

    // Simular el lanzamiento de un dado y obtener un número aleatorio del 1 al 6
    const diceResult = Math.floor(Math.random() * 6) + 1;

    // Calcular las monedas ganadas o perdidas según el resultado del dado (cantidad aleatoria)
    let coinsEarned = Math.floor(Math.random() * 100) + 1;
    let coinsLost = Math.floor(Math.random() * 500) + 1;

    // Limitar las monedas ganadas a un máximo de 25
    coinsEarned = Math.min(coinsEarned, 25);

    // Limitar las monedas perdidas a un máximo de 500
    coinsLost = Math.min(coinsLost, 500);

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const userBalance = economyDB.get(`balances.${user.id}`) || 0;
    
    let newBalance = userBalance;
    let description = '';

    if (diceResult % 2 === 0) {
      // El resultado del dado es par, el usuario gana monedas
      newBalance += coinsEarned;
      description = `${user.username} ha lanzado un dado y ha ganado ${coinsEarned} monedas. Tu saldo actual es: ${newBalance} monedas.`;
    } else {
      // El resultado del dado es impar, el usuario pierde monedas
      newBalance -= coinsLost;
      description = `${user.username} ha lanzado un dado y ha perdido ${coinsLost} monedas. Tu saldo actual es: ${newBalance} monedas.`;
    }

    economyDB.set(`balances.${user.id}`, newBalance);

    const embed = {
      color: '006400',
      title: 'Lanzamiento de Dado',
      description,
      timestamp: new Date(),
      footer: {
        text: '¡Buena suerte!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
