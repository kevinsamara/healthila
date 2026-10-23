"use client";

import { useEffect, useState } from "react";
import { estimateShipping } from "./actions";

export type OngkirState = { loading: boolean; fee: number | null; label: string | null; pending: boolean };

/** Debounced ongkir estimate for the typed address (Healthila OS tariff). */
export function useOngkir(address: string): OngkirState {
  const [state, setState] = useState<OngkirState>({ loading: false, fee: null, label: null, pending: false });
  useEffect(() => {
    const a = address.trim();
    if (a.length < 15) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the address is cleared
      setState({ loading: false, fee: null, label: null, pending: false });
      return;
    }
    let live = true;
    setState((s) => ({ ...s, loading: true }));
    const id = setTimeout(async () => {
      const r = await estimateShipping(a).catch(() => null);
      if (!live) return;
      if (r && r.state === "calculated") setState({ loading: false, fee: r.fee, label: r.label, pending: false });
      else setState({ loading: false, fee: null, label: null, pending: true });
    }, 900);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [address]);
  return state;
}
