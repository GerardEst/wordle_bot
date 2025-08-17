import { lang } from './interfaces.ts'

const translations: any = {
    // Commands
    classification: {
        es: 'clasificacion',
        cat: 'classificacio',
        en: 'classification',
    },
    timetrial: { es: 'contrarreloj', cat: 'contrarrellotge', en: 'timetrial' },
    legend: { es: 'leyenda', cat: 'llegenda', en: 'legend' },
    trophies: { es: 'premios', cat: 'premis', en: 'trophies' },
    addCharacter: {
        es: 'anadirpersonaje',
        cat: 'afegirpersonatge',
        en: 'addcharacter',
    },
    removeCharacter: {
        es: 'eliminarpersonaje',
        cat: 'eliminarpersonatge',
        en: 'removecharacter',
    },
    instructions: {
        es: 'instrucciones',
        cat: 'instruccions',
        en: 'instructions',
    },

    // Secondary commands
    add: { es: 'Añadir a ', cat: 'Afegir a ', en: 'Add ' },
    remove: { es: 'Eliminar a ', cat: 'Eliminar a ', en: 'Remove ' },
    showcase: {
        es: 'Vitrina virtual',
        cat: 'Vitrina virtual',
        en: 'Virtual showcase',
    },
    monthTrophies: {
        es: 'Premios en juego',
        cat: 'Premis en joc',
        en: 'Trophies at stake',
    },
    closeOptions: {
        es: '🔙 Cerrar opciones',
        cat: '🔙 Tancar opcions',
        en: '🔙 Close options',
    },

    // Simple replies
    optionsClosed: {
        es: 'Opciones cerradas',
        cat: 'Opcions tancades',
        en: 'Options closed',
    },
    selectOption: {
        es: 'Selecciona una opción',
        cat: 'Selecciona una opció:',
        en: 'Select an option',
    },
    noCharacters: {
        es: 'No hay personajes en la liga',
        cat: 'No hi ha personatges a la lliga.',
        en: 'No characters in the league',
    },
    whichCharaterToDelete: {
        es: 'Que personaje quieres eliminar',
        cat: 'Quin personatge vols eliminar?',
        en: 'Which character do you want to remove?',
    },
    charHasBeenAdded: {
        es: 'se ha añadido a la partida!',
        cat: "s'ha afegit a la partida!",
        en: 'has been added to the game!',
    },
    charHasBeenRemoved: {
        es: 'se ha eliminado de la partida!',
        cat: "s'ha tret de la partida!",
        en: 'has been removed from the game!',
    },
    cantRemoveChar: {
        es: 'Algo no ha ido bien, no se ha podido eliminar al personaje.',
        cat: "Alguna cosa no ha anat bé, no s'ha pogut eliminar el personatge.",
        en: 'Something went wrong, could not remove the character.',
    },
    noGamesInChat: {
        es: 'Aún no hay puntuaciones en este chat',
        cat: 'Encara no hi ha puntuacions en aquest xat',
        en: 'No scores in this chat yet',
    },

    // Bot messages partials
    classificationTitle: {
        es: 'Clasificación actual',
        cat: 'Classificació actual',
        en: 'Current classification',
    },
    timetrialClassificationTitle: {
        es: 'Contrarrelloj actual',
        cat: 'Contrarrellotge actual',
        en: 'Current time trial',
    },
    name: {
        es: 'Nombre',
        cat: 'Nom',
        en: 'Name',
    },
    points: {
        es: 'Puntos',
        cat: 'Punts',
        en: 'Points',
    },
    pointsLowercase: {
        es: 'puntos',
        cat: 'punts',
        en: 'points',
    },
    pointLowercase: {
        es: 'punto',
        cat: 'punt',
        en: 'point',
    },
    time: {
        es: 'Tiempo acc.',
        cat: 'Temps acc.',
        en: 'Acc. time',
    },
    daisRemainingA: {
        es: 'Faltan *',
        cat: 'Falten *',
        en: '*',
    },
    daisRemainingB: {
        es: ' dias* para el final de la liga!',
        cat: ' dies* pel final de la lliga!',
        en: ' days* left until the end of the league!',
    },
    legendTitle: {
        es: '*🧮 Tabla de puntuaciones y reacciones*',
        cat: '*🧮 Taula de puntuacions i reaccions*',
        en: '*🧮 Scoring and reactions table*',
    },
    legendExplain: {
        es: 'Se otorgarán los puntos al mandar los resultados al chat, y se reaccionará al comentario con el emoji correspondiente',
        cat: "S'otorgaran els punts al enviar els resultats al xat, i es reaccionarà al comentari amb l'emoji corresponent",
        en: 'Points will be awarded when sending results to the chat, and the comment will be reacted to with the corresponding emoji',
    },
    finalAdviseTitleA: {
        es: '🐣 *Anuncio importante*\n\nHoy a las ',
        cat: '🐣 *Anunci important*\n\nAvui a les ',
        en: '🐣 *Important announcement*\n\nToday at ',
    },
    finalAdviseTitleB: {
        es: ' termina la *',
        cat: ' acaba la *',
        en: ' ends the *',
    },
    finalAdviseTitleC: {
        es: "Enviad vuestros resultados de hoy _antes de esta hora_!'",
        cat: "Envieu els vostres resultats d'avui _abans d'aquesta hora_!",
        en: 'Send your results for today _before this time_!',
    },
    showcaseTitle: {
        es: '_Vitrina virtual con todos los premios que habeis ganado_',
        cat: '_Vitrina virtual amb tots els premis que heu guanyat_',
        en: '_Virtual showcase with all the trophies you have won_',
    },
    showcaseNoTrophie: {
        es: 'Nadie ha ganado ningún premio',
        cat: 'Ningú ha guanyat cap premi',
        en: 'No one has won any trophies',
    },
    monthTrophiesTitle: {
        es: 'Premios en juego en la ',
        cat: 'Premis en joc a la ',
        en: 'Trophies at stake in the ',
    },
    normalLeague: {
        es: 'Liga normal',
        cat: 'Lliga normal',
        en: 'Normal league',
    },
    timetrialLeague: {
        es: 'Liga contrarreloj',
        cat: 'Lliga contrarrellotge',
        en: 'Time trial league',
    },
    consolationTrophieMessage: {
        es: '_Habrá premio de consolación para los demás participantes._',
        cat: '_Hi haurà premi de consolació per la resta de participants._',
        en: '_There will be a consolation prize for other participants._',
    },
    endOfLeagueMessageA: {
        es: 'Fin de la',
        cat: 'Final de la',
        en: 'End of the',
    },
    endOfLeagueMessageB: {
        es: 'con',
        cat: 'amb',
        en: 'with',
    },
    endOfLeagueMessageC: {
        es: 'puntos*, recibe el premio',
        cat: 'punts*, rep el premi',
        en: 'points*, receives the trophy',
    },
    endOfLeagueMessageD: {
        es: 'con un tiempo acumulado de',
        cat: 'amb un temps acumulat de',
        en: 'with an accumulated time of',
    },
    endOfLeagueMessageE: {
        es: 'recibe el premio',
        cat: 'rep el premi',
        en: 'receives the trophy',
    },
    endOfLeagueMessageF: {
        es: 'Los demás os lleváis el premio de consolación,',
        cat: 'La resta us emporteu el premi de consolació,',
        en: 'Everyone else gets the consolation prize,',
    },
    endOfLeagueMessageG: {
        es: 'Enorabuena a todos! 🥳 Y recordad que mañana empieza la ',
        cat: 'Enhorabona a tots! 🥳 I recordeu que demà comença la ',
        en: 'Congratulations to everyone! 🥳 And remember that tomorrow the ',
    },
    endOfLeagueMessageH: {
        es: '_Podéis ver los premios enviando /premios_',
        cat: '_Podeu veure els premis enviant /premis_',
        en: '_You can see the trophies by sending /trophies_',
    },
    topTitle: {
        es: '⭐️ *Top 5 mundial*',
        cat: '⭐️ *Top 5 mundial*',
        en: '⭐️ *Global Top 5*',
    },
    topNoPlayers: {
        es: 'Aún no hay jugadores este mes',
        cat: 'Encara no hi ha jugadors aquest mes',
        en: 'No players this month yet',
    },

    // Instructions and welcome messages
    welcomeMessage: {
        es: '¡Hola! 👋 Soy el bot de Wardle\n\nCompartid los resultados de wardle.day en este grupo y empezará la competición! Yo me encargo de mantener una clasificación y dar premios a los mejores.\n\nEnviad /clasificacion siempre que queráis para ver como va la liga, y /instrucciones para ver mas detalles de lo que puedo hacer.',
        cat: 'Hola! 👋 Sóc el bot del Mooot\n\nCompartiu els resultats de mooot.cat en aquet grup i començarà la competició! Jo m’encarregaré de mantenir una classificació i donar premis als millors.\n\nEnvieu /classificacio sempre que vulgueu per veure com va la lliga, i /instruccions per veure més detalls del que puc fer.',
        en: "Hello! 👋 I'm the Wardle bot\n\n Share your results from wardle.day/en in this group and the competition will begin! I will create a classification and give trophies to the best players.\n\nUse /classification anytime you need to see how the league is going, and /instructions to know more about what I can do.",
    },
    instructionsMessage: {
        es: '📋 *Instrucciones del bot de wardle.day*\n\n🎯 *¿Cómo funciona?*\nComparte tus resultados de wardle.day en este chat y yo me encargaré del resto. Reaccionaré a tu mensaje y guardaré tu puntuación automáticamente.\n\n📊 *Comandos disponibles:*\n• /clasificacion - Ver clasificación mensual\n• /contrarreloj - Ver clasificación por tiempo\n• /leyenda - Tabla de puntos y reacciones\n• /premios - Ver premios disponibles\n• /top - Top 5 mundial\n• /anadirpersonaje - Añadir personajes virtuales\n• /eliminarpersonaje - Eliminar personajes\n\n🏆 *Sistema de puntos:*\n• 1 intento = 6 puntos\n• 2 intentos = 5 puntos\n• 3 intentos = 4 puntos\n• 4 intentos = 3 puntos\n• 5 intentos = 2 puntos\n• 6 intentos = 1 punto\n• X (fallo) = 0 puntos\n\n¡Solo puedes jugar una vez al día! 🌚',
        cat: '📋 *Instruccions del bot Mooot*\n\n🎯 *Com funciona?*\nCompartiu els resultats del mooot.cat en aquest xat i jo faig la resta. Reaccionaré als vostres missatges i registraré les puntuacions per formar la classificació.\n\nLes lligues son mensuals, cada final de mes es reparteixen premis als guanyadors i comença una nova lliga\n\nHi ha dues classificacions, la normal, que té en compte els punts aconseguits, i la contrarrellotge, que té en compte el temps. Els premis son diferents per cada lliga.\n\n📊 *Ordres disponibles:*\n• /classificacio - Veure classificació mensual\n• /contrarrellotge - Veure classificació per temps\n• /llegenda - Taula de punts i reaccions\n• /premis - Veure premis disponibles\n• /top - Top 5 mundial\n• /afegirpersonatge - Afegir personatges virtuals\n• /eliminarpersonatge - Eliminar personatges\n\n🏆 *Sistema de punts:*\n• 1 intent = 6 punts\n• 2 intents = 5 punts\n• 3 intents = 4 punts\n• 4 intents = 3 punts\n• 5 intents = 2 punts\n• 6 intents = 1 punt\n• X (fallada) = 0 punts\n\nNomés pots jugar un cop al dia!',
        en: "📋 *Wardle.day bot instructions*\n\n🎯 *How does it work?*\nShare your wardle.day/en results in this chat and I'll take care of the rest. I'll react to your message and save your score automatically.\n\nLeagues are monthly, at the end of each month trophies are awarded to winners and a new league begins.\n\nThere are two classifications: normal (based on points) and time trial (based on time). Trophies are different for each league.\n\n📊 *Available commands:*\n• /classification - View monthly classification\n• /timetrial - View time trial classification\n• /legend - Points and reactions table\n• /trophies - View available trophies\n• /top - Global Top 5\n• /addcharacter - Add virtual characters\n• /removecharacter - Remove characters\n\n🏆 *Scoring system:*\n• 1 attempt = 6 points\n• 2 attempts = 5 points\n• 3 attempts = 4 points\n• 4 attempts = 3 points\n• 5 attempts = 2 points\n• 6 attempts = 1 point\n• X (failed) = 0 points\n\nYou can only play once per day! 🌚",
    },
}

// Translates the string using translation object
export function t(command: string, lang: lang): string {
    return translations[command][lang]
}
