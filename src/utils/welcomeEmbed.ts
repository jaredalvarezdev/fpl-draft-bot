import { EmbedBuilder } from 'discord.js';

const LEAGUE_ID_GUIDE_IMAGE_URL = 'https://i.imgur.com/5bKNQ3i.png';

// Mensaje corto que se envía automáticamente al agregar el bot a un servidor
export function buildShortWelcomeEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('⚽ ¡Gracias por agregarme!')
    .setDescription(
      'Soy **Premier Draft Bot**, te ayudo a seguir tu liga de **FPL Draft** desde Discord.\n\n' +
      'Escribe `/help` para ver cómo configurarme y empezar a usarme.',
    )
    .setColor(0x37003c)
    .setFooter({ text: 'Premier Draft Bot · FPL Draft League' });
}

// Panel completo con instrucciones, usado en /help
export function buildFullHelpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('⚽ Premier Draft Bot — Cómo usarme')
    .setDescription('Aquí te explico cómo empezar a usarme con tu liga de **FPL Draft**.')
    .addFields(
      {
        name: '1️⃣ Consigue tu League ID',
        value:
          'Entra a [draft.premierleague.com](https://draft.premierleague.com) e inicia sesión.\n' +
          '1. Abre las **DevTools** de tu navegador (tecla `F12`)\n' +
          '2. Ve a la pestaña **Network** (Red)\n' +
          '3. Filtra por **Fetch/XHR**\n' +
          '4. Entra a tu liga (o recarga la página con `F5`)\n' +
          '5. Busca en la lista una petición llamada `details`\n' +
          '6. Su URL se ve así: `draft.premierleague.com/api/league/`**`98865`**`/details`\n' +
          'Ese número es tu **League ID**.',
      },
      {
        name: '2️⃣ Guarda tu liga',
        value: 'Usa `/league add id:<tu_id>` para guardarla en este servidor (hasta 5 gratis).',
      },
      {
        name: '3️⃣ Consúltala cuando quieras',
        value:
          '`/league info id:<id>` — ver el estado del draft y equipos\n' +
          '`/league list` — ver las ligas guardadas en este servidor\n' +
          '`/league remove id:<id>` — quitar una liga guardada',
      },
    )
    .setImage(LEAGUE_ID_GUIDE_IMAGE_URL)
    .setColor(0x37003c)
    .setFooter({ text: 'Premier Draft Bot · FPL Draft League' });
}
