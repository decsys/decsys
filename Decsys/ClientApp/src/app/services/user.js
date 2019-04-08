let user = {
  roles: {
    admin: window.location.hostname === "localhost"
  },
  instances: JSON.parse(localStorage.getItem("instances")) || {}
};

let callback;

export const get = () => user;

export const subscribe = cb => {
  callback = cb;
  callback(user);
  return () => (callback = undefined);
};

export const storeInstanceParticipantId = (surveyInstanceId, participantId) => {
  user.instances[surveyInstanceId] = participantId;
  localStorage.setItem("instances", JSON.stringify(user.instances));
  callback(user);
};
