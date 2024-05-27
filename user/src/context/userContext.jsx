import { toastFail } from "./toast";
import React, { createContext, useState } from "react";
import axios from "../Service/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [address, setAdressUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      const {
        data: { user, adresses, orders },
      } = await axios.get(
        `/infoUser/${await AsyncStorage.getItem("usuarioId")}`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
      if (adresses !== undefined) {
        setAdressUser({
          id: adresses[0].id,
          zip_code: adresses[0].zip_code,
          line_1: adresses[0].line_1,
          line_2: adresses[0].line_2,
          city: adresses[0].city,
          state: adresses[0].state,
          country: "BR",
        });
      }
      setUser({
        ...user,
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        phone: `+${user.phones.mobile_phone.country_code} (${
          user.phones.mobile_phone.area_code
        }) ${user.phones.mobile_phone.number.slice(
          0,
          5
        )}-${user.phones.mobile_phone.number.slice(5)}`,
      });
      setOrders(orders);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 408) {
        toastFail(error.response.data.error);
        await AsyncStorage.clear();
        navigate("/");
      }
    }
  };

  return (
    <UserContext.Provider
      value={{ user, address, orders, loading, getUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
