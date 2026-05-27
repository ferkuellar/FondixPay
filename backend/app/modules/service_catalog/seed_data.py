from app.modules.service_catalog.constants import STATE_NAMES

CATEGORIES = [
    {"code": "electricity", "name": "Electricidad", "display_order": 1},
    {"code": "telecom", "name": "Telecomunicaciones", "display_order": 2},
    {"code": "mobile_topup_or_bill", "name": "Telefonia movil", "display_order": 3},
    {"code": "internet", "name": "Internet", "display_order": 4},
    {"code": "gas", "name": "Gas", "display_order": 5},
    {"code": "water", "name": "Agua", "display_order": 6},
    {"code": "government", "name": "Gobierno", "display_order": 7},
    {"code": "streaming_or_subscription_future", "name": "Suscripciones futuras", "display_order": 8},
    {"code": "other", "name": "Otros", "display_order": 99},
]

NATIONAL_REFERENCE_COUNT = 38

NATIONAL_REFERENCE_SERVICES = [
    {"name": "CFE Vencidos", "category": "electricity", "icon_key": "electricity"},
    {"name": "CFE Online", "category": "electricity", "icon_key": "electricity"},
    {"name": "Telmex", "category": "telecom", "icon_key": "internet"},
    {"name": "Telcel", "category": "mobile_topup_or_bill", "icon_key": "phone"},
    {"name": "Movistar Postpago", "category": "mobile_topup_or_bill", "icon_key": "phone"},
    {"name": "Netflix", "category": "streaming_or_subscription_future", "icon_key": "other"},
    {"name": "Spotify", "category": "streaming_or_subscription_future", "icon_key": "other"},
    {"name": "Sky", "category": "telecom", "icon_key": "tv"},
    {"name": "Gas LP", "category": "gas", "icon_key": "gas"},
    {"name": "INFONAVIT", "category": "government", "icon_key": "other"},
]

MAP_SERVICES = [
    {"name": "IZZI", "category": "telecom", "states": ["CMX", "MEX", "MOR", "PUE", "HGO", "VER", "OAX", "CHP", "TAB", "CAM", "YUC", "ROO", "GRO", "COL", "JAL", "NAY"]},
    {"name": "Megacable", "category": "telecom", "states": ["JAL", "GTO", "AGS", "COL", "MCH", "QRO", "MEX", "CMX", "SIN", "SON", "NAY", "DGO", "ZAC", "SLP", "HGO"]},
    {"name": "Totalplay", "category": "telecom", "states": ["CMX", "MEX", "NLE", "JAL", "GTO", "PUE", "QRO", "AGS", "COA", "CHH", "TAM", "SLP", "HGO", "MOR"]},
    {"name": "Axtel", "category": "telecom", "states": ["CHH", "COA", "NLE", "TAM", "DGO", "SON", "SIN", "ZAC", "SLP", "AGS", "GTO", "QRO", "CMX", "MEX", "HGO", "JAL"]},
    {"name": "Maxcom", "category": "telecom", "states": ["CMX", "MEX"]},
    {"name": "Cablemas", "category": "telecom", "states": ["JAL", "GTO", "MCH", "AGS", "COL", "NAY", "QRO", "CMX", "MEX"]},
    {"name": "Cablevision", "category": "telecom", "states": ["CMX", "MEX"]},
    {"name": "Multimedios", "category": "telecom", "states": ["NLE", "TAM", "COA", "CHH", "DGO", "ZAC"]},
    {"name": "Telnor", "category": "telecom", "states": ["BCN", "BCS", "SON"]},
    {"name": "Gas del Noreste", "category": "gas", "states": ["NLE", "COA", "TAM", "CHH", "DGO", "ZAC", "SLP", "AGS"]},
    {"name": "Ecogas", "category": "gas", "states": ["NLE", "COA", "TAM", "CHH", "DGO", "SLP", "ZAC"]},
    {"name": "Agua Chihuahua", "category": "water", "states": ["CHH"]},
    {"name": "Agua CDMX", "category": "water", "states": ["CMX"]},
    {"name": "Agua Monterrey", "category": "water", "states": ["NLE"]},
    {"name": "Agua Guadalajara", "category": "water", "states": ["JAL"]},
    {"name": "Agua Puebla", "category": "water", "states": ["PUE"]},
    {"name": "Agua Queretaro", "category": "water", "states": ["QRO"]},
    {"name": "Agua Saltillo", "category": "water", "states": ["COA"]},
    {"name": "Agua Tijuana", "category": "water", "states": ["BCN"]},
    {"name": "Agua Cancun", "category": "water", "states": ["ROO"]},
    {"name": "Agua Acapulco", "category": "water", "states": ["GRO"]},
    {"name": "Agua Celaya", "category": "water", "states": ["GTO"]},
    {"name": "Agua Irapuato", "category": "water", "states": ["GTO"]},
    {"name": "Agua Salamanca", "category": "water", "states": ["GTO"]},
    {"name": "Agua SLP", "category": "water", "states": ["SLP"]},
    {"name": "Agua Torreon", "category": "water", "states": ["COA"]},
    {"name": "Agua Nvo Laredo", "category": "water", "states": ["TAM"]},
    {"name": "Agua Vallarta", "category": "water", "states": ["JAL"]},
    {"name": "Agua Durango", "category": "water", "states": ["DGO"]},
    {"name": "Agua Aguascalientes", "category": "water", "states": ["AGS"]},
    {"name": "Agua Campeche", "category": "water", "states": ["CAM"]},
    {"name": "Agua Progreso", "category": "water", "states": ["YUC"]},
    {"name": "Agua Hidalgo", "category": "water", "states": ["HGO"]},
    {"name": "Tesoreria CHH", "category": "government", "states": ["CHH"]},
    {"name": "Tesoreria ZAC", "category": "government", "states": ["ZAC"]},
    {"name": "Finanzas GTO", "category": "government", "states": ["GTO"]},
    {"name": "Finanzas JAL", "category": "government", "states": ["JAL"]},
    {"name": "Finanzas MEX", "category": "government", "states": ["MEX"]},
    {"name": "Finanzas QRO", "category": "government", "states": ["QRO"]},
    {"name": "Finanzas MCH", "category": "government", "states": ["MCH"]},
    {"name": "Finanzas COA", "category": "government", "states": ["COA"]},
    {"name": "Finanzas TLX", "category": "government", "states": ["TLX"]},
    {"name": "Finanzas TAM", "category": "government", "states": ["TAM"]},
    {"name": "Finanzas OAX", "category": "government", "states": ["OAX"]},
    {"name": "Finanzas HGO", "category": "government", "states": ["HGO"]},
    {"name": "Finanzas TAB", "category": "government", "states": ["TAB"]},
    {"name": "Predial Celaya", "category": "government", "states": ["GTO"]},
    {"name": "Predial Tijuana", "category": "government", "states": ["BCN"]},
    {"name": "Mun. Leon", "category": "government", "states": ["GTO"]},
    {"name": "Mun. Queretaro", "category": "government", "states": ["QRO"]},
    {"name": "Mun. Reynosa", "category": "government", "states": ["TAM"]},
]


def national_states() -> list[str]:
    return list(STATE_NAMES)

