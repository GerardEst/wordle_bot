import { lang } from './interfaces.ts'

const translations: any = {
    // Commands
    classification: { es: 'clasificacion', cat: 'classificacio' },
    timetrial: { es: 'contrarreloj', cat: 'contrarrellotge' },
    legend: { es: 'leyenda', cat: 'llegenda' },
    trophies: { es: 'premios', cat: 'premis' },
    addCharacter: { es: 'anadirpersonaje', cat: 'afegirpersonatge' },
    removeCharacter: { es: 'eliminarpersonaje', cat: 'eliminarpersonatge' },

    // Secondary commands
    add: { es: 'Añadir a ', cat: 'Afegir a ' },
    remove: { es: 'Eliminar a ', cat: 'Eliminar a ' },
    showcase: { es: 'Vitrina virtual', cat: 'Vitrina virtual' },
    monthTrophies: { es: 'Premios en juego', cat: 'Premis en joc' },
    closeOptions: { es: '🔙 Cerrar opciones', cat: '🔙 Tancar opcions' },

    // Simple replies
    optionsClosed: { es: 'Opciones cerradas', cat: 'Opcions tancades' },
    selectOption: { es: 'Selecciona una opción', cat: 'Selecciona una opció:' },
    noCharacters: {
        es: 'No hay personajes en la liga',
        cat: 'No hi ha personatges a la lliga.',
    },
    whichCharaterToDelete: {
        es: 'Que personaje quieres eliminar',
        cat: 'Quin personatge vols eliminar?',
    },
    charHasBeenAdded: {
        es: 'se ha añadido a la partida!',
        cat: "s'ha afegit a la partida!",
    },
    charHasBeenRemoved: {
        es: 'se ha eliminado de la partida!',
        cat: "s'ha tret de la partida!",
    },
    cantRemoveChar: {
        es: 'Algo no ha ido bien, no se ha podido eliminar al personaje.',
        cat: "Alguna cosa no ha anat bé, no s'ha pogut eliminar el personatge.",
    },
    noGamesInChat: {
        es: 'Aún no hay puntuaciones en este chat',
        cat: 'Encara no hi ha puntuacions en aquest xat',
    },

    // Bot messages partials
    classificationTitle: {
        es: 'Clasificación actual',
        cat: 'Classificació actual',
    },
    timetrialClassificationTitle: {
        es: 'Contrarrelloj actual',
        cat: 'Contrarrellotge actual',
    },
    name: {
        es: 'Nombre',
        cat: 'Nom',
    },
    points: {
        es: 'Puntos',
        cat: 'Punts',
    },
    pointsLowercase: {
        es: 'puntos',
        cat: 'punts',
    },
    pointLowercase: {
        es: 'punto',
        cat: 'punt',
    },
    time: {
        es: 'Tiempo acc.',
        cat: 'Temps acc.',
    },
    daisRemainingA: {
        es: 'Faltan *',
        cat: 'Falten *',
    },
    daisRemainingB: {
        es: ' dias* para el final de la liga!',
        cat: ' dies* pel final de la lliga!',
    },
    legendTitle: {
        es: '*🧮 Tabla de puntuaciones y reacciones*',
        cat: '*🧮 Taula de puntuacions i reaccions*',
    },
    legendExplain: {
        es: 'Se otorgarán los puntos al mandar los resultados al chat, y se reaccionará al comentario con el emoji correspondiente',
        cat: "S'otorgaran els punts al enviar els resultats al xat, i es reaccionarà al comentari amb l'emoji corresponent",
    },
    finalAdviseTitleA: {
        es: '🐣 *Anuncio importante*\n\nHoy a las ',
        cat: '🐣 *Anunci important*\n\nAvui a les ',
    },
    finalAdviseTitleB: {
        es: ' termina la *',
        cat: ' acaba la ',
    },
    finalAdviseTitleC: {
        es: "Enviad vuestros resultados de hoy _antes de esta hora_!'",
        cat: "Envieu els vostres resultats d'avui _abans d'aquesta hora_!",
    },
    showcaseTitle: {
        es: '_Vitrina virtual con todos los premios que habeis ganado_',
        cat: '_Vitrina virtual amb tots els premis que heu guanyat_',
    },
    showcaseNoTrophie: {
        es: 'Nadie ha ganado ningún premio',
        cat: 'Ningú ha guanyat cap premi',
    },
    monthTrophiesTitle: {
        es: 'Premios en juego en la ',
        cat: 'Premis en joc a la ',
    },
    normalLeague: {
        es: 'Liga normal',
        cat: 'Lliga normal',
    },
    timetrialLeague: {
        es: 'Liga contrarreloj',
        cat: 'Lliga contrarrellotge',
    },
    consolationTrophieMessage: {
        es: '_Habrá premio de consolación para los demás participantes._',
        cat: '_Hi haurà premi de consolació per la resta de participants._',
    },
    endOfLeagueMessageA: {
        es: 'Fin de la',
        cat: 'Final de la',
    },
    endOfLeagueMessageB: {
        es: 'con',
        cat: 'amb',
    },
    endOfLeagueMessageC: {
        es: 'puntos*, recibe el premio',
        cat: 'punts*, rep el premi',
    },
    endOfLeagueMessageD: {
        es: 'con un tiempo acumulado de',
        cat: 'amb un temps acumulat de',
    },
    endOfLeagueMessageE: {
        es: 'recibe el premio',
        cat: 'rep el premi',
    },
    endOfLeagueMessageF: {
        es: 'Los demás os lleváis el premio de consolación,',
        cat: 'La resta us emporteu el premi de consolació,',
    },
    endOfLeagueMessageG: {
        es: 'Enorabuena a todos! 🥳 Y recordad que mañana empieza la ',
        cat: 'Enhorabona a tots! 🥳 I recordeu que demà comença la ',
    },
    endOfLeagueMessageH: {
        es: '_Podéis ver los premios enviando /premios_',
        cat: '_Podeu veure els premis enviant /premis_',
    },
    topTitle: {
        es: '⭐️ *Top 5 mundial*',
        cat: '⭐️ *Top 5 mundial*',
    },
    topNoPlayers: {
        es: 'Aún no hay jugadores este mes',
        cat: 'Encara no hi ha jugadors aquest mes',
    },
}

// Translates the string using translation object
export function t(command: string, lang: lang): string {
    return translations[command][lang]
}
