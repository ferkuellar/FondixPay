# Sprint 087 — Blueprint

## File map

```
mobile/src/
├── integrations/tekae/
│   ├── constants.ts          MODIFY — TEKAE_ENABLED from EXPO_PUBLIC_TEKAE_ENABLED
│   └── types.ts              MODIFY — align TekaeSessionResponse to real backend contract
├── services/
│   └── tekaeApi.ts           CREATE — startTekaeSession()
├── screens/payments/
│   └── TekaeSessionScreen.tsx CREATE — loading → browser launch → in-progress → error
├── screens/services/
│   └── ServiceDetailScreen.tsx MODIFY — conditional "Pagar" entry point
└── types/index.ts             MODIFY — add TekaeSession to RootStackParamList

mobile/
└── .env.example               MODIFY — add EXPO_PUBLIC_TEKAE_ENABLED=false
```

Navigator registration (existing navigator file — add `TekaeSession` screen).

---

## 1. `constants.ts` — runtime flag

```ts
import { EXPO_PUBLIC_TEKAE_ENABLED } from '@env'; // or process.env

export const TEKAE_ENABLED: boolean =
  process.env.EXPO_PUBLIC_TEKAE_ENABLED === 'true';
```

Keep `TEKAE_UNAVAILABLE_MESSAGE` and `TEKAE_STATES` unchanged.

---

## 2. `types.ts` — align to real backend contract

Replace `TekaeSessionResponse` with the actual backend fields:

```ts
// What the FondixPay backend actually returns (Sprint 086)
export type TekaeSessionResponse = {
  portalUrl: string;   // Full Tekae responsive URL — open in browser, never store
  expiresIn: number;   // Seconds until token expires (1800)
  sessionRef: string;  // UUID for audit correlation — safe to hold in memory
};

// What mobile sends to the backend
export type TekaeSessionRequest = {
  menu?: string | null;
  categoria?: string | null;
  carrier?: string | null;
  blockview?: boolean;
};
```

Keep `TekaeMenuValue`, `TekaeSessionOutcome`, `TekaeWebhookPayload`, `TekaeErrorResponse` stubs unchanged.
Remove `TekaeSessionReference` (was pre-contract stub — superseded by `sessionRef` in response).

---

## 3. `tekaeApi.ts` — API client

```ts
import { apiRequest } from './api';
import type { TekaeSessionRequest, TekaeSessionResponse } from '../integrations/tekae/types';

export async function startTekaeSession(
  params: TekaeSessionRequest,
  token: string,
): Promise<TekaeSessionResponse> {
  return apiRequest<TekaeSessionResponse>('/api/payments/tekae/session', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(params),
  });
}
```

Error handling: `apiRequest` already propagates 401 to `onUnauthorized` handler and throws with
`detail` from 503 response. No additional wrapping needed.

---

## 4. `TekaeSessionScreen.tsx` — states

Three UI states managed with a local `status` variable:

| State | UI |
|---|---|
| `loading` | `ActivityIndicator` + "Preparando tu sesión de pago..." |
| `in_progress` | "Completando tu pago en el navegador." + "Volver a FONDIXPAY" button |
| `error` | Error message from API + "Reintentar" + "Cancelar" |

**Mount behavior:** call `startTekaeSession()` immediately on mount (no button press needed).

**On success:** call `WebBrowser.openBrowserAsync(portalUrl)`. Transition to `in_progress` state.
Do not await the browser result for payment confirmation — the portal outcome is unknown.

**On error:** set `status = 'error'` with the error message string.

**portalUrl handling:**
- Pass directly to `WebBrowser.openBrowserAsync()`.
- Do not store in component state beyond the local `const` inside the success handler.
- Do not log.

**Navigation params:**
```ts
type Props = NativeStackScreenProps<RootStackParamList, 'TekaeSession'>;
// params: { menu?, categoria?, carrier?, blockview? }
```

---

## 5. `ServiceDetailScreen.tsx` — entry point

Add below the existing "Simular pago" button (not replacing it — both coexist in sandbox):

```tsx
{TEKAE_ENABLED && (service.menu || service.categoria) && (
  <PrimaryButton
    onPress={() => navigation.navigate('TekaeSession', {
      menu: service.menu ?? undefined,
      categoria: service.categoria ?? undefined,
      carrier: service.carrier ?? undefined,
    })}
    variant="primary"
  >
    Pagar con Tekae (sandbox)
  </PrimaryButton>
)}
```

The existing mock "Simular pago" button stays untouched.

---

## 6. `RootStackParamList` — add route

```ts
TekaeSession: {
  menu?: string;
  categoria?: string;
  carrier?: string;
  blockview?: boolean;
};
```

---

## Dependencies check

- `expo-web-browser` — already an Expo SDK package; likely installed. Verify with `npx expo install expo-web-browser` if missing.
- No new native modules that would require a new build.

---

## Test cases (7)

1. `startTekaeSession` returns `TekaeSessionResponse` shape on mocked 200.
2. `startTekaeSession` throws with detail message on mocked 503.
3. `TekaeSessionScreen` renders loading state on mount.
4. `TekaeSessionScreen` calls `WebBrowser.openBrowserAsync` with correct URL on success.
5. `TekaeSessionScreen` transitions to `in_progress` after successful API call.
6. `TekaeSessionScreen` shows error state and "Reintentar" button on API failure.
7. `TekaeSessionScreen` "Reintentar" re-calls the API.
