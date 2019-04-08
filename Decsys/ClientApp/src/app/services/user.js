let user = {
  roles: {
    admin: window.location.hostname === "localhost"
  }
};

let callback;

export const get = () => user;

export const subscribe = cb => {
  callback = cb;
  return () => (callback = undefined);
};
