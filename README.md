# Keenetic API library

[![Latest Stable Version](https://img.shields.io/npm/v/keenetic-control.svg)](https://www.npmjs.com/package/keenetic-control)
[![Downloads total](https://img.shields.io/npm/dt/keenetic-control.svg)](https://www.npmjs.com/package/keenetic-control)
[![Downloads month](https://img.shields.io/npm/dm/keenetic-control.svg)](https://www.npmjs.com/package/keenetic-control)
[![License](https://img.shields.io/github/license/Toxblh/keenetic-control)](https://www.npmjs.com/package/keenetic-control) 

[![Paypal Donate](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WUAAG2HH58WE4) 
[![Patreon](https://img.shields.io/badge/patreon-support-red.svg)](https://www.patreon.com/toxblh)
[![Boosty](https://img.shields.io/badge/boosty-support-orange.svg)](https://boosty.to/toxblh)

## Installation

`npm install keenetic-control --save`

## Usage

You can try [example code](example.ts)

Once the new instance is initialized, authenticate and then you can use `keenRequest`

```js
import { KeeneticAPI } from "keenetic-control";

const config = {
  ip: "192.168.1.1",
  login: "admin",
  pass: "pa$$word",
};

const keenetic = new KeeneticAPI(config.ip, config.login, config.pass);

keenetic.keenAuth().then((authenticated) => {
  if (authenticated) {
    keenetic
      .keenRequest("rci/show/interface/WifiMaster0")
      .then((response) => response.text())
      .then((text) => console.log(text))
      .catch((err) => console.error(err));
  } else {
    console.error("Authentication failed");
  }
});

```