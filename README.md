# Mision 4

Misión M4 . Full Contact Forms

## Cómo probarlo
Abre index.html en el navegador (o con Live Server). Pulsa «Jugar»:
tienes 30 segundos para aplastar bugs. Tecla secreta: pulsa "n" para
el modo nocturno.

## Uso de IA
Usé Gemini CLI (VS Code) como pareja de programación, fase a fase.
Ejemplo de prompt real: "Propón 4 o 5 fases pequeñas para construir un
whack-a-mole en JS puro; no escribas código todavía".
Verifiqué cada cambio jugando una partida completa antes de aceptar la
siguiente fase, y probé los casos límite (clic en casilla vacía, clic
después del fin de partida).
Escribí a mano: el setTimeout encadenado que hace aparecer los bugs,
que la primera propuesta resolvía con setInterval y no se detenía bien
al acabar la partida.

## Autopsia