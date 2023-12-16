export const localconfig = {
  getAuth: function (token: string | null) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    };
  }
};