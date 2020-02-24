




Laste opp og deploye nettsiden på serveren
==========================================
Motstanden.no kjører for øyeblikket på DigitalOcean. Styremailene for økonomi, web og dirigent har per nå tilgang til MotstandenWeb på digitalocean.com.
Denne serveren kjører Ubuntu, og enkleste måten å gjøre endringer er å logge inn via SSH (terminal). Noen endringer kan også gjøres på webinterfacen til DigitalOcean, og der finnes det også en terminal (men den suger).

I korte trekk foregår en deploy slik:
* Du logger inn på serveren med ssh
* Du cloner github-repositoriet til /MOTSTANDEN/motstanden-web
* Du kjører bygger /build ved å kjøre `sudo npm serverdeploy`
* Reboot serveren med `sudo reboot`

Logge inn via ssh fra terminal
------------------------------
For å sette opp en ssh-klient er det enklest om noen som allerede har tilgang til serveren legger inn key for deg.
Keyen som skal legges inn er den som blir generert av `ssh-keygen` på Linux og MacOS (ssh er addet i windows 10, men har ikke testa).
I home-directory ligger en skjult `~/.ssh/` -mappe, der finner du `id_rsa` og `id_rsa.pub`.

For at
```
ssh eksempel-bruker@motstanden.no
```
skal funke må innholdet fra din `id_rsa.pub` bli lagt inn i serverens `/home/eksempel-bruker/.ssh/authorized_keys`-fil, der "eksempel-bruker" må være en bruker som finnes på serveren.


[Sjekk denne guiden om du vil lære mer om ssh](https://youtu.be/hQWRp-FdTpc)
Anbefaler å sjekke ut `tmux`, som lar deg åpne flere vinduer i samme terminal.


Last over kildekoden fra github
-------------------------------
Nå som du er logget inn på serveren, `cd` over til `/MOTSTANDEN/motstanden-website` og kjør
```
sudo git clone https://github.com/MotstandenWeb/motstanden-website
```
for å laste ned kildekoden fra github.
Dette krever brukernavn og passord siden githuben er "private".

Bygge sida fra kildekoden
-------------------------
I mappa `motstanden-website`, kjør kommandoen
```
sudo npm serverdeploy
```
Dette skal fungere, 

Dersom det er lagt til flere dependencies, eller om dependencies har blitt sletta fra serveren må du bruke Node Package Manager (npm) til å laste dem ned:
Kjør `sudo npm install -g --unsafe-perm=true --allow-root` i mappene `motstanden-website` og `motstanden-website/client`.





Installerer dependencies globalt på serveren is motstanden-web og
motstanden-web/client
sudo npm install -g --unsafe-perm=true --allow-root

```
npm run serverdeploy
```




Logg inn i root ?? Fordi du ikke ønsker at pm2 skal kjøre på en bruker
eller sudo pm2 osv.....


```
pm2 start server.js
```


>I en sluttet krets!