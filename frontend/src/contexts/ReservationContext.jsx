import {
  createContext,
  useState,
} from "react";

export const ReservationContext =
  createContext();

export const ReservationProvider = ({
  children,
}) => {

  const [reservation,setReservation] =
    useState({
      origin: null,
      destination: null,
      date: null,
      schedule: null,
      bus: null,
      seats: [],
      total: 0,
    });

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        setReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};