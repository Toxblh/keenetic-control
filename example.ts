// @ts-nocheck because example
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
