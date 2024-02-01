# Laste opp og deploye nettsiden på serveren

[Motstanden.no](https://motstanden.no/) sin server er driftet av [DigitalOcean](https://www.digitalocean.com/).
Her er [web@motstanden.no](mailto:web@motstanden.no) registrert som admin, og er den eneste brukeren som kan gi andre brukere tilgang. 

Selve serveren kjører Ubuntu, og enkleste måten å gjøre endringer er å logge inn via SSH (terminal) til vår Ubuntu-instans (*droplet*). Noen endringer kan også gjøres på webinterfacen til DigitalOcean, og der finnes det også en terminal (men den suger [feb. 2020]).

I korte trekk foregår en deploy slik:
```bash
# Log in to server. (Requires ssh access to have been granted)
ssh webmaster@159.65.84.247

# Go to website directory  
cd /MOTSTANDEN/motstanden-website

# Get newest version
git pull

# Run deploy script
cd server
npm run deploy

# In rare cases, a reboot may be required
sudo reboot
```

# Logge inn via ssh fra terminal
For å sette opp en ssh-klient er det enklest om noen som allerede har tilgang til serveren legger inn key for deg.
Keyen som skal legges inn er den som blir generert av `ssh-keygen`. <!--TODO: Her burde noen legge in en kopierbar komando som man kjøre for å genere en ny ssh nøkkel-->
I home-directory ligger en skjult `~/.ssh/` -mappe, der finner du `id_rsa` og `id_rsa.pub`.

For at
```bash
ssh eksempel-bruker@motstanden.no
```
skal funke må innholdet fra din `id_rsa.pub` bli lagt inn i serverens `/home/eksempel-bruker/.ssh/authorized_keys`-fil, der "eksempel-bruker" må være en bruker som finnes på serveren.

# Feilsøking - Server
For at sida skal funke må:
* Kildekoden funke (funker den lokalt?)
* Alle steg som er definert i `deploy`-scriptet ha kjørt uten feil. Scriptet finner du i [server/package.json](/server/package.json)
* Pm2 må kjøre og fungere

Vi har brukt *process-manageren* [**pm2**](https://pm2.keymetrics.io/). Sjekk om den kjører, f.eks med `htop` eller `pm2 status`. Dersom den allerede gjør det uten at *"motstanden.no"* funker er det noe galt med **pm2**s konfigurasjon. Sjekk dokumentasjon om pm2, config ligger bl.a. i `/etc/systemd/systed/pm2-root.service`.

Dersom den ikke kjører kan du starte den på nytt.
```
sudo su
```
```
sudo pm2 start server.js
```
Årsaken til å starte serveren i root er at alle nå har tilgang til prosessen. Om du starter den i en personlig bruker er det vanskeligere for andre å endre

TODO: refaktor.. selv om dette er vanlig er det kanskje en dårlig idé å kjøre serveren som root...... lage en "web"-user som alle har tilgang til?

## Brannmur
Kanskje det er noe galt med brannmuren?
```bash
ufw status
```

## NGINX
Nginx setter opp en reverse proxy fra motstanden.no:80 til localhost:5000
Peker *nginx* riktig?
```bash
sudo nano /etc/nginx/sites-available/default
```
Denne fila blir også endra (appenda) av **certbot**

## Certbot
Certbot er et python-script som setter opp *secure connection*.
Den skal automatisk redirecte til `https`. Dersom dette ikke lenger skjer, kjør:
```bash
certbot renew
```
Dersom NGINX blir reinstallert (f.eks etter en systemoppgradering), og den ikke lenger peker fra domenet til ipen, kjør:
```bash
sudo certbot --nginx -d motstanden.no -d www.motstanden.no
sudo systemctl restart nginx
```

## Domeneserver
Peker ikke domeneshop.no? Prøv å skrive IP i webbrowser.

# Wiki
## Oppsett/installasjon
MotstandensWiki kjører Mediawiki, som er det samme rammeverket som bl.a. Wikipedia bruker. Vi installerte mediawiki ved å laste ned og pakke ut en *tarball*.

```bash
cd /MOTSTANDEN/wiki/
wget https://releases.wikimedia.org/mediawiki/1.37/mediawiki-1.37.2.tar.gz
tar -xvzf mediawiki-1.37.2.tar.gz 
mv mediawiki-1.37.2.tar.gz/ mediawiki
chown -R www-data:www-data mediawiki
```

Det er flere grunner til at vi endte med å gjøre dette:
* Mediawiki-versjonen som lå i Ubuntus pakkelager var en fire år gammel LTS-release
* Den dro ned masse unødvendige dependencies som *apache2* og *mysql*
* Den spredte filene rundt på systemet

## Nginx som webserver
Det ligger en konfigurasjonsfil for wikien i `/etc/nginx/sites-available/wiki`
Denne fila er aktivert ved at det er laga en symbolsk link i sites-enabled med `ln -s`
```bash
ln -s /etc/nginx/sites-available/wiki /etc/nginx/sites-enabled/
```

## Certbot for ssl-sertifikat
Så lenge nginx-konfigurasjonen stemmer skal det fungere å kjøre
```bash
certbot --nginx -d wiki.motstanden.no
```

## Php 7.4
Php kjører som linuxbrukeren www-data
```bash
systemctl enable php7.4-fpm
```
Vi installerte en del anbefalte pakker.
```bash
sudo apt install imagemagick php7.4-fpm php7.4-intl php7.4-xml php7.4-curl php7.4-gd php7.4-mbstring php7.4-mysql php-apcu
```
## Sqlite3 som database
Php7.4-sqlite3 gir php sqlite-støtte, som vi har valgt for mediawiki.
Databasefila ligger lagra i `/MOTSTANDEN/wiki/data`

## Mobilbrukergrensesnitt
Vi bruker samme metode som Wikipedia bruker, og lar *Extension:MobileFrontend* peke
mobilbrukere til *Skin:Minerva Neue*.
Se [https://www.mediawiki.org/wiki/Extension:MobileFrontend](https://www.mediawiki.org/wiki/Extension:MobileFrontend).

## Extensions, skins og endringer i LocalSettings.php
Konfigurasjonsfila `/MOTSTANDEN/wiki/mediawiki/LocalSettings.php` er global for wikien, og ble originalt generert av *MediaWiki*s installasjons-*wizard*. Endringer i denne trer umiddelbart i kraft, så prøv å kommentere ut endringene dine dersom wikien kræsjer/kun viser en hvit side.

**Og så en ting som nok blir et problem i framtida:** Siden wikien er installert som en tarball (uten å bruke en pakkenedlaster som **apt**) er ikke dependencies registrert. For øyeblikket (april 2022) er disse pakkene registrert som ikke påkrevd (*orphans*):

>Følgende pakker ble automatisk installert og er ikke lenger påkrevet:
> daemon default-mysql-server libcgi-fast-perl libcgi-pm-perl libencode-locale-perl libevent-core-2.1-7
> libevent-pthreads-2.1-7 libfcgi-perl libhtml-parser-perl libhtml-tagset-perl libhtml-template-perl
> libhttp-date-perl libhttp-message-perl libio-html-perl liblwp-mediatypes-perl libmecab2 libtimedate-perl
> liburi-perl mecab-ipadic mecab-ipadic-utf8 mecab-utils mediawiki-classes mysql-client-8.0 mysql-client-core-8.0
> mysql-common mysql-server-8.0 mysql-server-core-8.0 php php-curl php-intl php-mbstring php-mysql php-wikidiff2
> php-xml php7.4

Om noen kjører **apt clean**, **autoclean** eller **autoremove** i framtida vil en del pakker som er nødvendige for wikien bli avinstallert, men det er bare å installere de igjen (php-pakkene i lista over, untatt de som har noe med *mysql* å gjøre).


# Linux shell for dummies
Om du har lite erfaring med Linux kan dette være til hjelp.

## Grunnlegende
Alle filene skal ligge i `/MOTSTANDEN/motstanden-website`. For å komme seg dit bruk
```bash
cd /MOTSTANDEN/motstanden-website
```
Merk at du kan autocomplete med *tab*, så du trenger ofte bare skrive den første bokstaven i en path.

* `cd` *change directory*
* `cd ..` gå opp et nivå
* `ls` lister filer og mapper
* `ls -la` lister alle (også skjulte, de filene og mappene som starter med et punktum) filer og mapper. Det som står lengst til venstre er lese/skrive/execute-privilegier
* `pwd` *post working directory*, viser hvor du er
* `sudo` *super user do*, kjører en kommando som root (dvs. som admin)
* `sudo !!` utropstegnene representerer den forrige kommandoen du kjørte, hendig om du glemmer å skrive "sudo"
* `mv` **m***o***v***e*, brukes for å flytte eller rename en fil
* `cp` **c***o***p***y*, som mv, men beholder originalen (kopier)
* `rm` **r***e***m***ove*, fjerner fil
* `rm -rf` fjerner filer og mapper **r**ekursivt og med **f**orce, denne er skikkelig farlig men må brukes dersom du skal slette en hel mappe og alle filene i den.
* `pushd` brukes som `cd`, men du kan kjøre `popd` for å komme tilbake til mappen du var i originalt
* `reboot` rebooter OS (hele serveren)

## Programmer

Alle disse kommandoene er små *programmer* (untatt et par av de enkleste som er funksjoner i *bash*). Du kan finne dem ved å skrive `ls /usr/bin`.
De aller fleste programmer har en manual, vi kan bruke `rm` som eksempel i dette avsnittet. Skriv:
```bash
man rm
```
for å se en god forklaring på hvordan `rm` brukes. Dette er ofte minst like nyttig som å skrive f.eks `rm --help`.
Du kan også bruke disse kommandoene:
* `whatis rm` søker opp *description* fra alle manualene som passer `rm`
* `which rm` sier hvor programmet ligger
* `apropos remove` søker i manualene etter noe som inneholder *"remove"*. Hendig når du ikke vet navnet på kommandoen men vet hva du vil.
Den siste kommandoen gir en vegg av tekst. Du kan søke etter en *string* med `grep`. Slik *"piper"* du tekst inn i grep:
```bash
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

## Annen nyttig info
`^C` (betyr `ctrl+c`) avbryter et program. Noen programmer (ncurses-type) må avbrytes med `q`.

*Home directory* referer til `/home/USERNAME`, der USERNAME er brukeren du er logget inn med. *Home directory* refereres ofte til med kun en *tilde*: `~/`. Er du logget inn som *root* er det `/root` som er *home directory*. Skriver du `cd` uten argumenter kommer du til `~`

I Ubuntu kan programmer installeres med pakkenedlasteren **apt**, f.eks.: `sudo apt install tmux`. Siden serveren verken kjører en *Display Server* (som xorg) eller en *Desktop Enviroment* (som Gnome) kan du kun kjøre programmer med CLI (*Command Line Interface*). 

En *daemon* er en bakgrunnsprosess, f.eks kjører **pm2** som en *daemon*. De startes av initsystemet (på Ubuntu: *systemd*) og kan konfigureres vha. `systemctl` (avansert).

*Locales* er konfigurasjonen av tegnsett og språk, osv. Kjør `locale` for å se innstillinger. Har du feil tegnsett kan du prøve `loadkeys no-latin1`.

[Sjekk denne guiden om du vil lære mer om ssh](https://youtu.be/hQWRp-FdTpc).
>I en sluttet krets!
