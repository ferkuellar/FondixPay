// FONDIX CRM — Mock data (realistic Mexican fintech operations)
// Attached to window.CRM so JSX files can read it.

(() => {
  // ─── Helpers
  const pad = n => String(n).padStart(2, '0');
  const mxn = n => n.toLocaleString('es-MX', { style:'currency', currency:'MXN', minimumFractionDigits: 2 });
  const dateFmt = d => `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
  const timeFmt = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const relTime = d => {
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return `hace ${Math.floor(diff)}s`;
    if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`;
    return `hace ${Math.floor(diff/86400)} d`;
  };

  // Deterministic RNG so data is stable across reloads
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pick = arr => arr[Math.floor(rand() * arr.length)];
  const int  = (a,b) => Math.floor(rand() * (b-a+1)) + a;

  // ─── Catálogos
  const FIRST_NAMES = ['María','Juan','Sofía','Diego','Valeria','Carlos','Camila','Luis','Daniela','Andrés',
    'Fernanda','Roberto','Paola','Ricardo','Adriana','Miguel','Jimena','José','Regina','Emilio',
    'Mariana','Pablo','Ximena','Alejandro','Renata','Eduardo','Lucía','Sergio','Natalia','Mauricio'];
  const LAST_NAMES = ['García','Hernández','Martínez','López','Rodríguez','González','Pérez','Sánchez',
    'Ramírez','Cruz','Torres','Flores','Rivera','Gómez','Díaz','Reyes','Morales','Vázquez','Ortiz','Castillo'];

  const BILLERS = [
    { id:'cfe',       name:'CFE',         category:'energia',  color:'#F59E0B' },
    { id:'sacmex',    name:'SACMEX',      category:'agua',     color:'#0EA5E9' },
    { id:'siapa',     name:'SIAPA',       category:'agua',     color:'#0EA5E9' },
    { id:'izzi',      name:'Izzi',        category:'wifi',     color:'#22C55E' },
    { id:'totalplay', name:'Totalplay',   category:'wifi',     color:'#22C55E' },
    { id:'megacable', name:'Megacable',   category:'wifi',     color:'#22C55E' },
    { id:'telmex',    name:'Telmex',      category:'wifi',     color:'#22C55E' },
    { id:'telcel',    name:'Telcel',      category:'telefonia',color:'#7C3AED' },
    { id:'movistar',  name:'Movistar',    category:'telefonia',color:'#7C3AED' },
    { id:'gasnat',    name:'Gas Natural', category:'gas',      color:'#F97316' },
    { id:'ecogas',    name:'Ecogas',      category:'gas',      color:'#F97316' },
    { id:'netflix',   name:'Netflix',     category:'streaming',color:'#EC4899' },
    { id:'spotify',   name:'Spotify',     category:'streaming',color:'#EC4899' },
    { id:'predial',   name:'Predial CDMX',category:'gobierno', color:'#10B981' },
    { id:'tenencia',  name:'Tenencia EdoMex', category:'gobierno', color:'#10B981' },
  ];

  const STATES = ['CDMX','Nuevo León','Jalisco','Estado de México','Guanajuato','Querétaro','Puebla','Yucatán','Quintana Roo','Baja California'];

  // ─── Usuarios (60 — suficiente para que la tabla se sienta poblada)
  const USERS = Array.from({length: 60}, (_, i) => {
    const fn = pick(FIRST_NAMES);
    const ln1 = pick(LAST_NAMES);
    const ln2 = pick(LAST_NAMES);
    const name = `${fn} ${ln1} ${ln2}`;
    const initials = (fn[0] + ln1[0]).toUpperCase();
    const signup = new Date(2025, int(0,11), int(1,28));
    const kycRoll = rand();
    const kyc = kycRoll < 0.7 ? 3 : kycRoll < 0.92 ? 2 : 1;
    const statusRoll = rand();
    const status = statusRoll < 0.86 ? 'active' : statusRoll < 0.96 ? 'pending' : 'blocked';
    const txCount = int(1, 240);
    const tpv = txCount * int(50, 4500);
    return {
      id: `usr_${String(1000 + i).padStart(5,'0')}`,
      name, initials,
      email: `${fn.toLowerCase()}.${ln1.toLowerCase()}@gmail.com`.normalize('NFD').replace(/[\u0300-\u036f]/g,''),
      phone: `+52 ${int(33,99)} ${int(1000,9999)} ${int(1000,9999)}`,
      state: pick(STATES),
      status, kyc, signup, txCount, tpv,
      lastSeen: new Date(Date.now() - int(0, 14)*86400000 - int(0, 86400)*1000),
      avatarHue: int(180, 280),
    };
  });

  // ─── Transacciones (100 recientes)
  const TX_STATUSES = ['success','success','success','success','success','success','success','success','success','pending','pending','failed','refunded'];
  const TRANSACTIONS = Array.from({length: 100}, (_, i) => {
    const biller = pick(BILLERS);
    const user = pick(USERS);
    const status = pick(TX_STATUSES);
    const amount = +(rand() * 4800 + 80).toFixed(2);
    const minsAgo = i * int(4, 28);
    return {
      id: `tx_${String(847200 - i).padStart(7,'0')}`,
      ref: `MX${pad(int(0,9))}${pad(int(0,9))}${int(100000, 999999)}`,
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      biller, amount, status,
      method: rand() < 0.62 ? 'card' : 'codi',
      createdAt: new Date(Date.now() - minsAgo * 60000),
      cardLast4: rand() < 0.62 ? String(int(1000,9999)) : null,
    };
  });

  // ─── Tickets
  const TICKET_SUBJECTS = [
    'No me llegó el comprobante',
    'Pago duplicado en CFE',
    'No reconozco un cargo',
    'No se aplicó mi pago de agua',
    'Reembolso pendiente desde hace 3 días',
    'No puedo subir mi INE',
    'CoDi falló pero me cobraron',
    'Error 500 al pagar Telmex',
    'Quiero cambiar mi correo',
    '¿Puedo facturar?',
    'No me llega el código SMS',
    'Cargo de tenencia mal aplicado',
    'Quiero cerrar mi cuenta',
    'El recibo dice otro monto',
    'Soporte para empresas',
    'Ya pagué pero sigue como pendiente',
    'Mi tarjeta no se acepta',
    'No me llegó el SPEI',
  ];
  const CHANNELS = ['chat','whatsapp','email','chat','chat','whatsapp'];
  const TICKET_STATUSES = ['new','in_progress','in_progress','waiting','waiting','resolved'];
  const AGENTS = ['Ana Vega','Luis Mora','Karla Ríos','Pedro Ibáñez','— sin asignar'];
  const TICKETS = Array.from({length: 24}, (_, i) => {
    const user = pick(USERS);
    const status = pick(TICKET_STATUSES);
    const created = new Date(Date.now() - int(0, 72) * 3600000);
    const slaTotalMin = 240; // 4h SLA
    const elapsed = (Date.now() - created.getTime()) / 60000;
    const slaPct = Math.min(100, (elapsed / slaTotalMin) * 100);
    return {
      id: `TKT-${String(4500 - i).padStart(4,'0')}`,
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      subject: pick(TICKET_SUBJECTS),
      channel: pick(CHANNELS),
      status,
      priority: rand() < 0.18 ? 'high' : rand() < 0.55 ? 'medium' : 'low',
      agent: status === 'new' ? '— sin asignar' : pick(AGENTS.slice(0,4)),
      createdAt: created,
      slaPct,
      slaBreach: slaPct > 95 && status !== 'resolved',
    };
  });

  // ─── Conciliación (últimos 10 días)
  const RECONCILIATION = Array.from({length: 10}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const processor = int(3_800_000, 5_400_000) + rand();
    const diff = i === 0 ? 0 : i === 3 ? -1247.50 : i === 6 ? 38.20 : 0;
    return {
      date: d,
      processorIn: processor,
      billersOut: processor - diff,
      diff,
      txCount: int(11000, 14500),
      status: diff === 0 ? 'matched' : 'diff',
    };
  });

  // ─── Chats activos (operations console)
  const CHAT_QUEUE = [
    { id:'c1', user: USERS[3], lastMsg: 'No me llega el SMS y necesito pagar luz hoy', wait: 124, sentiment:'frustrated', unread: 3 },
    { id:'c2', user: USERS[12], lastMsg: '¿Cuánto tarda el reembolso de CFE?', wait: 67, sentiment:'neutral', unread: 1 },
    { id:'c3', user: USERS[7], lastMsg: 'Gracias, ya jaló 🙌', wait: 12, sentiment:'happy', unread: 0 },
    { id:'c4', user: USERS[22], lastMsg: 'Mi pago de Totalplay no se aplica', wait: 235, sentiment:'frustrated', unread: 2 },
    { id:'c5', user: USERS[31], lastMsg: 'Tengo una duda sobre facturas', wait: 8, sentiment:'neutral', unread: 1 },
    { id:'c6', user: USERS[44], lastMsg: '¿En qué estados está disponible?', wait: 41, sentiment:'neutral', unread: 1 },
    { id:'c7', user: USERS[15], lastMsg: 'Quiero subir mi INE pero me marca error', wait: 95, sentiment:'neutral', unread: 2 },
  ];

  const CHAT_THREAD = [
    { from:'user', text:'Hola, hice un pago de Totalplay hace 2 días y no se aplica.', t:'hace 8 min' },
    { from:'bot',  text:'¡Hola Diego! 👋 Veo que tienes un pago a Totalplay del 25/may. Lo estoy verificando…', t:'hace 8 min' },
    { from:'bot',  text:'Tu pago aparece como **completado** de nuestro lado. Voy a escalarte con un agente humano para que revise el detalle.', t:'hace 7 min' },
    { from:'user', text:'Por favor, ya van 2 días y mi internet sigue cortado.', t:'hace 7 min' },
    { from:'user', text:'Mi número de contrato es 5512345678', t:'hace 6 min' },
    { from:'system', text:'⚡ Chat escalado a humano · cola "Pagos no aplicados"', t:'hace 5 min' },
  ];

  // ─── KYC pendientes
  const KYC_QUEUE = Array.from({length: 14}, (_, i) => {
    const user = USERS[20 + i];
    const docType = pick(['INE','Pasaporte','INE']);
    return {
      id: `kyc_${i}`,
      user,
      docType,
      submittedAt: new Date(Date.now() - int(0, 24) * 3600000),
      riskScore: int(5, 92),
      flags: rand() < 0.15 ? ['Selfie no coincide'] : rand() < 0.25 ? ['Documento borroso'] : rand() < 0.1 ? ['Edad < 18'] : [],
    };
  });

  // ─── Series para gráficas
  // TPV últimos 30 días
  const TPV_SERIES = Array.from({length: 30}, (_, i) => {
    const day = 30 - i;
    const base = 3_600_000 + i * 38_000;
    const weekday = ((new Date()).getDay() + i) % 7;
    const dip = (weekday === 0 || weekday === 6) ? 0.78 : 1;
    return {
      day,
      value: Math.round((base + Math.sin(i * 0.8) * 420_000) * dip),
    };
  });

  // Por categoría (mes actual)
  const CATEGORY_VOLUME = [
    { name:'Energía (CFE)',   value: 38_400_000, color:'#F59E0B' },
    { name:'Internet',         value: 22_800_000, color:'#22C55E' },
    { name:'Agua',             value: 14_200_000, color:'#0EA5E9' },
    { name:'Telefonía',        value: 11_900_000, color:'#7C3AED' },
    { name:'Gas',              value: 7_300_000,  color:'#F97316' },
    { name:'Streaming',        value: 4_100_000,  color:'#EC4899' },
    { name:'Gobierno',         value: 9_650_000,  color:'#10B981' },
  ];

  // Volumen por hora (hoy)
  const HOURLY = Array.from({length: 24}, (_, h) => ({
    h,
    value: Math.round(120000 + Math.sin((h - 6) * 0.45) * 95000 + (h >= 9 && h <= 22 ? 80000 : 0) + rand() * 20000),
  }));

  // ─── Alertas
  const ALERTS = [
    { id:1, severity:'danger', title:'Tasa de fallo CoDi > 5%', detail:'Banxico reportó timeouts en últimos 12 min', t:'hace 4 min' },
    { id:2, severity:'warn',   title:'Cola de soporte sobre SLA',  detail:'8 tickets prioridad alta > 4h sin respuesta', t:'hace 22 min' },
    { id:3, severity:'info',   title:'Pico de tráfico CFE',         detail:'+340% vs misma hora ayer (corte de luz Nuevo León)', t:'hace 1 h' },
  ];

  window.CRM = {
    USERS, TRANSACTIONS, BILLERS, TICKETS, RECONCILIATION,
    CHAT_QUEUE, CHAT_THREAD, KYC_QUEUE,
    TPV_SERIES, CATEGORY_VOLUME, HOURLY, ALERTS,
    fmt: { mxn, dateFmt, timeFmt, relTime },
  };
})();
