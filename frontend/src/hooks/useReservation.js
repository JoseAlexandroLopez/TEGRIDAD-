import { useContext } from "react";

import {
  ReservationContext,
} from "../contexts/ReservationContext";

export const useReservation =
  () =>
    useContext(
      ReservationContext
    );