# NokKlok

Nokklok is an electron-js-react application functioning as a smart alarm clock.

Features:
- a http rest api for a programmable week schedule
- simple design
- alarm override feature
- extra buttons

## General description of the application: 
When the alarm goes of, it send an event message over mqtt. Also, extra buttons can be added that send a mqtt message when clicked.
The alarm can be programmed on a weekly schedule using a rest api, and can also be overwritten on the fly in the interface.

## installation
This application was designed to run on a raspberry pi, but it can also work as a standalone desktop application on any OS that runs nodeJS.

**requirements**:
- nodeJs 12.0 or higher
- mqtt server (optional)

Run `npm install` or `yarn` to install all dependencies. On a raspberry pi, this can take up to several minutes.
After that is complete, run `npm run build` or `yarn build`. After this, you need to set some configuration variables. 
Run `cp .env.dist .env` to create a `.env` file with sensible defaults. Enter your mqtt details if you want to use this. When that is done, the application is ready to be used.

## how to use
Start the application with `npm run election .`