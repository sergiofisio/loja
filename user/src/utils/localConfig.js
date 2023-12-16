export const localconfig = {};

localconfig.getAuth = function (token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  };
};
