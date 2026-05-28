/* FONDIX CRM — Views (the 7 screens)
   Loaded after crm-atoms.jsx and crm-data.js.
   ------------------------------------------------------- */

const { USERS, TRANSACTIONS, BILLERS, TICKETS, RECONCILIATION,
        CHAT_QUEUE, CHAT_THREAD, KYC_QUEUE,
        TPV_SERIES, CATEGORY_VOLUME, HOURLY, ALERTS, fmt } = window.CRM;

const mxnShort = v => {
  if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v/1_000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
};
const numShort = v => v.toLocaleString('es-MX');

/* =============================================================
   1) DASHBOARD EJECUTIVO
============================================================= */
const ViewDashboard = () => {
  const todayTpv = TPV_SERIES[TPV_SERIES.length - 1].value;
  const yestTpv  = TPV_SERIES[TPV_SERIES.length - 2].value;
  const delta = ((todayTpv - yestTpv) / yestTpv * 100).toFixed(1);
  const last7 = TPV_SERIES.slice(-7).map(d => d.value);
  const openTickets = TICKETS.filter(t => t.status !== 'resolved').length;
  const breachedTickets = TICKETS.filter(t => t.slaBreach).length;
  const todayDiff = RECONCILIATION[0].diff;

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 22}}>
      <ViewHeader
        title="Dashboard"
        sub="Operación en tiempo real · datos del 27 may, 2026"
        actions={<>
          <Btn icon="refresh">Actualizar</Btn>
          <Btn icon="download" variant="primary">Exportar reporte</Btn>
        </>}
      />

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="TPV hoy" value={fmt.mxn(todayTpv).replace('MX$','$')}
             delta={`${delta}%`} deltaTone="success" sub="vs ayer"
             sparkline={<Sparkline data={last7} w={140} h={48}/>}/>
        <KPI label="Transacciones hoy" value={numShort(12847)}
             delta="+6.2%" sub="vs ayer"/>
        <KPI label="Tasa de éxito" value="98.4%"
             delta="-0.3%" deltaTone="danger" sub="↘ CoDi timeouts"/>
        <KPI label="Usuarios activos (7d)" value={numShort(38420)}
             delta="+12.8%" sub="vs semana pasada"/>
        <KPI label="Tickets abiertos" value={String(openTickets)}
             delta={breachedTickets ? `${breachedTickets} sobre SLA` : 'al día'}
             deltaTone={breachedTickets ? 'danger' : 'success'}/>
        <KPI label="Conciliación de hoy" value={todayDiff === 0 ? '✓ Cuadrada' : fmt.mxn(todayDiff)}
             delta={todayDiff === 0 ? 'Sin diferencias' : 'Diferencia detectada'}
             deltaTone={todayDiff === 0 ? 'success' : 'danger'}/>
      </div>

      {/* Charts row */}
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap: 18}} className="charts-row">
        <Card title="TPV · últimos 30 días"
              action={<select className="select-mini" defaultValue="30d">
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
              </select>}>
          <LineChart data={TPV_SERIES} h={260} format={mxnShort}/>
        </Card>

        <Card title="Volumen por categoría · mes">
          <BarsH data={CATEGORY_VOLUME} format={mxnShort}/>
        </Card>
      </div>

      {/* Alerts + Hourly */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 18}} className="charts-row">
        <Card title="Alertas activas" action={<Badge tone="danger" dot>{ALERTS.length} activas</Badge>}>
          <div style={{display:'flex', flexDirection:'column', gap: 10}}>
            {ALERTS.map(a => (
              <div key={a.id} style={{display:'flex', gap:12, padding:'10px 12px',
                                       background:'var(--surf-2)', borderRadius:10,
                                       borderLeft:`3px solid ${a.severity==='danger'?'#EF4444':a.severity==='warn'?'#F59E0B':'#5CB8FF'}`}}>
                <Icon name={a.severity==='info'?'sparkle':'warn'} size={18}
                      style={{color: a.severity==='danger'?'#EF4444':a.severity==='warn'?'#F59E0B':'#5CB8FF', flexShrink:0, marginTop:1}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--fg-1)'}}>{a.title}</div>
                  <div style={{fontSize:12, color:'var(--fg-2)', marginTop:2}}>{a.detail}</div>
                </div>
                <div style={{fontSize:11, color:'var(--fg-3)', whiteSpace:'nowrap'}}>{a.t}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Tráfico por hora · hoy" action={<span style={{fontSize:12, color:'var(--fg-2)'}}>CDMX · GMT-6</span>}>
          <HourlyBars/>
        </Card>
      </div>
    </div>
  );
};

const HourlyBars = () => {
  const max = Math.max(...HOURLY.map(d => d.value));
  return (
    <div style={{display:'flex', alignItems:'flex-end', gap: 3, height: 180, padding:'10px 0'}}>
      {HOURLY.map(h => {
        const isCurrent = h.h === new Date().getHours();
        return (
          <div key={h.h} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4}}>
            <div style={{flex:1, width:'100%', display:'flex', alignItems:'flex-end'}}>
              <div title={`${h.h}:00 — ${mxnShort(h.value)}`}
                   style={{width:'100%', borderRadius:'3px 3px 0 0',
                            height: `${(h.value/max)*100}%`,
                            background: isCurrent ? 'var(--accent)' : 'var(--surf-3)',
                            transition:'background .2s'}}></div>
            </div>
            <div style={{fontSize:9, color:'var(--fg-3)', fontFamily:'var(--font-mono)'}}>{h.h%6===0 ? h.h : ''}</div>
          </div>
        );
      })}
    </div>
  );
};

/* =============================================================
   View header — shared
============================================================= */
const ViewHeader = ({ title, sub, actions }) => (
  <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap: 16, flexWrap:'wrap'}}>
    <div>
      <h1 style={{margin:0, fontSize:24, fontWeight:700, letterSpacing:'-.015em', color:'var(--fg-1)'}}>{title}</h1>
      {sub && <div style={{fontSize:13, color:'var(--fg-2)', marginTop:4}}>{sub}</div>}
    </div>
    {actions && <div style={{display:'flex', gap: 8}}>{actions}</div>}
  </div>
);

/* =============================================================
   2) USUARIOS
============================================================= */
const ViewUsers = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = USERS.filter(u => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.id.includes(query)) return false;
    return true;
  });

  const statusTone = { active:'success', pending:'pending', blocked:'danger' };
  const statusLabel = { active:'Activo', pending:'KYC pendiente', blocked:'Bloqueado' };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Usuarios" sub={`${USERS.length} registrados · ${USERS.filter(u=>u.status==='active').length} activos`}
        actions={<>
          <Btn icon="filter">Filtros</Btn>
          <Btn icon="download">Exportar CSV</Btn>
        </>}/>

      {/* Toolbar */}
      <div style={{display:'flex', gap: 10, alignItems:'center', flexWrap:'wrap'}}>
        <div style={{position:'relative', flex:'1 1 300px', maxWidth: 420}}>
          <Icon name="search" size={16} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--fg-3)'}}/>
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Buscar por nombre o ID…"
                 className="input-base" style={{paddingLeft:36, width:'100%'}}/>
        </div>
        <div style={{display:'flex', gap:0, background:'var(--surf-2)', padding: 3, borderRadius: 10}}>
          {['all','active','pending','blocked'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
              background: statusFilter===s ? 'var(--surf-0)' : 'transparent',
              color: statusFilter===s ? 'var(--fg-1)' : 'var(--fg-2)',
              boxShadow: statusFilter===s ? '0 1px 3px rgba(10,22,40,.08)' : 'none',
              fontFamily:'inherit',
            }}>{s==='all'?'Todos':statusLabel[s]}</button>
          ))}
        </div>
        <div style={{marginLeft:'auto', fontSize:12, color:'var(--fg-2)'}}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>ID</th>
              <th>Estado</th>
              <th>KYC</th>
              <th style={{textAlign:'right'}}>Transacciones</th>
              <th style={{textAlign:'right'}}>Volumen total</th>
              <th>Último acceso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map(u => (
              <tr key={u.id} onClick={() => setSelected(u)} style={{cursor:'pointer'}}>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap: 10}}>
                    <Avatar initials={u.initials} hue={u.avatarHue} size={32}/>
                    <div>
                      <div style={{fontWeight:600, color:'var(--fg-1)'}}>{u.name}</div>
                      <div style={{fontSize:11.5, color:'var(--fg-3)'}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono-cell">{u.id}</span></td>
                <td><Badge tone={statusTone[u.status]} dot>{statusLabel[u.status]}</Badge></td>
                <td>
                  <span style={{display:'inline-flex', gap:2}}>
                    {[1,2,3].map(lv => (
                      <span key={lv} style={{width: 18, height: 5, borderRadius: 2,
                        background: lv <= u.kyc ? 'var(--accent)' : 'var(--surf-3)'}}></span>
                    ))}
                  </span>
                </td>
                <td className="mono-cell" style={{textAlign:'right'}}>{u.txCount}</td>
                <td className="mono-cell" style={{textAlign:'right', fontWeight:600}}>{fmt.mxn(u.tpv).replace('MX$','$')}</td>
                <td style={{color:'var(--fg-2)'}}>{fmt.relTime(u.lastSeen)}</td>
                <td><Icon name="chevron" size={16} style={{color:'var(--fg-3)'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDrawer user={selected} onClose={() => setSelected(null)}/>
    </div>
  );
};

const UserDrawer = ({ user, onClose }) => {
  const userTx = useMemo(
    () => user ? TRANSACTIONS.filter(t => t.userId === user.id).slice(0, 8) : [],
    [user?.id]
  );
  return (
    <Drawer open={!!user} onClose={onClose} title="Detalle de usuario" width={520}>
      {user && (
        <div style={{display:'flex', flexDirection:'column', gap: 22}}>
          <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <Avatar initials={user.initials} hue={user.avatarHue} size={56}/>
            <div style={{flex:1}}>
              <div style={{fontSize:18, fontWeight:700, color:'var(--fg-1)'}}>{user.name}</div>
              <div style={{fontSize:13, color:'var(--fg-2)', display:'flex', gap:10, marginTop:3, flexWrap:'wrap'}}>
                <span>{user.email}</span>
                <span>·</span>
                <span className="mono-cell">{user.id}</span>
              </div>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
            <InfoTile label="Estado" value={
              <Badge tone={user.status==='active'?'success':user.status==='pending'?'pending':'danger'} dot>
                {user.status==='active'?'Activo':user.status==='pending'?'KYC pendiente':'Bloqueado'}
              </Badge>
            }/>
            <InfoTile label="Nivel KYC" value={`Nivel ${user.kyc} de 3`}/>
            <InfoTile label="Teléfono" value={user.phone}/>
            <InfoTile label="Estado (residencia)" value={user.state}/>
            <InfoTile label="Volumen total" value={fmt.mxn(user.tpv).replace('MX$','$')} mono/>
            <InfoTile label="Transacciones" value={String(user.txCount)} mono/>
          </div>

          <div>
            <div style={{fontSize:13, fontWeight:600, color:'var(--fg-1)', marginBottom: 8}}>
              Últimas transacciones
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 6}}>
              {userTx.length === 0 && <div style={{fontSize:13, color:'var(--fg-3)', padding:'12px 0'}}>Sin transacciones recientes.</div>}
              {userTx.map(t => (
                <div key={t.id} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                                          background:'var(--surf-2)', borderRadius:10}}>
                  <div style={{width: 28, height: 28, borderRadius: 8, background: t.biller.color + '22',
                                color: t.biller.color, display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:11, fontWeight:700}}>
                    {t.biller.name.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--fg-1)'}}>{t.biller.name}</div>
                    <div style={{fontSize:11, color:'var(--fg-3)'}}>{fmt.relTime(t.createdAt)}</div>
                  </div>
                  <div style={{fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13.5}}>
                    {fmt.mxn(t.amount).replace('MX$','$')}
                  </div>
                  <TxStatus status={t.status}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex', gap: 8, paddingTop: 8, borderTop:'1px solid var(--border)'}}>
            <Btn icon="mail">Contactar</Btn>
            <Btn icon="shield">Revisar KYC</Btn>
            <Btn variant="danger" icon="warn" style={{marginLeft:'auto'}}>
              {user.status === 'blocked' ? 'Desbloquear' : 'Bloquear cuenta'}
            </Btn>
          </div>
        </div>
      )}
    </Drawer>
  );
};

const InfoTile = ({ label, value, mono }) => (
  <div style={{background:'var(--surf-2)', borderRadius:10, padding:'10px 12px'}}>
    <div style={{fontSize:10.5, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom:4}}>{label}</div>
    <div style={{fontSize:13.5, fontWeight: mono ? 700 : 500, fontFamily: mono ? 'var(--font-mono)' : 'inherit', color:'var(--fg-1)'}}>{value}</div>
  </div>
);

/* =============================================================
   3) TRANSACCIONES
============================================================= */
const ViewTransactions = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = TRANSACTIONS.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.id.includes(q) && !t.userName.toLowerCase().includes(q) && !t.biller.name.toLowerCase().includes(q) && !t.ref.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const totals = useMemo(() => ({
    count: filtered.length,
    volume: filtered.reduce((a,t) => a + (t.status==='success' ? t.amount : 0), 0),
    failed: filtered.filter(t => t.status==='failed').length,
  }), [filtered]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Transacciones" sub="Mostrando últimas 100 transacciones · refrescado al toque"
        actions={<>
          <Btn icon="filter">Más filtros</Btn>
          <Btn icon="download">Exportar</Btn>
        </>}/>

      {/* Mini stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12}}>
        <MiniStat label="En vista" value={totals.count}/>
        <MiniStat label="Volumen exitoso" value={fmt.mxn(totals.volume).replace('MX$','$')} mono/>
        <MiniStat label="Fallidas" value={totals.failed} accent={totals.failed > 0 ? '#EF4444' : null}/>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex', gap: 10, alignItems:'center', flexWrap:'wrap'}}>
        <div style={{position:'relative', flex:'1 1 280px', maxWidth: 380}}>
          <Icon name="search" size={16} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--fg-3)'}}/>
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Buscar por TX ID, usuario, biller, referencia…"
                 className="input-base" style={{paddingLeft:36, width:'100%'}}/>
        </div>
        <div style={{display:'flex', gap:0, background:'var(--surf-2)', padding:3, borderRadius:10}}>
          {[['all','Todas'],['success','Exitosas'],['pending','Pendientes'],['failed','Fallidas'],['refunded','Reembolsos']].map(([k,l]) => (
            <button key={k} onClick={() => setStatusFilter(k)} style={{
              padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize: 12.5, fontWeight: 600,
              background: statusFilter===k ? 'var(--surf-0)' : 'transparent',
              color: statusFilter===k ? 'var(--fg-1)' : 'var(--fg-2)',
              fontFamily:'inherit',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>TX ID</th>
              <th>Hora</th>
              <th>Usuario</th>
              <th>Servicio</th>
              <th style={{textAlign:'right'}}>Monto</th>
              <th>Método</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(t => (
              <tr key={t.id} onClick={() => setSelected(t)} style={{cursor:'pointer'}}>
                <td><span className="mono-cell">{t.id}</span></td>
                <td style={{color:'var(--fg-2)', fontSize:12.5}}>
                  {fmt.timeFmt(t.createdAt)}
                  <div style={{fontSize:11, color:'var(--fg-3)'}}>{fmt.relTime(t.createdAt)}</div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Avatar initials={t.userInitials} hue={210 + (t.userId.charCodeAt(t.userId.length-1) % 80)} size={26}/>
                    <span style={{fontSize:13}}>{t.userName.split(' ').slice(0,2).join(' ')}</span>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:7}}>
                    <span style={{width:8, height:8, borderRadius:2, background: t.biller.color}}></span>
                    {t.biller.name}
                  </div>
                </td>
                <td className="mono-cell" style={{textAlign:'right', fontWeight:600}}>{fmt.mxn(t.amount).replace('MX$','$')}</td>
                <td style={{fontSize:12.5, color:'var(--fg-2)'}}>
                  {t.method === 'card' ? <>Tarjeta ····{t.cardLast4}</> : 'CoDi (SPEI)'}
                </td>
                <td><TxStatus status={t.status}/></td>
                <td><Icon name="chevron" size={16} style={{color:'var(--fg-3)'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionModal tx={selected} onClose={() => setSelected(null)}/>
    </div>
  );
};

const MiniStat = ({ label, value, mono, accent }) => (
  <div style={{background:'var(--surf-1)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px'}}>
    <div style={{fontSize:11, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom:4}}>{label}</div>
    <div style={{fontSize:20, fontWeight:700, fontFamily: mono ? 'var(--font-mono)' : 'inherit', color: accent || 'var(--fg-1)', letterSpacing:'-.01em'}}>{value}</div>
  </div>
);

const TransactionModal = ({ tx, onClose }) => {
  const [refundOpen, setRefundOpen] = useState(false);
  if (!tx) return null;
  return (
    <Modal open={!!tx} onClose={onClose} title={`Transacción ${tx.id}`} width={560}
      footer={<>
        <Btn onClick={onClose}>Cerrar</Btn>
        {tx.status === 'success' && (
          <Btn variant="primary" icon="refund" onClick={() => setRefundOpen(true)}>Reembolsar</Btn>
        )}
        {tx.status === 'pending' && <Btn variant="primary" icon="refresh">Re-procesar</Btn>}
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:18}}>
        <div style={{display:'flex', alignItems:'center', gap:14, paddingBottom:16, borderBottom:'1px solid var(--border)'}}>
          <div style={{width: 52, height: 52, borderRadius: 14, background: tx.biller.color + '22', color: tx.biller.color,
                        display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:18}}>
            {tx.biller.name.slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16, fontWeight:600}}>{tx.biller.name}</div>
            <div style={{fontSize:12, color:'var(--fg-2)', marginTop:2}}>Pagado por {tx.userName}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--font-mono)', fontSize:24, fontWeight:700, letterSpacing:'-.015em'}}>{fmt.mxn(tx.amount).replace('MX$','$')}</div>
            <div style={{marginTop:4}}><TxStatus status={tx.status}/></div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          <InfoTile label="Referencia biller" value={tx.ref} mono/>
          <InfoTile label="Método" value={tx.method === 'card' ? `Tarjeta ····${tx.cardLast4}` : 'CoDi (SPEI)'}/>
          <InfoTile label="Fecha y hora" value={`${fmt.dateFmt(tx.createdAt)} · ${fmt.timeFmt(tx.createdAt)}`}/>
          <InfoTile label="Usuario" value={tx.userName}/>
        </div>

        <div style={{padding:12, background:'var(--surf-2)', borderRadius:10, fontSize:12, color:'var(--fg-2)', lineHeight:1.6}}>
          <strong style={{color:'var(--fg-1)'}}>Línea de tiempo</strong>
          <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:6}}>
            {[
              ['Pago iniciado por el usuario', fmt.relTime(tx.createdAt), 'check'],
              ['Cargo autorizado en pasarela', fmt.relTime(new Date(tx.createdAt.getTime() + 2000)), 'check'],
              [tx.status === 'success' ? 'Pago aplicado al biller' : tx.status === 'pending' ? 'Esperando confirmación del biller' : 'Pago rechazado', fmt.relTime(new Date(tx.createdAt.getTime() + 8000)), tx.status === 'success' ? 'check' : tx.status === 'pending' ? 'sparkle' : 'warn'],
              tx.status === 'success' && ['Comprobante enviado por WhatsApp', fmt.relTime(new Date(tx.createdAt.getTime() + 13000)), 'whatsapp'],
            ].filter(Boolean).map(([txt, t, ic], i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:8}}>
                <Icon name={ic} size={13} style={{color: ic==='warn'?'#EF4444':'#22C55E'}}/>
                <span style={{color:'var(--fg-1)', flex:1}}>{txt}</span>
                <span style={{fontSize:11, color:'var(--fg-3)'}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={refundOpen} onClose={() => setRefundOpen(false)} title="Confirmar reembolso" width={420}
        footer={<>
          <Btn onClick={() => setRefundOpen(false)}>Cancelar</Btn>
          <Btn variant="danger" icon="refund" onClick={() => { setRefundOpen(false); onClose(); }}>Confirmar reembolso</Btn>
        </>}>
        <p style={{margin:0, fontSize:13.5, lineHeight:1.55, color:'var(--fg-1)'}}>
          Vas a reembolsar <strong>{fmt.mxn(tx.amount).replace('MX$','$')}</strong> a <strong>{tx.userName}</strong>.
          Esta acción se notificará por WhatsApp y aplicará a la misma {tx.method==='card'?'tarjeta':'cuenta CoDi'} original
          en un plazo de 24 a 72 horas hábiles.
        </p>
      </Modal>
    </Modal>
  );
};

Object.assign(window, { ViewDashboard, ViewUsers, ViewTransactions, ViewHeader, mxnShort, numShort });
