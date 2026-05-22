import { useCallback, useEffect, useState } from "react";

import type { RequestState } from "../types/admin";

export function useAdminResource<T>(load: () => Promise<T>, dependencies: unknown[] = []) {
  const [state, setState] = useState<RequestState<T>>({ data: null, error: null, loading: true });

  const reload = useCallback(() => {
    setState((current) => ({ ...current, error: null, loading: true }));
    load()
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) =>
        setState({
          data: null,
          error: error instanceof Error ? error.message : "No se pudo cargar esta vista.",
          loading: false,
        }),
      );
  }, dependencies);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
