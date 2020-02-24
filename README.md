




Laste opp og deploye nettsiden på serveren
==========================================
Motstanden.no kjører for øyeblikket på *DigitalOcean*. Styremailene for økonomi, web og dirigent har per nå tilgang til MotstandenWeb på *digitalocean.com*.
Denne serveren kjører Ubuntu, og enkleste måten å gjøre endringer er å logge inn via SSH (terminal) til vår Ubuntu-instans (*droplet*). Noen endringer kan også gjøres på webinterfacen til DigitalOcean, og der finnes det også en terminal (men den suger [feb. 2020]).

I korte trekk foregår en deploy slik:
* Du logger inn på serveren med ssh
* Du puller *github*-repositoriet til /MOTSTANDEN/motstanden-website
* Du bygger /build ved å kjøre `sudo npm serverdeploy`
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

Last over kildekoden fra github
-------------------------------
Nå som du er logget inn på serveren, `cd` over til `/MOTSTANDEN/motstanden-website` og kjør
```
sudo git pull https://github.com/MotstandenWeb/motstanden-website
```
for å laste ned kildekoden fra github.
Dette krever brukernavn og passord siden githuben er "private".

Bygge sida fra kildekoden
-------------------------
I mappa `motstanden-website`, kjør kommandoen
```
sudo npm serverdeploy
```
Serverdeploy er et custom script som installerer dependencies og kjører `npm run build`. Å installere dependencies kan også gjøres manuelt ved å kjøre `sudo npm install -g --unsafe-perm=true --allow-root` i `motstanden-website` og `motstanden-website/client`.

Reboot serveren med `sudo reboot`, nettsida skal være oppe igjen etter ca 15 sek.

Feilsøking - Server
===================
For at sida skal funke må:
* Kildekoden funke (funker den lokalt?)
* Dependencies (som refereres til i `package.json`) må være installert på serveren. Se avsnitt over.
* Nettsiden bygget med `npm run build`. Dette skal ha blitt gjort av `serverdeploy`-scriptet.
Dersom nettsida ikke starter opp etter reboot, prøv å kjøre nettsida manuelt med `npm run start`. Om nettsida svarer nå er det bra, men den må settes opp med en *process manager* slik at den automatisk starter når Ubuntu starter.

Vi har brukt *process-manageren* **pm2**. Sjekk om den kjører, f.eks med `htop` eller `pm2 status`. Dersom den allerede gjør det uten at *"motstanden.no"* funker er det noe galt med **pm2**s konfigurasjon. Sjekk dokumentasjon om pm2, config ligger bl.a. i `/etc/systemd/systed/pm2-root.service`.

Dersom den ikke kjører kan du starte den på nytt.
```
sudo su
```
```
sudo pm2 start server.js
```
Årsaken til å starte serveren i root er at alle nå har tilgang til prosessen. Om du starter den i en personlig bruker er det vanskeligere for andre å endre

TODO: refaktor.. selv om dette er vanlig er det kanskje en dårlig idé å kjøre serveren som root...... lage en "web"-user som alle har tilgang til?

Brannmur
--------
Kanskje det er noe galt med brannmuren?
```
ufw status
```

NGINX
-----
Nginx setter opp en reverse proxy fra motstanden.no:80 til localhost:5000
Peker *nginx* riktig?
```
sudo nano /etc/nginx/sites-available/default
```
Denne fila blir også endra (appenda) av **certbot**

Certbot
-------
Certbot er et python-script som setter opp *secure connection*.
Den skal automatisk redirecte til `https`. Dersom dette ikke lenger skjer, kjør:
```
certbot renew
```
Domeneserver
------------
Peker ikke domeneshop.no? Prøv å skrive IP i webbrowser.

Linux shell for dummies
=======================
### Om du har lite erfaring med Linux kan dette være til hjelp.
Alle filene skal ligge i /MOTSTANDEN/motstanden-website. For å komme seg dit bruk
```
cd /MOTSTANDEN/motstanden-website
```
Merk at du kan autocomplete med *tab*, så du trenger ofte bare skrive den første bokstaven i en path.

* `cd` *change directory*
* `cd ..` gå opp et nivå
* `ls` lister filer og mapper
* `ls -la` lister alle (også skjulte, de filene og mappene som starter med et punktum) filer og mapper. Det som står lengst til venstre er lese/skrive/execute-privilegier
* `pwd` *post working directory*, viser hvor du er
* `sudo` kjører en kommando som root (dvs. som admin)
* `sudo !!` utropstegnene representerer den forrige kommandoen du kjørte, hendig om du glemmer å skrive "sudo"
* `mv` brukes for å flytte eller rename en fil
* `cp` som mv, men beholder originalen (kopier)
* `rm` fjerner fil
* `rm -rf` fjerner filer og mapper **r**ekursivt og med **f**orce, denne er skikkelig farlig men må brukes dersom du skal slette en hel mappe og alle filene i den.
* `pushd` brukes som `cd`, men du kan kjøre `popd` for å komme tilbake til mappen du var i originalt
* `reboot` rebooter OS (hele serveren)

Programmer
----------
Alle disse kommandoene er små *programmer* (untatt et par av de enkleste som er funksjoner i *bash*). Du kan finne dem ved å skrive `ls /usr/bin`.
De aller fleste programmer har en manual, vi kan bruke `rm` som eksempel i dette avsnittet. Skriv:
```
man rm
```
for å se en god forklaring på hvordan `rm` brukes. Dette er ofte minst like nyttig som å skrive f.eks `rm --help`.
Du kan også bruke disse kommandoene:
* `whatis rm` søker opp *description* fra alle manualene som passer `rm`
* `which rm` sier hvor programmet ligger
* `apropos remove` søker i manualene etter noe som inneholder *"remove"*. Hendig når du ikke vet navnet på kommandoen men vet hva du vil.
Den siste kommandoen gir en vegg av tekst. Du kan søke etter en *string* med `grep`. Slik *"piper"* du tekst inn i grep:
```
apropos remove | grep rm
```
...finner alle plassene *"rm"* inngår i det forrige outputtet.

Her er noen praktiske programmer:
* `htop` er en *task manager*
* `neofetch` viser litt systeminfo i et nice interface, som OS, uptime, RAM, kernelversjon
* `less` er et leseprogram. `less textfile.txt` åpner *"textfile.txt"*
* `cat` er nice for å lese små tekstfiler, eller sende dem inn i andre filer som f.eks med `cat textfile.txt > newfile.txt`
* `nano` er en enkel teksteditor. Uunværlig for å bruke linux.
  * `nano textfile.txt` åpner *"textfile.txt"* i nano. Lagre med `ctrl + o` eller avslutt med `ctrl + x`
  * Dersom `textfile.txt` ikke eksisterer fra før blir den laget
* `touch filename.py` lager en tom fil, her `filename.py`
  * `echo "print('Hello World')" > filename.py` sender string inn i fil
  * `python filename.py` kjører python-script
* `tmux` er en *"terminal multiplexer"*. Den er ekstremt praktisk siden du kan dele skjermen (terminalen) opp i mindre terminaler og dermed enkelt kjøre mange programmer samtidig.
  * kjør `tmux`
  * bruk `ctrl + b` for å gjøre tmux-hotkeys, f.eks:  
    `ctrl + b + %` splitter terminalen vertikalt  
    `ctrl + b + "` splitter terminalen horisontalt  
    `ctrl + b + piltaster` bytter mellom terminalene  
    `ctrl + b` og så `ctrl + piltaster` resizer den valgte terminalen
    `ctrl + b + z` toggler fullskjerm på én av terminalene  
    `ctrl + b + x` fjerner den markerte terminalen og stopper prosessene i den  
    `ctrl + b + d` *disown* tmux-session, for å få den tilbake bruk `tmux a` for *"attach"*  
  * optional: konfigurer tmux i ~/.tmux.conf så du slipper å trykke ting som `ctrl + b + shift + 5` (default keybindings funker ikke bra på norske tastatur). Hiv dette inn i ~/.tmux.conf
   ```
   bind-key - split-window -v
   bind-key | split-window -h
   ```
   (Bare lag fila om den ikke allerede eksisterer.)

Annen nyttig info
-----------------
`^C` (betyr `ctrl+c`) avbryter et program. Noen programmer (ncurses-type) må avbrytes med `q`.

*Home directory* referer til `/home/USERNAME`, der USERNAME er brukeren du er logget inn med. *Home directory* refereres ofte til med kun en *tilde*: `~/`. Er du logget inn som *root* er det `/root` som er *home directory*. Skriver du `cd` uten argumenter kommer du til `~`

I Ubuntu kan programmer installeres med pakkenedlasteren **apt**, f.eks.: `sudo apt install tmux`. Siden serveren verken kjører en *Display Server* (som xorg) eller en *Desktop Enviroment* (som Gnome) kan du kun kjøre programmer med CLI (*Command Line Interface*). 

En *daemon* er en bakgrunnsprosess, f.eks kjører **pm2** som en *daemon*. De startes av initsystemet (på Ubuntu: *systemd*) og kan konfigureres vha. `systemctl` (avansert).

*Locales* er konfigurasjonen av tegnsett og språk, osv. Kjør `locale` for å se innstillinger. Har du feil tegnsett kan du prøve `loadkeys no-latin1`.

[Sjekk denne guiden om du vil lære mer om ssh](https://youtu.be/hQWRp-FdTpc).
>I en sluttet krets!