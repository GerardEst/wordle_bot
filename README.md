# motbot

## Introducció

Motbot està pensat per poder competir en lligues mensuals d'ElMot (https://gelozp.com/games/elmot/) entre amics, simplement creant un grup de Telegram i afegint el bot "motbot".

### Funcionament
- Crea un grup de Telegram amb la gent amb la que vols compartir les partides
- Afegeix el bot "motbot" (Afegir un membre -> buscar "motbot")
El bot començarà a treballar a la sombra, convertint el grup en una lliga on tindreu:

- *📊 Classificació mensual dels jugadors*
Els membres del grup hi comparteixen la seva partida diariament i se'ls hi dona una puntuació del 0 (si no s'ha trobat la paraula) al 6 (si s'ha fet a la primera).

La classificació es pot consultar en qualsevol moment amb la comanda /classificacio.
Cada mes tornen tots els punts a 0 i comença una nova lliga.

- *🏆 Sistema de premis i trofeus virtuals*
L'últim dia del mes es donen premis als tres millors jugadors, els premis varien depenent de la lliga actual, son acumulables i es poden consultar en qualsevol moment amb la comanda /premis.

Les lligues i els premis s'inspiren en el mes de la lliga, per tant no guanyarem una medalla genèrica sino, potser, un Petac durant la lliga del Raig (al Maig) o una Ratafia durant la lliga Major (a l'Agost).

- *🥸 Extres famosos*
Es poden afegir personatges que jugaran autònomament cada dia i faran més o menys puntuació depenent de la seva habilitat.

Jacint Verdaguer té una habilitat de 8/10 i serà molt difícil de guanyar, mentre que en Rovelló quedarà sempre cap a baix de la classificació perquè al cap i a la fi és un gos.
Es poden afegir els personatges amb la comanda /extres.

- *🔝 Top mundial*
En qualsevol moment es pot consultar el *top 3* de la lliga actual entre tots els participants de tots els xats.

- *🎮 Reaccions automàtiques a les puntuacions*
Quan es comparteix una partida, el bot reacciona amb un emoji al missatge depenguent de lo bona que sigui la partida i per donar confirmació visual de que la partida s'ha registrat correctament.


### Comandes disponibles

- `/classificacio` - Mostra la classificació de la lliga actual
- `/puntatge` - Mostra la taula de punts
- `/extres` - Opcions per afegir personatges a la partida
- `/premis` - Consulta els trofeus virtuals guanyats i els que estan en joc
- `/top` - Mostra el top 3 de jugadors de totes les lligues

