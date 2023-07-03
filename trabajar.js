const { SlashCommandBuilder } = require('discord.js');
const wio = require('wio.db');

// Array de textos de trabajo
const trabajos = [
  "programador",
  "diseñador gráfico",
  "escritor",
  "músico",
  "chef",
  "artista",
  "pizzero",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trabajar')
    .setDescription('Realiza un trabajo para ganar o perder monedas'),
  async execute(interaction) {
    const user = interaction.user;

    // Seleccionar aleatoriamente un trabajo
    const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];

    // Calcular las monedas ganadas o perdidas por el trabajo (cantidad aleatoria)
    let coinsEarned = Math.floor(Math.random() * 500) + 1;
    let coinsLost = Math.floor(Math.random() * 200) + 1;

    // Limitar las monedas ganadas a un máximo de 50
    coinsEarned = Math.min(coinsEarned, 50);

    const economyDB = new wio.JsonDatabase({ databasePath: '././database2/economy.json' });
    const userBalance = economyDB.get(`balances.${user.id}`) || 0;
    
    let newBalance = userBalance;
    let description = '';

    if (Math.random() < 0.5) {
      // El usuario realiza el trabajo correctamente y gana monedas
      newBalance += coinsEarned;
      description = `${user.username} ha trabajado como ${trabajo} y ha ganado ${coinsEarned} monedas. Tu saldo actual es: ${newBalance} monedas.`;
    } else {
      // El usuario se equivoca en el trabajo y pierde monedas
      newBalance -= coinsLost;
      description = `${user.username} ha trabajado como ${trabajo}, pero se equivocó y ha perdido ${coinsLost} monedas. Tu saldo actual es: ${newBalance} monedas. ¡Mejor suerte la próxima vez!`;
    }

    economyDB.set(`balances.${user.id}`, newBalance);

    const embed = {
      color: '006400',
      title: 'Trabajo Realizado',
      description,
      timestamp: new Date(),
      footer: {
        text: '¡Sigue así!',
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
