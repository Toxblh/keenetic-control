import cryptoJS from "crypto-js";

export class KeeneticAPI {
  private ip: string;
  private login: string;
  private pass: string;
  private headers: Headers;

  constructor(ip: string, login: string, pass: string) {
    this.ip = ip;
    this.login = login;
    this.pass = pass;
    this.headers = new Headers({ "Content-Type": "application/json" });
  }
  private updateHeadersFromResponse(response: Response): void {
    const cookie = response.headers.get("Set-Cookie");
    if (cookie) {
      this.headers.set("Cookie", cookie);
    }
  }

  public async keenRequest(
    query: string,
    post: Record<string, any> | null = null
  ): Promise<Response> {
    const url = `http://${this.ip}/${query}`;

    // Передаём сохранённые заголовки
    const options: RequestInit = {
      headers: this.headers,
      method: post ? "POST" : "GET",
    };

    if (post) {
      options.body = JSON.stringify(post);
    }

    const response = await fetch(url, options);

    this.updateHeadersFromResponse(response);

    return response;
  }

  public async keenAuth(): Promise<boolean> {
    let response = await this.keenRequest("auth");

    if (response.status === 401) {
      const realm = response.headers.get("X-NDM-Realm");
      const challenge = response.headers.get("X-NDM-Challenge");

      const md5 = cryptoJS
        .MD5(`${this.login}:${realm}:${this.pass}`)
        .toString();
      const sha = cryptoJS.SHA256(`${challenge}${md5}`).toString();

      response = await this.keenRequest("auth", {
        login: this.login,
        password: sha,
      });

      return response.status === 200;
    } else {
      return response.status === 200;
    }
  }
}

// Example of usage
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
