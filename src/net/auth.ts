import axios from 'axios';

interface LoginState {
  username: string;
}

class Auth {
  private static instance: Auth;
  private serverUrl = "http://159.75.220.54:5000";
  loginState: LoginState | null;

  constructor() {
    this.loginState = null;
  }

  static getInstance() {
    return this.instance ?? new Auth();
  }

  logout = () => this.loginState = null;

  loginWithPassword(username: string, password: string) {
    return new Promise((resolve, reject) => {
      axios.post(this.serverUrl + "/user/login", {
        username, password
      }).then((res) => {
        if (res.data === "SUCCESS") {
          this.loginState = { username };
          resolve(res);
        }
        else reject(res);
      })
      .catch((err) => console.log(err))
    })
  }
}

export default Auth;