import { Bot } from "grammy";

const bot_cat = new Bot(Deno.env.get("TELEGRAM_TOKEN_CAT")!);
const bot_es = new Bot(Deno.env.get("TELEGRAM_TOKEN_ES")!);
const bot_en = new Bot(Deno.env.get("TELEGRAM_TOKEN_EN")!);

const commands_cat = [
  {
    command: "/llegenda",
    description: "Mostra la taula d'equivalències de punts",
  },
  {
    command: "/classificacio",
    description: "Mostra la classificació actual",
  },
  {
    command: "/contrarrellotge",
    description: "Mostra la classificació contrarrellotge",
  },
  {
    command: "/premis",
    description: "Obre les opcions de premis",
  },
  {
    command: "/top",
    description: "Mostra el top 10 mundial",
  },
  {
    command: "/topcontrarrellotge",
    description: "Mostra el top 10 mundial",
  },
  {
    command: "/instruccions",
    description: "Mostra les instruccions del bot",
  },
];

const commands_es = [
  {
    command: "/leyenda",
    description: "Muestra la tabla de equivaléncias de puntos",
  },
  {
    command: "/clasificacion",
    description: "Muestra la clasificación actual",
  },
  {
    command: "/contrarreloj",
    description: "Muestra la clasificación contrarreloj",
  },
  {
    command: "/premios",
    description: "Abre las opciones de premios",
  },
  {
    command: "/top",
    description: "Muestra el top 10 mundial",
  },
  {
    command: "/topcontrarreloj",
    description: "Muestra el top 10 mundial",
  },
  {
    command: "/instrucciones",
    description: "Muestra las instrucciones del bot",
  },
];

const commands_en = [
  {
    command: "/legend",
    description: "Show the legend",
  },
  {
    command: "/classification",
    description: "Show current classification",
  },
  {
    command: "/timetrial",
    description: "Show timetrial classification",
  },
  {
    command: "/trophies",
    description: "Open trophies options",
  },
  {
    command: "/top",
    description: "Show the global top 10",
  },
  {
    command: "/toptimetrial",
    description: "Show the global top 10",
  },
  {
    command: "/instructions",
    description: "Show bot instructions",
  },
];

bot_cat.api.setMyCommands(commands_cat);
bot_es.api.setMyCommands(commands_es);
bot_en.api.setMyCommands(commands_en);
