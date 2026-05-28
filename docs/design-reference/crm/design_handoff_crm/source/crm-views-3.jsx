/* FONDIX CRM — Views part 3: Recibos, Búsqueda, Señales de fraude,
   Disputas, Conciliación Prontipagos, Audit logs
   ------------------------------------------------------- */

const CRM3 = window.CRM;

/* =============================================================
   Mock data específico de estas vistas
============================================================= */
const RECEIPTS = CRM3.TRANSACTIONS.filter(t => t.status === 'success').slice(0, 40).map((t, i) => {
  const channels = ['whatsapp','whatsapp','whatsapp','email','whatsapp'];
  const statuses = ['delivered','delivered','delivered','delivered','delivered','bounced','pending'];
  return {
    id: `REC-${String(2026000 + i).padStart(7,'0')}`,
    tx: t,
    channel: channels[i % channels.length],
    deliveryStatus: statuses[i % statuses.length],
    sentAt: new Date(t.createdAt.getTime() + 12000),
  };
});

const FRAUD_SIGNALS = [
  { id:'FS-2451', user: CRM3.USERS[3],  signal:'Velocidad anormal', detail:'8 intentos de pago en 4 min', score: 87, t: 12, status:'open' },
  { id:'FS-2450', user: CRM3.USERS[14], signal:'Tarjeta en blocklist', detail:'BIN reportado por banco emisor', score: 95, t: 28, status:'blocked' },
  { id:'FS-2449', user: CRM3.USERS[7],  signal:'IP sospechosa', detail:'Conexión vía VPN país de alto riesgo', score: 72, t: 41, status:'review' },
  { id:'FS-2448', user: CRM3.USERS[22], signal:'Múltiples tarjetas', detail:'5 tarjetas distintas en 24 h', score: 68, t: 95, status:'review' },
  { id:'FS-2447', user: CRM3.USERS[31], signal:'Geolocalización inusual', detail:'CDMX → Tijuana en 30 min', score: 54, t: 178, status:'open' },
  { id:'FS-2446', user: CRM3.USERS[5],  signal:'Monto atípico', detail:'$28,400 vs $850 promedio', score: 61, t: 240, status:'review' },
  { id:'FS-2445', user: CRM3.USERS[18], signal:'Email descartable', detail:'tempmail.io detectado', score: 42, t: 320, status:'dismissed' },
  { id:'FS-2444', user: CRM3.USERS[28], signal:'Dispositivo nuevo', detail:'Primer login desde este device', score: 22, t: 380, status:'dismissed' },
];

const DISPUTES = Array.from({length: 18}, (_, i) => {
  const tx = CRM3.TRANSACTIONS[i + 5];
  const reasons = [
    'Cliente reporta cargo no autorizado',
    'Servicio no recibido (biller no aplicó pago)',
    'Cargo duplicado',
    'Monto incorrecto',
    'Producto/servicio diferente al pagado',
  ];
  const banks = ['BBVA','Banamex','Santander','HSBC','Banorte','Scotiabank','Inbursa'];
  const statuses = ['received','received','in_review','in_review','evidence_sent','won','lost'];
  const created = new Date(Date.now() - (i * 18) * 3600000);
  return {
    id: `DSP-${String(8870 - i).padStart(5,'0')}`,
    tx,
    bank: banks[i % banks.length],
    reason: reasons[i % reasons.length],
    status: statuses[i % statuses.length],
    deadline: new Date(created.getTime() + 7 * 86400000),
    createdAt: created,
    representmentAmount: tx.amount,
  };
});

const PP_RECONCILIATION = Array.from({length: 10}, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - i);
  const inAmt = Math.round((2_100_000 + Math.random() * 800_000));
  const diff = i === 2 ? 412.80 : i === 5 ? -89.40 : 0;
  return {
    date: d,
    processorIn: inAmt,
    billersOut: inAmt - diff,
    diff,
    txCount: Math.round(4500 + Math.random() * 1800),
    status: diff === 0 ? 'matched' : 'diff',
  };
});

const AUDIT_LOGS = [
  { t: 4,    user:'Ana Vega',      role:'SUPER_ADMIN', action:'tx.refund',         target:'tx_0847123', detail:'Reembolso manual de $1,247.50 MXN · CFE', sev:'high' },
  { t: 12,   user:'Luis Mora',     role:'OPS',         action:'user.block',         target:'usr_01038',  detail:'Cuenta bloqueada — sospecha de fraude', sev:'high' },
  { t: 35,   user:'Karla Ríos',    role:'COMPLIANCE',  action:'kyc.approve',        target:'usr_01045',  detail:'KYC nivel 3 aprobado tras revisión manual', sev:'normal' },
  { t: 67,   user:'Pedro Ibáñez',  role:'CX',          action:'ticket.close',       target:'TKT-4490',   detail:'Ticket marcado resuelto · reembolso confirmado', sev:'normal' },
  { t: 92,   user:'Ana Vega',      role:'SUPER_ADMIN', action:'env.flag_change',    target:'maintenance', detail:'Maintenance window activado 02:00–04:00', sev:'high' },
  { t: 124,  user:'Sistema',       role:'SYSTEM',      action:'auth.failed_login',  target:'unknown@x.com', detail:'5 intentos fallidos · IP 187.x bloqueada', sev:'medium' },
  { t: 178,  user:'Luis Mora',     role:'OPS',         action:'recon.adjustment',   target:'recon_2026-05-26', detail:'Ajuste manual de $38.20 — diferencia Conekta', sev:'medium' },
  { t: 245,  user:'Karla Ríos',    role:'COMPLIANCE',  action:'kyc.reject',         target:'usr_01052',  detail:'KYC rechazado — selfie no coincide con INE', sev:'normal' },
  { t: 320,  user:'Ana Vega',      role:'SUPER_ADMIN', action:'role.grant',         target:'mauricio@fondix.mx', detail:'Rol OPS otorgado · 14d expiry', sev:'high' },
  { t: 410,  user:'Pedro Ibáñez',  role:'CX',          action:'user.update_email',  target:'usr_01024',  detail:'Email cambiado a solicitud del usuario', sev:'normal' },
  { t: 580,  user:'Sistema',       role:'SYSTEM',      action:'webhook.failed',     target:'cfe.api',    detail:'3 webhooks consecutivos fallidos · retry programado', sev:'medium' },
  { t: 720,  user:'Ana Vega',      role:'SUPER_ADMIN', action:'tx.refund',          target:'tx_0846972', detail:'Reembolso autorizado de $980.00 MXN · Totalplay', sev:'high' },
];

/* =============================================================
   8) PAGOS — alias de Transacciones (reuso del componente)
============================================================= */
const ViewPagos = window.ViewTransactions;

/* =============================================================
   9) RECIBOS
============================================================= */
const ViewRecibos = () => {
  const [channelFilter, setChannelFilter] = useState('all');
  const filtered = RECEIPTS.filter(r => channelFilter === 'all' || r.channel === channelFilter);

  const counts = {
    delivered: RECEIPTS.filter(r => r.deliveryStatus === 'delivered').length,
    pending:   RECEIPTS.filter(r => r.deliveryStatus === 'pending').length,
    bounced:   RECEIPTS.filter(r => r.deliveryStatus === 'bounced').length,
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Recibos"
        sub="Comprobantes generados y enviados al usuario por WhatsApp/email tras cada pago exitoso"
        actions={<>
          <Btn icon="filter">Filtrar</Btn>
          <Btn icon="download">Exportar</Btn>
        </>}/>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12}}>
        <MiniStat label="Enviados hoy" value={RECEIPTS.length}/>
        <MiniStat label="Entregados" value={counts.delivered} accent="#22C55E"/>
        <MiniStat label="Pendientes" value={counts.pending} accent="#F59E0B"/>
        <MiniStat label="Rebotados" value={counts.bounced} accent={counts.bounced ? '#EF4444' : null}/>
      </div>

      <div style={{display:'flex', gap: 10, alignItems:'center'}}>
        <div style={{display:'flex', gap:0, background:'var(--surf-2)', padding: 3, borderRadius: 10}}>
          {[['all','Todos'],['whatsapp','WhatsApp'],['email','Email']].map(([k,l]) => (
            <button key={k} onClick={() => setChannelFilter(k)} style={{
              padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
              background: channelFilter===k ? 'var(--surf-0)' : 'transparent',
              color: channelFilter===k ? 'var(--fg-1)' : 'var(--fg-2)',
              fontFamily:'inherit',
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Recibo</th>
              <th>Usuario</th>
              <th>Servicio</th>
              <th style={{textAlign:'right'}}>Monto</th>
              <th>Canal</th>
              <th>Estado</th>
              <th>Enviado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map(r => (
              <tr key={r.id} style={{cursor:'pointer'}}>
                <td><span className="mono-cell">{r.id}</span></td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:9}}>
                    <Avatar initials={r.tx.userInitials} hue={210 + (r.tx.userId.charCodeAt(r.tx.userId.length-1) % 80)} size={26}/>
                    <span style={{fontSize:13}}>{r.tx.userName.split(' ').slice(0,2).join(' ')}</span>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:7}}>
                    <span style={{width:8, height:8, borderRadius:2, background: r.tx.biller.color}}></span>
                    {r.tx.biller.name}
                  </div>
                </td>
                <td className="mono-cell" style={{textAlign:'right', fontWeight:600}}>{CRM3.fmt.mxn(r.tx.amount).replace('MX$','$')}</td>
                <td><ChannelChip channel={r.channel}/></td>
                <td>
                  {r.deliveryStatus === 'delivered' && <Badge tone="success" dot>Entregado</Badge>}
                  {r.deliveryStatus === 'pending'   && <Badge tone="pending" dot>Pendiente</Badge>}
                  {r.deliveryStatus === 'bounced'   && <Badge tone="danger" dot>Rebotado</Badge>}
                </td>
                <td style={{color:'var(--fg-2)', fontSize:12.5}}>{CRM3.fmt.relTime(r.sentAt)}</td>
                <td>
                  <button className="icon-btn" style={{width:30, height:30}}><Icon name="eye" size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =============================================================
   10) BÚSQUEDA GLOBAL
============================================================= */
const ViewBusqueda = () => {
  const [q, setQ] = useState('');
  const [scope, setScope] = useState('all');

  const lc = q.toLowerCase().trim();
  const hasQuery = lc.length >= 2;

  const userMatches = !hasQuery ? [] : CRM3.USERS.filter(u =>
    u.name.toLowerCase().includes(lc) || u.id.includes(lc) || u.email.toLowerCase().includes(lc) || u.phone.includes(lc)
  ).slice(0, 6);
  const txMatches = !hasQuery ? [] : CRM3.TRANSACTIONS.filter(t =>
    t.id.includes(lc) || t.ref.toLowerCase().includes(lc) || t.userName.toLowerCase().includes(lc) || t.biller.name.toLowerCase().includes(lc)
  ).slice(0, 6);
  const ticketMatches = !hasQuery ? [] : CRM3.TICKETS.filter(t =>
    t.subject.toLowerCase().includes(lc) || t.id.toLowerCase().includes(lc) || t.userName.toLowerCase().includes(lc)
  ).slice(0, 4);
  const receiptMatches = !hasQuery ? [] : RECEIPTS.filter(r =>
    r.id.toLowerCase().includes(lc) || r.tx.userName.toLowerCase().includes(lc)
  ).slice(0, 4);

  const totalHits = userMatches.length + txMatches.length + ticketMatches.length + receiptMatches.length;

  const Filter = ({ k, l, n }) => (
    <button onClick={() => setScope(k)} style={{
      padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
      background: scope===k ? 'var(--surf-0)' : 'transparent',
      color: scope===k ? 'var(--fg-1)' : 'var(--fg-2)',
      fontFamily:'inherit',
    }}>{l} {n != null && <span style={{opacity:.6, marginLeft:4}}>{n}</span>}</button>
  );

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 22}}>
      <ViewHeader title="Búsqueda global"
        sub="Busca en usuarios, pagos, recibos, tickets, disputas y señales de fraude"/>

      <div style={{position:'relative', maxWidth: 720}}>
        <Icon name="search" size={20} style={{position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--fg-3)'}}/>
        <input value={q} onChange={e => setQ(e.target.value)} autoFocus
               placeholder="Email, ID, teléfono, referencia, monto…"
               className="input-base" style={{paddingLeft:48, paddingRight:16, paddingTop:14, paddingBottom:14, fontSize:15, width:'100%'}}/>
      </div>

      {!hasQuery && (
        <div style={{padding:'40px 20px', textAlign:'center', color:'var(--fg-3)', fontSize:13.5}}>
          Escribe al menos 2 caracteres para buscar.
          <div style={{marginTop:14, display:'flex', gap: 8, justifyContent:'center', flexWrap:'wrap'}}>
            {['usr_01023', 'CFE', 'maria.lopez', '+52 33', 'TKT-4498'].map(s => (
              <button key={s} onClick={() => setQ(s)} className="quick-pill">{s}</button>
            ))}
          </div>
        </div>
      )}

      {hasQuery && (
        <>
          <div style={{display:'flex', gap: 0, background:'var(--surf-2)', padding: 3, borderRadius: 10, alignSelf:'flex-start'}}>
            <Filter k="all"     l="Todo"     n={totalHits}/>
            <Filter k="users"   l="Usuarios" n={userMatches.length}/>
            <Filter k="tx"      l="Pagos"    n={txMatches.length}/>
            <Filter k="rec"     l="Recibos"  n={receiptMatches.length}/>
            <Filter k="ticket"  l="Tickets"  n={ticketMatches.length}/>
          </div>

          {(scope === 'all' || scope === 'users') && userMatches.length > 0 && (
            <ResultGroup title="Usuarios" count={userMatches.length}>
              {userMatches.map(u => (
                <ResultRow key={u.id} icon="users" color="#1565E8"
                  primary={u.name} secondary={`${u.email} · ${u.id}`}
                  meta={<Badge tone={u.status==='active'?'success':u.status==='pending'?'pending':'danger'} dot>{u.status}</Badge>}/>
              ))}
            </ResultGroup>
          )}

          {(scope === 'all' || scope === 'tx') && txMatches.length > 0 && (
            <ResultGroup title="Pagos" count={txMatches.length}>
              {txMatches.map(t => (
                <ResultRow key={t.id} icon="tx" color={t.biller.color}
                  primary={`${t.biller.name} · ${CRM3.fmt.mxn(t.amount).replace('MX$','$')}`}
                  secondary={`${t.id} · ${t.userName} · ${CRM3.fmt.relTime(t.createdAt)}`}
                  meta={<TxStatus status={t.status}/>}/>
              ))}
            </ResultGroup>
          )}

          {(scope === 'all' || scope === 'rec') && receiptMatches.length > 0 && (
            <ResultGroup title="Recibos" count={receiptMatches.length}>
              {receiptMatches.map(r => (
                <ResultRow key={r.id} icon="mail" color="#7C3AED"
                  primary={`Recibo ${r.id}`}
                  secondary={`${r.tx.biller.name} · ${r.tx.userName} · ${CRM3.fmt.relTime(r.sentAt)}`}
                  meta={<ChannelChip channel={r.channel}/>}/>
              ))}
            </ResultGroup>
          )}

          {(scope === 'all' || scope === 'ticket') && ticketMatches.length > 0 && (
            <ResultGroup title="Tickets" count={ticketMatches.length}>
              {ticketMatches.map(t => (
                <ResultRow key={t.id} icon="tickets" color="#F59E0B"
                  primary={t.subject}
                  secondary={`${t.id} · ${t.userName} · ${CRM3.fmt.relTime(t.createdAt)}`}
                  meta={<Badge tone={t.status==='resolved'?'success':t.slaBreach?'danger':'pending'} dot>{t.status}</Badge>}/>
              ))}
            </ResultGroup>
          )}

          {totalHits === 0 && (
            <div style={{padding:'40px 20px', textAlign:'center', color:'var(--fg-3)', fontSize:13.5}}>
              Sin resultados para <strong>"{q}"</strong>.
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ResultGroup = ({ title, count, children }) => (
  <div>
    <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 10}}>
      <span style={{fontSize:11, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600}}>{title}</span>
      <span style={{fontSize:11, color:'var(--fg-3)', background:'var(--surf-2)', padding:'1px 7px', borderRadius:99, fontWeight:600}}>{count}</span>
    </div>
    <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 12, overflow:'hidden'}}>
      {children}
    </div>
  </div>
);

const ResultRow = ({ icon, color, primary, secondary, meta }) => (
  <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom:'1px solid var(--border)', cursor:'pointer'}}>
    <div style={{width:34, height:34, borderRadius:10, background: color+'18', color: color,
                   display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Icon name={icon} size={17}/>
    </div>
    <div style={{flex:1, minWidth: 0}}>
      <div style={{fontSize:13.5, fontWeight:600, color:'var(--fg-1)'}}>{primary}</div>
      <div style={{fontSize:12, color:'var(--fg-3)', marginTop:2}}>{secondary}</div>
    </div>
    {meta}
    <Icon name="chevron" size={16} style={{color:'var(--fg-3)'}}/>
  </div>
);

/* =============================================================
   11) SEÑALES DE FRAUDE
============================================================= */
const ViewFraude = () => {
  const [filter, setFilter] = useState('open');
  const filtered = filter === 'all' ? FRAUD_SIGNALS : FRAUD_SIGNALS.filter(s => s.status === filter);

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Señales de fraude"
        sub={`${FRAUD_SIGNALS.filter(s => s.status === 'open').length} señales abiertas · ${FRAUD_SIGNALS.filter(s => s.score > 80).length} de score crítico`}
        actions={<>
          <Btn icon="filter">Reglas</Btn>
          <Btn icon="download">Exportar reporte</Btn>
        </>}/>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12}}>
        <MiniStat label="Abiertas" value={FRAUD_SIGNALS.filter(s => s.status === 'open').length} accent="#EF4444"/>
        <MiniStat label="En revisión" value={FRAUD_SIGNALS.filter(s => s.status === 'review').length} accent="#F59E0B"/>
        <MiniStat label="Bloqueadas" value={FRAUD_SIGNALS.filter(s => s.status === 'blocked').length}/>
        <MiniStat label="Score promedio" value={Math.round(FRAUD_SIGNALS.reduce((a,s)=>a+s.score,0)/FRAUD_SIGNALS.length)}/>
      </div>

      <div style={{display:'flex', gap: 0, background:'var(--surf-2)', padding:3, borderRadius:10, alignSelf:'flex-start'}}>
        {[['all','Todas'],['open','Abiertas'],['review','En revisión'],['blocked','Bloqueadas'],['dismissed','Descartadas']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
            background: filter===k ? 'var(--surf-0)' : 'transparent',
            color: filter===k ? 'var(--fg-1)' : 'var(--fg-2)',
            fontFamily:'inherit',
          }}>{l}</button>
        ))}
      </div>

      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Señal</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Detalle</th>
              <th>Risk score</th>
              <th>Detectada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{cursor:'pointer'}}>
                <td><span className="mono-cell">{s.id}</span></td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:9}}>
                    <Avatar initials={s.user.initials} hue={s.user.avatarHue} size={26}/>
                    <span style={{fontSize:13}}>{s.user.name.split(' ').slice(0,2).join(' ')}</span>
                  </div>
                </td>
                <td>
                  <span style={{fontSize:13, fontWeight:600, color:'var(--fg-1)', display:'inline-flex', alignItems:'center', gap:7}}>
                    <Icon name="warn" size={14} style={{color: s.score > 80 ? '#EF4444' : s.score > 50 ? '#F59E0B' : '#7A95B8'}}/>
                    {s.signal}
                  </span>
                </td>
                <td style={{color:'var(--fg-2)', fontSize:12.5, maxWidth: 280}}>{s.detail}</td>
                <td>
                  <ScoreBar score={s.score}/>
                </td>
                <td style={{color:'var(--fg-2)', fontSize:12.5}}>hace {s.t < 60 ? `${s.t} min` : `${Math.floor(s.t/60)} h`}</td>
                <td>
                  <div style={{display:'flex', gap: 5}}>
                    <button className="icon-btn" style={{width:30, height:30}} title="Revisar"><Icon name="eye" size={14}/></button>
                    <button className="icon-btn" style={{width:30, height:30, color:'#EF4444'}} title="Bloquear usuario"><Icon name="shield" size={14}/></button>
                    <button className="icon-btn" style={{width:30, height:30}} title="Descartar"><Icon name="close" size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ScoreBar = ({ score }) => {
  const color = score > 80 ? '#EF4444' : score > 50 ? '#F59E0B' : score > 30 ? '#7A95B8' : '#22C55E';
  return (
    <div style={{display:'flex', alignItems:'center', gap: 8, width: 110}}>
      <div style={{flex:1, height: 5, background:'var(--surf-3)', borderRadius:99, overflow:'hidden'}}>
        <div style={{height:'100%', width: `${score}%`, background: color, borderRadius: 99}}></div>
      </div>
      <span style={{fontFamily:'var(--font-mono)', fontSize: 12, fontWeight: 700, color, minWidth: 24}}>{score}</span>
    </div>
  );
};

/* =============================================================
   12) DISPUTAS
============================================================= */
const ViewDisputas = () => {
  const open = DISPUTES.filter(d => d.status !== 'won' && d.status !== 'lost');
  const won = DISPUTES.filter(d => d.status === 'won');
  const lost = DISPUTES.filter(d => d.status === 'lost');
  const totalExposure = open.reduce((a,d) => a + d.amount || a + d.representmentAmount, 0);

  const statusBadge = (s) => {
    const map = {
      received:      { tone:'info',    label:'Recibida' },
      in_review:     { tone:'pending', label:'En revisión' },
      evidence_sent: { tone:'info',    label:'Evidencia enviada' },
      won:           { tone:'success', label:'Ganada' },
      lost:          { tone:'danger',  label:'Perdida' },
    };
    const m = map[s];
    return <Badge tone={m.tone} dot>{m.label}</Badge>;
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Disputas"
        sub="Contracargos y reclamos bancarios · plazo de 7 días para enviar evidencia"
        actions={<>
          <Btn icon="filter">Filtros</Btn>
          <Btn icon="download">Exportar evidencia</Btn>
        </>}/>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12}}>
        <MiniStat label="Abiertas" value={open.length} accent="#F59E0B"/>
        <MiniStat label="Exposición total" value={CRM3.fmt.mxn(totalExposure).replace('MX$','$')} mono/>
        <MiniStat label="Ganadas (30d)" value={won.length} accent="#22C55E"/>
        <MiniStat label="Perdidas (30d)" value={lost.length} accent={lost.length > 2 ? '#EF4444' : null}/>
      </div>

      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Disputa</th>
              <th>TX original</th>
              <th>Banco</th>
              <th>Motivo</th>
              <th style={{textAlign:'right'}}>Monto</th>
              <th>Estado</th>
              <th>Vence en</th>
            </tr>
          </thead>
          <tbody>
            {DISPUTES.map(d => {
              const daysLeft = Math.ceil((d.deadline - Date.now()) / 86400000);
              const urgent = daysLeft <= 2 && daysLeft >= 0 && d.status !== 'won' && d.status !== 'lost';
              return (
                <tr key={d.id} style={{cursor:'pointer'}}>
                  <td><span className="mono-cell">{d.id}</span></td>
                  <td><span className="mono-cell">{d.tx.id}</span></td>
                  <td style={{fontSize:13, fontWeight:500}}>{d.bank}</td>
                  <td style={{color:'var(--fg-2)', fontSize:12.5, maxWidth: 280}}>{d.reason}</td>
                  <td className="mono-cell" style={{textAlign:'right', fontWeight:600}}>{CRM3.fmt.mxn(d.representmentAmount).replace('MX$','$')}</td>
                  <td>{statusBadge(d.status)}</td>
                  <td>
                    {(d.status === 'won' || d.status === 'lost') ? (
                      <span style={{color:'var(--fg-3)', fontSize:12}}>—</span>
                    ) : (
                      <span style={{fontSize:12.5, fontWeight: urgent ? 700 : 500, color: urgent ? '#B91C1C' : daysLeft <= 4 ? '#92560A' : 'var(--fg-2)'}}>
                        {daysLeft >= 0 ? `${daysLeft} d` : 'vencido'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =============================================================
   13) CONCILIACIÓN PRONTIPAGOS — clon de la vista de tarjeta
============================================================= */
const ViewConciliacionPP = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const day = PP_RECONCILIATION[selectedDay];
  const billers = CRM3.BILLERS.filter(b => ['cfe','sacmex','siapa','gasnat','ecogas','predial','tenencia'].includes(b.id));
  const breakdown = billers.map((b, i) => {
    const inAmt = Math.round((day.processorIn / billers.length) * (0.8 + (i % 3) * 0.2));
    const outAmt = i === 2 && day.diff !== 0 ? inAmt + day.diff : inAmt;
    return { biller: b, in: inAmt, out: outAmt, diff: outAmt - inAmt };
  });

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Conciliación · Prontipagos"
        sub="Cuadre entre Prontipagos (agregador biller) y servicios pagados"
        actions={<>
          <Btn icon="download">Reporte SAT</Btn>
          <Btn icon="refresh" variant="primary">Re-conciliar</Btn>
        </>}/>

      <div style={{display:'flex', gap:6, overflowX:'auto', paddingBottom:4}}>
        {PP_RECONCILIATION.map((d, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{
            flexShrink: 0, padding:'10px 14px', borderRadius: 12,
            border: i === selectedDay ? '1.5px solid var(--accent)' : '1px solid var(--border)',
            background: i === selectedDay ? 'var(--accent-tint)' : 'var(--surf-0)',
            cursor:'pointer', textAlign:'left', minWidth: 130, fontFamily:'inherit',
          }}>
            <div style={{fontSize:11, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'.04em', fontWeight:600}}>
              {i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : CRM3.fmt.dateFmt(d.date)}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:6, marginTop:6}}>
              {d.status === 'matched'
                ? <Icon name="check" size={14} style={{color:'#22C55E'}}/>
                : <Icon name="warn" size={14} style={{color:'#EF4444'}}/>}
              <span style={{fontSize:12, fontWeight:600, color: d.status==='matched' ? '#15803D' : '#B91C1C'}}>
                {d.status === 'matched' ? 'Cuadrada' : CRM3.fmt.mxn(d.diff).replace('MX$','$')}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12}}>
        <KPI label="Recibido en Prontipagos" value={CRM3.fmt.mxn(day.processorIn).replace('MX$','$')}
             sub={`${day.txCount.toLocaleString('es-MX')} TX`}/>
        <KPI label="Aplicado a servicios" value={CRM3.fmt.mxn(day.billersOut).replace('MX$','$')}/>
        <KPI label="Diferencia" value={day.diff === 0 ? '$0.00' : CRM3.fmt.mxn(day.diff).replace('MX$','$')}
             delta={day.diff === 0 ? 'Sin diferencias' : 'Investigar'}
             deltaTone={day.diff === 0 ? 'success' : 'danger'}/>
        <KPI label="SLA Prontipagos" value="99.1%" delta="±0.1%"/>
      </div>

      <Card title={`Detalle por servicio · ${CRM3.fmt.dateFmt(day.date)}`}>
        <table className="data-table" style={{margin:'-4px -2px'}}>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Categoría</th>
              <th style={{textAlign:'right'}}>Recibido</th>
              <th style={{textAlign:'right'}}>Aplicado</th>
              <th style={{textAlign:'right'}}>Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map(r => (
              <tr key={r.biller.id}>
                <td style={{fontWeight:600}}>
                  <div style={{display:'flex', alignItems:'center', gap: 9}}>
                    <span style={{width:8, height:8, borderRadius:2, background: r.biller.color}}></span>
                    {r.biller.name}
                  </div>
                </td>
                <td style={{color:'var(--fg-2)', fontSize:12.5, textTransform:'capitalize'}}>{r.biller.category}</td>
                <td className="mono-cell" style={{textAlign:'right'}}>{CRM3.fmt.mxn(r.in).replace('MX$','$')}</td>
                <td className="mono-cell" style={{textAlign:'right'}}>{CRM3.fmt.mxn(r.out).replace('MX$','$')}</td>
                <td className="mono-cell" style={{textAlign:'right', color: r.diff === 0 ? 'var(--fg-3)' : '#B91C1C', fontWeight: r.diff !== 0 ? 700 : 400}}>
                  {r.diff === 0 ? '—' : CRM3.fmt.mxn(r.diff).replace('MX$','$')}
                </td>
                <td>{r.diff === 0
                  ? <Badge tone="success" dot>OK</Badge>
                  : <Badge tone="danger" dot>Diferencia</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* =============================================================
   14) AUDIT LOGS
============================================================= */
const ViewAuditLogs = () => {
  const [sev, setSev] = useState('all');
  const filtered = sev === 'all' ? AUDIT_LOGS : AUDIT_LOGS.filter(l => l.sev === sev);

  const sevColor = { high:'#EF4444', medium:'#F59E0B', normal:'#7A95B8' };
  const roleStyle = {
    SUPER_ADMIN: { bg:'rgba(124,58,237,.12)', fg:'#5B21B6' },
    OPS:        { bg:'rgba(21,101,232,.12)', fg:'#0D4FBF' },
    COMPLIANCE: { bg:'rgba(16,185,129,.14)', fg:'#047857' },
    CX:         { bg:'rgba(245,158,11,.14)', fg:'#92560A' },
    SYSTEM:     { bg:'var(--surf-3)',        fg:'var(--fg-2)' },
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Audit logs"
        sub="Trazabilidad completa de acciones administrativas y eventos del sistema"
        actions={<>
          <Btn icon="filter">Filtros avanzados</Btn>
          <Btn icon="download">Exportar (CSV / SIEM)</Btn>
        </>}/>

      <div style={{display:'flex', gap: 10, alignItems:'center'}}>
        <div style={{display:'flex', gap:0, background:'var(--surf-2)', padding:3, borderRadius:10}}>
          {[['all','Todos'],['high','Alta'],['medium','Media'],['normal','Normal']].map(([k,l]) => (
            <button key={k} onClick={() => setSev(k)} style={{
              padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
              background: sev===k ? 'var(--surf-0)' : 'transparent',
              color: sev===k ? 'var(--fg-1)' : 'var(--fg-2)',
              fontFamily:'inherit',
            }}>{l}</button>
          ))}
        </div>
        <div style={{marginLeft:'auto', fontSize:12, color:'var(--fg-2)'}}>
          {filtered.length} eventos · últimas 24 h
        </div>
      </div>

      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <div style={{maxHeight: 700, overflowY:'auto'}}>
          {filtered.map((log, i) => {
            const rs = roleStyle[log.role] || roleStyle.SYSTEM;
            return (
              <div key={i} style={{display:'grid', gridTemplateColumns:'12px 90px 110px 140px 1fr 90px',
                                     gap: 12, alignItems:'center', padding:'13px 16px',
                                     borderBottom: i === filtered.length-1 ? 'none' : '1px solid var(--border)'}}>
                <span style={{width:8, height:8, borderRadius:'50%', background: sevColor[log.sev]}} title={`severidad: ${log.sev}`}></span>
                <span style={{fontSize:11.5, color:'var(--fg-3)', fontFamily:'var(--font-mono)'}}>
                  hace {log.t < 60 ? `${log.t} min` : `${Math.floor(log.t/60)} h`}
                </span>
                <span style={{fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99,
                               background: rs.bg, color: rs.fg, fontFamily:'var(--font-mono)', letterSpacing:'.03em', textAlign:'center'}}>
                  {log.role}
                </span>
                <div style={{fontSize:12.5}}>
                  <div style={{fontWeight:600, color:'var(--fg-1)'}}>{log.user}</div>
                </div>
                <div>
                  <div style={{fontSize:12, fontFamily:'var(--font-mono)', fontWeight:600, color:'var(--fg-2)', marginBottom: 2}}>
                    {log.action} <span style={{color:'var(--fg-3)'}}>→</span> <span style={{color:'var(--accent)'}}>{log.target}</span>
                  </div>
                  <div style={{fontSize:13, color:'var(--fg-1)'}}>{log.detail}</div>
                </div>
                <button className="quick-pill" style={{justifySelf:'end'}}>Ver detalle</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ViewPagos, ViewRecibos, ViewBusqueda, ViewFraude, ViewDisputas, ViewConciliacionPP, ViewAuditLogs });
