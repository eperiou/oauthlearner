import Auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";
let _accessToken = "";
// eslint-disable-next-line
let _idToken = "";
let _expiresAt = "";
let _scopes = "";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:courses";
    this.Auth0 = new Auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectURI: process.env.REACT_APP_AUTH0_CALLBACK,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScopes
    });
    console.log(this.Auth0);
  }
  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.Auth0.authorize();
  };
  handleAuthentication = () => {
    this.Auth0.parseHash((err, authresult) => {
      if (authresult && authresult.accessToken && authresult.idToken) {
        debugger;
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
            ? "/"
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.setSession(authresult);
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error ${err.error}. check console`);
        console.log(err);
      }
    });
  };
  setSession = authResult => {
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    _scopes = authResult.requestedScopes || this.requestedScopes || "";

    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;
  };
  isAuthenticated() {
    return new Date().getTime() < _expiresAt;
  }
  logout = () => {
    this.Auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: "http://localhost:3000"
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error("no Access token found");
    }

    return _accessToken;
  };
  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);

    this.Auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.profile = profile;
      cb(profile, err);
    });
  };
  userHasScopes(scopes) {
    const grantedScopes = (_scopes || "").split(" ");
    return scopes.every(scope => grantedScopes.includes(scope));
  }
}
