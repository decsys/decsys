const users = {
  async init(data) {
    this.user = {
      roles: {
        admin: window.location.hostname === "localhost"
      }
    };
    if (this.callback) {
      this.callback(this.user);
    }
  },
  get() {
    return this.user;
  },
  subscribe(callback) {
    this.callback = callback;
    return () => {
      this.callback = undefined;
    };
  }
};

export default users;
