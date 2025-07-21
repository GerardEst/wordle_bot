<a id="translations"></a>
[CAT](/README.md) | [ENG](/docs/en/README.md) | **ESP**

<div align="center">
  <img width="200" src="https://raw.githubusercontent.com/GerardEst/moootbot/5f67d158453d6adbf42446fc138680f4f1f431c6/docs/moootbot_profile.png" alt="Foto de perfil de moootbot">
</div>

# moootbot

**_Compite en ligas mensuales de [Mooot](https://mooot.cat) entre amigos._**

Este bot transforma cualquier grupo de Telegram en una competición de [Mooot](https://mooot.cat), con una clasificación mensual actualizada diariamente, premios para los mejores jugadores, personajes invitados de la cultura catalana, datos interesantes sobre la palabra...

[Añade moootbot a un chat](https://t.me/moootbot?startgroup=true), pero antes, conviene que veas el [uso de datos](#uso-de-datos).

<br>

## Funcionamiento

Añade moootbot a un chat existente haciendo clic en el enlace: [Añade moootbot a un chat](https://t.me/moootbot?startgroup=true)

o bien:

1. Crea un grupo de Telegram con la gente con la que quieres compartir las partidas
2. Añade el bot "moootbot" _(Añadir miembro -> buscar "moootbot")_

<br>

**_El bot empezará a trabajar en la sombra, convirtiendo el grupo en una liga y añadiendo las siguientes funcionalidades:_**

<br>

### 📊 Clasificación mensual de los jugadores

Siempre que un miembro del chat comparta su partida, _se le da una puntuación que puede ir del 0_ (si no ha encontrado la palabra) _al 6_ (si la ha encontrado al primer intento). De esta manera _se genera una clasificación con todos los miembros del chat_. Cada final de mes se reparten premios a los miembros que hayan quedado en el top 3 y se empieza una nueva liga con las puntuaciones a 0.

> La clasificación se puede consultar en cualquier momento con el comando /classificacio

<br>

### 🏆 Sistema de premios y trofeos virtuales

El último día del mes se reparten trofeos a los tres mejores jugadores. Los trofeos varían dependiendo de la liga actual, con referencias a la cultura catalana, y son independientes entre las diferentes ligas - es decir, en caso de participar en varias ligas, los trofeos solo los tienes dentro del chat de la liga donde los hayas ganado.

> Los trofeos del chat se pueden consultar en cualquier momento con el comando /premis

<br>

### 📖 Significado y etimología de la palabra

Cada día a las 09:00 se envía automáticamente el resultado del día anterior, junto con el significado de la palabra, su etimología, y la media de intentos que fueron necesarios para resolverla.

<br>

### 🥸 Extras famosos

Se pueden añadir personajes famosos que jugarán autónomamente cada día y harán más o menos puntuación dependiendo de su habilidad - Jacint Verdaguer tiene una habilidad de 8/10 y será muy difícil de ganar, mientras que Rovelló quedará siempre hacia abajo de la clasificación porque al fin y al cabo es un perro.

> Se pueden añadir los personajes con el comando /extres

<br>

### Top mundial

En cualquier momento se puede consultar el _top 3_ de la liga actual entre todos los participantes de todos los chats.

> Se puede consultar con el comando /top

<br>

### Reacciones automáticas a las puntuaciones

Cuando se comparte una partida, el bot reacciona con un emoji al mensaje que varía dependiendo de lo buena o mala que sea la partida para dar confirmación visual de que la partida se ha registrado correctamente

<br>

## Comandos disponibles

- `/classificacio` - Muestra la clasificación de la liga actual
- `/puntatge` - Muestra la tabla de puntos
- `/extres` - Opciones para añadir personajes a la partida
- `/premis` - Consulta los trofeos virtuales ganados y los que están en juego
- `/top` - Muestra el top 3 de jugadores de todas las ligas

<br>

## Uso de datos

Al añadir este bot a un grupo, se le da acceso a todos los mensajes que se compartan a partir de ese momento. **Si no fuera así, no podría reaccionar ni guardar las partidas que se le comparten.**

En cualquier caso, a pesar de tener acceso teórico, **no se consulta ni se guarda ningún mensaje que no sea una partida compartida o un comando del bot**, como puedes ver en el código fuente.
