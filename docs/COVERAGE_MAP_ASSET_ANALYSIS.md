# Coverage Map Asset Analysis

## Summary

The requested repo path `assets/coverage-map.html` is not present in the current workspace. The matching coverage map asset was found in the external design-system folder:

`C:\Users\ferna\OneDrive\Escritorio\FondixPayDocs\FONDIX PAY Design System\assets\coverage-map.html`

The asset is a D3/TopoJSON interactive map for public coverage visualization. It is useful as landing-page commercial context, but it is not a transactional catalog source and must not decide mobile payment eligibility.

## External Dependencies

- D3.js from CDN.
- TopoJSON from CDN.
- Mexico TopoJSON from `https://cdn.jsdelivr.net/npm/datamaps@0.5.10/src/js/data/mex.topo.json`.

## Required CSS / DOM Structure

The asset defines its own visual layout, including:

- A root app/container region.
- Map surface.
- Tooltip.
- State detail panel.
- Legend.
- Blue choropleth scale.

If moved into the repo later, it should remain a landing asset and should not import mobile/backend/admin runtime code.

## Data Structure

Detected script concepts:

- `NATIONAL`
- `stateNames`
- `normalize`
- `nameMap`
- `getCode(props)`
- `svcs`
- `extras`
- `extraDetail`

`NATIONAL = 38` is used as the national-service baseline. `svcs` contains local/regional services with category, service name, and state codes. `extras` and `extraDetail` derive state totals and state drilldown details.

## Detected Categories

| Category | Local/Regional Services Detected |
|---|---:|
| TELECOMS | 9 |
| GAS | 2 |
| AGUA | 22 |
| GOBIERNO | 18 |

## Detected States

The map includes all 32 Mexico states through state-code normalization. Top local/regional counts detected in the map asset:

| State Code | Local/Regional Count |
|---|---:|
| GTO | 10 |
| CMX | 8 |
| MEX | 8 |
| JAL | 8 |
| COA | 8 |
| TAM | 8 |
| QRO | 7 |
| CHH | 7 |

## Detected Local/Regional Services

| Category | Service | States |
|---|---|---|
| TELECOMS | IZZI | CMX, MEX, MOR, PUE, HGO, VER, OAX, CHP, TAB, CAM, YUC, ROO, GRO, COL, JAL, NAY |
| TELECOMS | Megacable | JAL, GTO, AGS, COL, MCH, QRO, MEX, CMX, SIN, SON, NAY, DGO, ZAC, SLP, HGO |
| TELECOMS | Totalplay | CMX, MEX, NLE, JAL, GTO, PUE, QRO, AGS, COA, CHH, TAM, SLP, HGO, MOR |
| TELECOMS | Axtel | CHH, COA, NLE, TAM, DGO, SON, SIN, ZAC, SLP, AGS, GTO, QRO, CMX, MEX, HGO, JAL |
| TELECOMS | Maxcom | CMX, MEX |
| TELECOMS | Cablemas | JAL, GTO, MCH, AGS, COL, NAY, QRO, CMX, MEX |
| TELECOMS | Cablevision | CMX, MEX |
| TELECOMS | Multimedios | NLE, TAM, COA, CHH, DGO, ZAC |
| TELECOMS | Telnor | BCN, BCS, SON |
| GAS | Gas del Noreste | NLE, COA, TAM, CHH, DGO, ZAC, SLP, AGS |
| GAS | Ecogas | NLE, COA, TAM, CHH, DGO, SLP, ZAC |
| AGUA | Agua Chihuahua | CHH |
| AGUA | Agua CDMX | CMX |
| AGUA | Agua Monterrey | NLE |
| AGUA | Agua Guadalajara | JAL |
| AGUA | Agua Puebla | PUE |
| AGUA | Agua Queretaro | QRO |
| AGUA | Agua Saltillo | COA |
| AGUA | Agua Tijuana | BCN |
| AGUA | Agua Cancun | ROO |
| AGUA | Agua Acapulco | GRO |
| AGUA | Agua Celaya | GTO |
| AGUA | Agua Irapuato | GTO |
| AGUA | Agua Salamanca | GTO |
| AGUA | Agua SLP | SLP |
| AGUA | Agua Torreon | COA |
| AGUA | Agua Nvo Laredo | TAM |
| AGUA | Agua Vallarta | JAL |
| AGUA | Agua Durango | DGO |
| AGUA | Agua Aguascalientes | AGS |
| AGUA | Agua Campeche | CAM |
| AGUA | Agua Progreso | YUC |
| AGUA | Agua Hidalgo | HGO |
| GOBIERNO | Tesoreria CHH | CHH |
| GOBIERNO | Tesoreria ZAC | ZAC |
| GOBIERNO | Finanzas GTO | GTO |
| GOBIERNO | Finanzas JAL | JAL |
| GOBIERNO | Finanzas MEX | MEX |
| GOBIERNO | Finanzas QRO | QRO |
| GOBIERNO | Finanzas MCH | MCH |
| GOBIERNO | Finanzas COA | COA |
| GOBIERNO | Finanzas TLX | TLX |
| GOBIERNO | Finanzas TAM | TAM |
| GOBIERNO | Finanzas OAX | OAX |
| GOBIERNO | Finanzas HGO | HGO |
| GOBIERNO | Finanzas TAB | TAB |
| GOBIERNO | Predial Celaya | GTO |
| GOBIERNO | Predial Tijuana | BCN |
| GOBIERNO | Mun. Leon | GTO |
| GOBIERNO | Mun. Queretaro | QRO |
| GOBIERNO | Mun. Reynosa | TAM |

## Risks

- Remote CDN dependency can break the public map.
- The map is hardcoded and can drift from the provider catalog.
- The map has no provider capability model.
- The map has no Prontipagos validation.
- The map can be misread as payment availability.
- Municipal/government services have high reference-validation variance.
- State-level coverage can hide municipality-level limitations.

## Recommendations

- Keep the map as a landing/commercial asset.
- Do not use the map as payment authority.
- Add disclaimers wherever the map is displayed publicly.
- In Phase 10F, generate public map data from a validated service catalog.
- Keep mobile payment eligibility separate from public coverage visualization.
- Add audit events before any admin can change coverage or provider mappings.

## Phase 10F Runtime Boundary

The existing `landing/assets/coverage_map.html` was not converted to React and was not made payment-authoritative.

Phase 10F added backend `/coverage-map` APIs that expose reference-only coverage data with:

- `reference_only=true`
- `payment_availability_not_guaranteed=true`
- public disclaimer text

The D3 asset remains a landing/reference asset.

