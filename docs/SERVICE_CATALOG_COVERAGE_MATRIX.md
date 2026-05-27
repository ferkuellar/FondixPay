# Service Catalog Coverage Matrix

## Scope

This matrix captures the initial design baseline for coverage-aware catalog work. It combines the detected coverage map services and the approved Excel coverage reference, but remains conservative: no service is marked `available` or payable until provider capability is confirmed.

Default assumptions for Phase 10E:

- `Source` is documentary/reference only.
- `Coverage Status` is `provider_pending` or `unknown`.
- `Reference Validation`, `Amount Lookup`, `Payment Execution`, and `Receipt` are `to_confirm`.
- `Mobile Payable` is `no`.
- `Admin Visible` is `yes`.

## Matrix

| Category | Service | State | Provider | Provider Code | Source | Coverage Status | Reference Validation | Amount Lookup | Payment Execution | Receipt | Landing Visible | Mobile Payable | Admin Visible | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| electricity | CFE Vencidos | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | National reference does not equal payable. |
| electricity | CFE Online | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Requires provider capability and receipt confirmation. |
| telecom | Telmex | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Existing mock flow must not be treated as production. |
| telecom | Movistar Postpago | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Provider mapping pending. |
| telecom | Nextel | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Provider mapping pending. |
| telecom | Iusacell | national | Prontipagos future | to_confirm | Excel Matrix | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Provider mapping pending. |
| telecom | IZZI | CMX, MEX, MOR, PUE, HGO, VER, OAX, CHP, TAB, CAM, YUC, ROO, GRO, COL, JAL, NAY | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Megacable | JAL, GTO, AGS, COL, MCH, QRO, MEX, CMX, SIN, SON, NAY, DGO, ZAC, SLP, HGO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Totalplay | CMX, MEX, NLE, JAL, GTO, PUE, QRO, AGS, COA, CHH, TAM, SLP, HGO, MOR | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Axtel | CHH, COA, NLE, TAM, DGO, SON, SIN, ZAC, SLP, AGS, GTO, QRO, CMX, MEX, HGO, JAL | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Maxcom | CMX, MEX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Cablemas | JAL, GTO, MCH, AGS, COL, NAY, QRO, CMX, MEX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Cablevision | CMX, MEX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Multimedios | NLE, TAM, COA, CHH, DGO, ZAC | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| telecom | Telnor | BCN, BCS, SON | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Map local/regional service. |
| gas | Gas del Noreste | NLE, COA, TAM, CHH, DGO, ZAC, SLP, AGS | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Gas payment capability must be confirmed. |
| gas | Ecogas | NLE, COA, TAM, CHH, DGO, SLP, ZAC | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Gas payment capability must be confirmed. |
| water | Agua Chihuahua | CHH | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua CDMX | CMX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Monterrey | NLE | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Guadalajara | JAL | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Puebla | PUE | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Queretaro | QRO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Saltillo | COA | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Tijuana | BCN | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Cancun | ROO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Acapulco | GRO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Celaya | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Irapuato | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Salamanca | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua SLP | SLP | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Torreon | COA | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Nvo Laredo | TAM | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Vallarta | JAL | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Durango | DGO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Aguascalientes | AGS | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Campeche | CAM | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Progreso | YUC | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| water | Agua Hidalgo | HGO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Municipal validation likely required. |
| government | Tesoreria CHH | CHH | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Tesoreria ZAC | ZAC | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas GTO | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas JAL | JAL | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas MEX | MEX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas QRO | QRO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas MCH | MCH | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas COA | COA | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas TLX | TLX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas TAM | TAM | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas OAX | OAX | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas HGO | HGO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Finanzas TAB | TAB | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Predial Celaya | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Predial Tijuana | BCN | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Mun. Leon | GTO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Mun. Queretaro | QRO | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| government | Mun. Reynosa | TAM | Prontipagos future | to_confirm | Coverage Map | provider_pending | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Government payment rules require stricter review. |
| streaming_or_subscription_future | Streaming services | national/reference | Prontipagos future | to_confirm | Excel Matrix | unknown | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Future category; not payable in MVP. |
| mobile_topup_or_bill | TAE services | national/reference | Prontipagos future | to_confirm | Excel Matrix | unknown | to_confirm | to_confirm | to_confirm | to_confirm | yes_reference | no | yes | Product rule still requires card-only user payment. |

## Excel Summary

The Excel matrix contains 82 service rows and 32 state columns. Its detected areas are:

| Area | Rows |
|---|---:|
| ENERGIA | 2 |
| TELECOMS | 21 |
| STREAMING | 4 |
| TAE | 9 |
| GAS | 7 |
| AGUA | 21 |
| GOBIERNO | 18 |

The Excel is approved as coverage reference. It still requires normalization into catalog entities and provider capabilities before any service is payable.

## Phase 10F Seed Status

The implementation seeded a conservative subset/representation of national reference services and map local/regional services into backend catalog tables.

Runtime defaults:

- `coverage_status=provider_pending`
- `payable_in_mobile=false`
- `visible_on_mobile=false`
- `visible_on_admin=true`
- `show_in_coverage_map=true`
- provider capability `status=to_confirm`
- no payment execution support
- no receipt support

No row in this matrix is production-payable as of Phase 10F.

