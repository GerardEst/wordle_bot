<a id="translations"></a>
**CAT** | [ENG](/docs/en/README.md) | [ESP](/docs/es/README.md)

---

<div align="center">
  <img width="200" src="https://raw.githubusercontent.com/GerardEst/moootbot/5f67d158453d6adbf42446fc138680f4f1f431c6/docs/moootbot_profile.png" alt="Foto de perfil de moootbot">
</div>

# moootbot

**_Competeix en lligues mensuals del [Mooot](https://mooot.cat) entre amics._**

Aquest bot transforma qualsevol grup de Telegram en una competició del [Mooot](https://moooot.cat), amb una classificació mensual actualitzada diariament, premis pels millors jugadors, personatges convidats de la cultura catalana, dades interessants sobre la paraula...

[Afegeix el bot a un xat](https://t.me/moootbot?startgroup=true), però abans, convé que veieu l'[ús de dades](#ús-de-dades).

<br>

## Funcionament

Afegeix el bot a un xat existent clicant el link: [Afegeix moootbot a un xat](https://t.me/mooootbot?startgroup=true)

o bé:

1. Crea un grup de Telegram amb la gent amb la que vols compartir les partides
2. Afegeix el bot "moootbot" _(Afegir un membre -> buscar "moootbot")_

<br>

**_El bot començarà a treballar a la sombra, convertint el grup en una lliga i afegint les següents funcionalitats:_**

<br>

### 📊 Classificació mensual dels jugadors

Sempre que un membre del xat hi comparteixi la seva partida, _se li dona una puntuació que pot anar del 0_ (si no ha trobat la paraula) _al 6_ (si l'ha trobat al primer intent). D'aquesta manera _es genera una classificació amb tots els membres del xat_. Cada final de mes es reparteixen premis als membres que hagin quedat al top 3 i es comença una nova lliga amb les puntuacions a 0.

> La classificació es pot consultar en qualsevol moment amb la comanda /classificacio

<br>

### 🏆 Sistema de premis i trofeus virtuals

L'últim dia del mes es reparteixen trofeus als tres millors jugadors. Els trofeus varien depenent de la lliga actual, amb referencies a la cultura catalana, i son independents entre les diferents lligues - és a dir, en cas de participar en varies lligues, els trofeus només els tens dins el xat de la lliga on els hagis guanyat.

> Els trofeus del xat es poden consultar en qualsevol moment amb la comanda /premis

<br>

### 📖 Significat i etimologia de la paraula

Cada dia a les 09:00 s'envia automàticament el resultat del dia anterior, juntament amb el significat de la paraula, la seva etimologia, i la mitjana d'intents que van caldre per resoldre-la.

<br>

### 🥸 Extres famosos

Es poden afegir personatges famosos que jugaran autònomament cada dia i faran més o menys puntuació depenent de la seva habilitat - Jacint Verdaguer té una habilitat de 8/10 i serà molt difícil de guanyar, mentre que en Rovelló quedarà sempre cap a baix de la classificació perquè al cap i a la fi és un gos.

> Es poden afegir els personatges amb la comanda /extres

<br>

### Top mundial

En qualsevol moment es pot consultar el _top 3_ de la lliga actual entre tots els participants de tots els xats.

> Es pot consultar amb la comanda /top

<br>

### Reaccions automàtiques a les puntuacions

Quan es comparteix una partida, el bot reacciona amb un emoji al missatge que varia depenguent de lo bona o dolenta que sigui la partida per donar confirmació visual de que la partida s'ha registrat correctament

<br>

## Comandes disponibles

- `/classificacio` - Mostra la classificació de la lliga actual
- `/puntatge` - Mostra la taula de punts
- `/extres` - Opcions per afegir personatges a la partida
- `/premis` - Consulta els trofeus virtuals guanyats i els que estan en joc
- `/top` - Mostra el top 3 de jugadors de totes les lligues

<br>

## Ús de dades

Al afegir moootbot a un grup, se li dona accés a tots els missatges que es comparteixin a partir d'aquell moment. **Si no fos així, no podria reaccionar ni guardar les partides que se li comparteixen.**

En qualsevol cas, tot i tenir accés teòric, **no es consulta ni es guarda cap missatge que no sigui una partida compartida o una comanda del bot**, com podeu veure al codi font.
