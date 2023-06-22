class WAClient {
  state = "Ready";
  isAuthenticated = false;
  constructor(client) {
    this.client = client;
  }
}
module.exports = WAClient;
