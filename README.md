# Mini Tetris fürs Handy

Ein kleines Tetris-Spiel ohne Installation, Bibliotheken oder Build-Schritt. Mit Touch-Tasten, Pause, Fallvorschau, steigender Geschwindigkeit und lokal gespeichertem Rekord.

## Auf dem Handy öffnen

1. Die Dateien `index.html` und `game.js` auf GitHub in dieses Repository hochladen bzw. committen und pushen.
2. Im Repository **Settings → Pages → Build and deployment → Deploy from a branch** wählen.
3. Den Branch mit diesen Dateien und **/(root)** auswählen und speichern.
4. Sobald GitHub Pages die Veröffentlichung abgeschlossen hat, die dort angezeigte Website-Adresse auf dem Handy öffnen. Bei öffentlichem Repository unter dem Namen Codex ist das üblicherweise `https://miew666.github.io/Codex/`.

GitHub Pages muss für dein Repository und deinen Tarif verfügbar sein. Die Website ist erst nach Veröffentlichung erreichbar; ein GitHub-Dateilink startet das Spiel nicht.

## Lokal starten

Im Repository: `python -m http.server 8000`. Danach im Browser öffnen. Für ein Handy im selben WLAN muss der Server über die LAN-Adresse des PCs erreichbar sein; der PC muss laufen.

## Bedienung

Die Tasten unter dem Spielfeld bewegen, drehen oder senken den Stein. „Ganz runter“ lässt ihn sofort fallen. Auf einer Tastatur: Pfeiltasten, Leertaste und P für Pause. Beim Wechsel in eine andere App pausiert das Spiel automatisch. Der Rekord bleibt nur im jeweiligen Browser gespeichert.
