/* FONDIX CRM — Views part 2: Conciliación, Tickets, Chat Console, Compliance KYC
   ------------------------------------------------------- */

const { ViewHeader: VH2, mxnShort: mxnShort2, numShort: numShort2 } = window;
const CRM = window.CRM;

/* =============================================================
   4) CONCILIACIÓN BANCARIA
============================================================= */
const ViewReconciliation = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const day = CRM.RECONCILIATION[selectedDay];

  // Build per-biller breakdown for the selected day (mock)
  const breakdown = CRM.BILLERS.slice(0, 8).map((b, i) => {
    const inAmt = Math.round((day.processorIn / 12) * (0.8 + (i % 3) * 0.18));
    const outAmt = i === 3 && day.diff !== 0 ? inAmt + day.diff : inAmt;
    return { biller: b, in: inAmt, out: outAmt, diff: outAmt - inAmt };
  });

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Conciliación bancaria"
        sub="Cuadre diario entre pasarela (Conekta) y billers (CFE, SACMEX, etc.)"
        actions={<>
          <Btn icon="download">Exportar XML</Btn>
          <Btn icon="refresh" variant="primary">Re-conciliar</Btn>
        </>}/>

      {/* Day strip */}
      <div style={{display:'flex', gap:6, overflowX:'auto', paddingBottom: 4}}>
        {CRM.RECONCILIATION.map((d, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{
            flexShrink: 0, padding:'10px 14px', borderRadius: 12,
            border: i === selectedDay ? '1.5px solid var(--accent)' : '1px solid var(--border)',
            background: i === selectedDay ? 'var(--accent-tint)' : 'var(--surf-0)',
            cursor:'pointer', textAlign:'left', minWidth: 130, fontFamily:'inherit',
          }}>
            <div style={{fontSize:11, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'.04em', fontWeight:600}}>
              {i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : CRM.fmt.dateFmt(d.date)}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:6, marginTop:6}}>
              {d.status === 'matched'
                ? <Icon name="check" size={14} style={{color:'#22C55E'}}/>
                : <Icon name="warn" size={14} style={{color:'#EF4444'}}/>}
              <span style={{fontSize:12, fontWeight:600, color: d.status==='matched' ? '#15803D' : '#B91C1C'}}>
                {d.status === 'matched' ? 'Cuadrada' : CRM.fmt.mxn(d.diff).replace('MX$','$')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12}} className="kpi-grid">
        <KPI label="Recibido en pasarela" value={CRM.fmt.mxn(day.processorIn).replace('MX$','$')}
             sub={`${numShort2(day.txCount)} TX procesadas`}/>
        <KPI label="Pagado a billers" value={CRM.fmt.mxn(day.billersOut).replace('MX$','$')}/>
        <KPI label="Diferencia" value={day.diff === 0 ? '$0.00' : CRM.fmt.mxn(day.diff).replace('MX$','$')}
             delta={day.diff === 0 ? 'Sin diferencias' : 'Investigar'}
             deltaTone={day.diff === 0 ? 'success' : 'danger'}/>
        <KPI label="Tasa de éxito" value={`${(day.txCount > 13000 ? 98.6 : 97.9).toFixed(1)}%`}
             delta="±0.2% vs promedio" sub="ventana 30d"/>
      </div>

      {/* Breakdown table */}
      <Card title={`Detalle por biller · ${CRM.fmt.dateFmt(day.date)}`}
            action={<span style={{fontSize:12, color:'var(--fg-2)'}}>8 billers</span>}>
        <table className="data-table" style={{margin:'-4px -2px'}}>
          <thead>
            <tr>
              <th>Biller</th>
              <th>Categoría</th>
              <th style={{textAlign:'right'}}>Recibido</th>
              <th style={{textAlign:'right'}}>Pagado</th>
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
                <td className="mono-cell" style={{textAlign:'right'}}>{CRM.fmt.mxn(r.in).replace('MX$','$')}</td>
                <td className="mono-cell" style={{textAlign:'right'}}>{CRM.fmt.mxn(r.out).replace('MX$','$')}</td>
                <td className="mono-cell" style={{textAlign:'right', color: r.diff === 0 ? 'var(--fg-3)' : '#B91C1C', fontWeight: r.diff !== 0 ? 700 : 400}}>
                  {r.diff === 0 ? '—' : CRM.fmt.mxn(r.diff).replace('MX$','$')}
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
   5) TICKETS / SOPORTE
============================================================= */
const ViewTickets = () => {
  const columns = [
    { key:'new',         title:'Nuevos',         color:'#1565E8' },
    { key:'in_progress', title:'En proceso',     color:'#F59E0B' },
    { key:'waiting',     title:'Esperando user', color:'#7C3AED' },
    { key:'resolved',    title:'Resueltos hoy',  color:'#22C55E' },
  ];
  const byCol = Object.fromEntries(columns.map(c => [c.key, CRM.TICKETS.filter(t => t.status === c.key)]));

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Tickets de soporte"
        sub={`${CRM.TICKETS.filter(t => t.status !== 'resolved').length} abiertos · ${CRM.TICKETS.filter(t => t.slaBreach).length} sobre SLA`}
        actions={<>
          <Btn icon="filter">Mis tickets</Btn>
          <Btn icon="plus" variant="primary">Crear ticket</Btn>
        </>}/>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, alignItems:'flex-start'}} className="kanban-grid">
        {columns.map(col => (
          <div key={col.key} style={{display:'flex', flexDirection:'column', gap: 10}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 4px'}}>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <span style={{width:10, height:10, borderRadius:'50%', background: col.color}}></span>
                <span style={{fontSize:13, fontWeight:600, color:'var(--fg-1)'}}>{col.title}</span>
              </div>
              <span style={{fontSize:11.5, color:'var(--fg-2)', background:'var(--surf-2)', padding:'2px 8px', borderRadius: 99, fontWeight:600}}>
                {byCol[col.key].length}
              </span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 8, minHeight: 100}}>
              {byCol[col.key].map(t => <TicketCard key={t.id} t={t}/>)}
              {byCol[col.key].length === 0 && (
                <div style={{padding:'20px 14px', textAlign:'center', fontSize:12, color:'var(--fg-3)',
                              border:'1.5px dashed var(--border)', borderRadius:12}}>
                  Sin tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TicketCard = ({ t }) => {
  const priorityColor = { high:'#EF4444', medium:'#F59E0B', low:'#7A95B8' }[t.priority];
  return (
    <div style={{
      background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 12, padding: 12,
      cursor: 'pointer', transition: 'border-color .15s, transform .15s',
      borderLeft: `3px solid ${priorityColor}`,
    }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 6}}>
        <span className="mono-cell" style={{fontSize:10.5, color:'var(--fg-3)', fontWeight:600}}>{t.id}</span>
        <ChannelChip channel={t.channel}/>
      </div>
      <div style={{fontSize:13, fontWeight:600, color:'var(--fg-1)', lineHeight: 1.35, marginBottom: 10,
                    display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
        {t.subject}
      </div>
      <div style={{display:'flex', alignItems:'center', gap: 7, marginBottom: 8}}>
        <Avatar initials={t.userInitials} hue={210 + (t.id.charCodeAt(4) % 60)} size={22}/>
        <span style={{fontSize:12, color:'var(--fg-2)', flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
          {t.userName.split(' ').slice(0,2).join(' ')}
        </span>
        <span style={{fontSize:10.5, color:'var(--fg-3)'}}>{CRM.fmt.relTime(t.createdAt)}</span>
      </div>
      {/* SLA bar */}
      {t.status !== 'resolved' && (
        <div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 3}}>
            <span style={{fontSize:10, color: t.slaBreach ? '#B91C1C' : 'var(--fg-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em'}}>
              SLA {t.slaBreach && '· vencido'}
            </span>
            <span style={{fontSize:10.5, color: t.slaBreach ? '#B91C1C' : 'var(--fg-2)', fontFamily:'var(--font-mono)', fontWeight:600}}>
              {Math.min(100, Math.round(t.slaPct))}%
            </span>
          </div>
          <div style={{height: 3, background:'var(--surf-2)', borderRadius:99, overflow:'hidden'}}>
            <div style={{height:'100%', width: `${Math.min(100, t.slaPct)}%`,
                          background: t.slaBreach ? '#EF4444' : t.slaPct > 70 ? '#F59E0B' : '#22C55E',
                          borderRadius: 99, transition:'width .4s'}}></div>
          </div>
        </div>
      )}
      {t.agent && t.agent !== '— sin asignar' && (
        <div style={{marginTop: 8, fontSize:10.5, color:'var(--fg-3)'}}>
          Asignado a <span style={{color:'var(--fg-2)', fontWeight:500}}>{t.agent}</span>
        </div>
      )}
    </div>
  );
};

/* =============================================================
   6) CHAT OPERATIONS CONSOLE
============================================================= */
const ViewChatConsole = () => {
  const [activeId, setActiveId] = useState(CRM.CHAT_QUEUE[3].id);
  const [reply, setReply] = useState('');
  const active = CRM.CHAT_QUEUE.find(c => c.id === activeId);

  const sentimentEmoji = { frustrated:'😤', neutral:'🙂', happy:'😊' };
  const sentimentColor = { frustrated:'#EF4444', neutral:'#7A95B8', happy:'#22C55E' };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 16, height:'calc(100vh - 110px)'}}>
      <ViewHeader title="Chat Operations Console"
        sub={`${CRM.CHAT_QUEUE.length} conversaciones activas · ${CRM.CHAT_QUEUE.filter(c => c.sentiment === 'frustrated').length} requieren atención`}
        actions={<Btn icon="refresh">Sincronizar</Btn>}/>

      <div style={{display:'grid', gridTemplateColumns:'320px 1fr 320px', gap: 14, flex: 1, minHeight: 0}} className="chat-grid">
        {/* ─── Queue ─── */}
        <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden', display:'flex', flexDirection:'column'}}>
          <div style={{padding:'13px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span style={{fontSize:13, fontWeight:600}}>Cola en vivo</span>
            <Badge tone="info" dot>{CRM.CHAT_QUEUE.length}</Badge>
          </div>
          <div style={{flex:1, overflowY:'auto'}}>
            {CRM.CHAT_QUEUE.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)} style={{
                width:'100%', padding:'12px 14px', display:'flex', gap: 11, alignItems:'flex-start',
                background: c.id === activeId ? 'var(--accent-tint)' : 'transparent',
                border:'none', borderBottom:'1px solid var(--border)', cursor:'pointer', textAlign:'left',
                borderLeft: c.id === activeId ? '3px solid var(--accent)' : '3px solid transparent',
                fontFamily:'inherit',
              }}>
                <div style={{position:'relative', flexShrink: 0}}>
                  <Avatar initials={c.user.initials} hue={c.user.avatarHue} size={36}/>
                  <span style={{position:'absolute', bottom: -2, right: -2, fontSize:13, lineHeight:1,
                                background:'var(--surf-0)', borderRadius:'50%', padding:1}}>
                    {sentimentEmoji[c.sentiment]}
                  </span>
                </div>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:6}}>
                    <span style={{fontSize:13, fontWeight:600, color:'var(--fg-1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                      {c.user.name.split(' ').slice(0,2).join(' ')}
                    </span>
                    {c.unread > 0 && <span style={{background:'#EF4444', color:'#fff', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius: 99, flexShrink:0}}>{c.unread}</span>}
                  </div>
                  <div style={{fontSize:12, color:'var(--fg-2)', marginTop:2, lineHeight:1.35,
                                display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
                    {c.lastMsg}
                  </div>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:5}}>
                    <span style={{fontSize:10.5, color: c.wait > 120 ? '#B91C1C' : 'var(--fg-3)', fontWeight: c.wait > 120 ? 600 : 400}}>
                      espera {c.wait}s
                    </span>
                    <span style={{fontSize:10.5, color: sentimentColor[c.sentiment], fontWeight:600}}>
                      {c.sentiment === 'frustrated' ? 'frustrado' : c.sentiment === 'happy' ? 'feliz' : 'neutral'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Active chat ─── */}
        <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden', display:'flex', flexDirection:'column'}}>
          <div style={{padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap: 11}}>
            <Avatar initials={active.user.initials} hue={active.user.avatarHue} size={38}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:600}}>{active.user.name}</div>
              <div style={{fontSize:11.5, color:'var(--fg-2)', display:'flex', gap: 8, alignItems:'center'}}>
                <span className="mono-cell">{active.user.id}</span>
                <span>·</span>
                <span>{active.user.state}</span>
                <span>·</span>
                <span style={{display:'inline-flex', alignItems:'center', gap:4}}>
                  <span style={{width:6, height:6, borderRadius:'50%', background:'#22C55E'}}></span>
                  en línea
                </span>
              </div>
            </div>
            <Btn icon="phone">Llamar</Btn>
            <Btn variant="primary" icon="flag">Escalar a humano</Btn>
          </div>

          <div style={{flex:1, overflowY:'auto', padding:'18px 20px', background:'var(--surf-2)', display:'flex', flexDirection:'column', gap: 10}}>
            {CRM.CHAT_THREAD.map((m, i) => <ChatBubble key={i} m={m}/>)}
            <div style={{display:'inline-flex', alignSelf:'flex-start', gap:4, padding:'10px 13px', background:'var(--surf-0)', borderRadius:14, border:'1px solid var(--border)'}}>
              <span className="typing-dot"></span>
              <span className="typing-dot" style={{animationDelay:'.15s'}}></span>
              <span className="typing-dot" style={{animationDelay:'.30s'}}></span>
            </div>
          </div>

          <div style={{padding: 14, borderTop:'1px solid var(--border)'}}>
            <div style={{display:'flex', gap: 8}}>
              <input value={reply} onChange={e => setReply(e.target.value)}
                     placeholder="Escribe tu respuesta…" className="input-base" style={{flex:1}}
                     onKeyDown={e => { if (e.key === 'Enter' && reply.trim()) setReply(''); }}/>
              <Btn variant="primary" icon="send" onClick={() => setReply('')}>Enviar</Btn>
            </div>
            <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
              {['👋 Saludo cordial', '✅ Pago verificado', '⏱ Estamos revisando', '🔄 Reembolso iniciado'].map(t => (
                <button key={t} className="quick-pill">{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Context panel ─── */}
        <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden', display:'flex', flexDirection:'column'}}>
          <div style={{padding:'13px 16px', borderBottom:'1px solid var(--border)', fontSize:13, fontWeight:600}}>
            Contexto del cliente
          </div>
          <div style={{flex:1, overflowY:'auto', padding: 16, display:'flex', flexDirection:'column', gap: 16}}>
            <div>
              <div style={{fontSize:11, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom: 6}}>Cuenta</div>
              <div style={{display:'flex', flexDirection:'column', gap: 5, fontSize: 13}}>
                <Row k="Estado" v={<Badge tone="success" dot>Activo</Badge>}/>
                <Row k="KYC" v={`Nivel ${active.user.kyc} de 3`}/>
                <Row k="Volumen 30d" v={CRM.fmt.mxn(active.user.tpv/4).replace('MX$','$')} mono/>
                <Row k="Cliente desde" v={CRM.fmt.dateFmt(active.user.signup)}/>
              </div>
            </div>

            <div>
              <div style={{fontSize:11, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom: 6}}>Últimos pagos</div>
              {CRM.TRANSACTIONS.filter(t => t.userId === active.user.id).slice(0, 3).map(t => (
                <div key={t.id} style={{display:'flex', alignItems:'center', gap:8, padding:'7px 0', fontSize: 12.5}}>
                  <span style={{width:6, height:6, borderRadius:2, background: t.biller.color}}></span>
                  <span style={{flex:1}}>{t.biller.name}</span>
                  <span className="mono-cell" style={{fontWeight: 600}}>{CRM.fmt.mxn(t.amount).replace('MX$','$')}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{fontSize:11, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom: 6}}>Sugerencias del bot</div>
              {[
                '💡 El usuario menciona Totalplay — ofrecer link al estado del pago.',
                '🔍 Verificar referencia 5512345678 en panel de billers.',
                '⏱ Lleva 235s esperando — escalar antes de 5 min.',
              ].map((s, i) => (
                <div key={i} style={{padding:'8px 10px', background:'var(--accent-tint)', borderRadius: 8, fontSize: 12, color:'var(--fg-1)', marginBottom: 6, lineHeight: 1.45}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v, mono }) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--border)', fontSize:12.5}}>
    <span style={{color:'var(--fg-2)'}}>{k}</span>
    <span style={{fontWeight: mono ? 600 : 500, fontFamily: mono ? 'var(--font-mono)' : 'inherit', color:'var(--fg-1)'}}>{v}</span>
  </div>
);

const ChatBubble = ({ m }) => {
  if (m.from === 'system') {
    return (
      <div style={{alignSelf:'center', padding:'5px 12px', background:'rgba(245,158,11,.14)', color:'#92560A',
                    borderRadius: 99, fontSize: 11.5, fontWeight: 600}}>
        {m.text}
      </div>
    );
  }
  const isUser = m.from === 'user';
  const isBot  = m.from === 'bot';
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '75%',
      padding: '9px 13px',
      borderRadius: 14,
      borderBottomLeftRadius: isUser ? 14 : 4,
      borderBottomRightRadius: isUser ? 4 : 14,
      background: isUser ? 'var(--accent)' : 'var(--surf-0)',
      color: isUser ? '#fff' : 'var(--fg-1)',
      border: isUser ? 'none' : '1px solid var(--border)',
      fontSize: 13.5, lineHeight: 1.45,
    }}>
      {isBot && <div style={{fontSize:10, fontWeight:700, color:'#1565E8', marginBottom: 3, textTransform:'uppercase', letterSpacing:'.05em'}}>FONDIX Bot</div>}
      <div dangerouslySetInnerHTML={{__html: m.text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}}/>
      <div style={{fontSize:10, marginTop:4, opacity:.65}}>{m.t}</div>
    </div>
  );
};

/* =============================================================
   7) COMPLIANCE / KYC
============================================================= */
const ViewCompliance = () => {
  const [selected, setSelected] = useState(CRM.KYC_QUEUE[0]);
  const sorted = [...CRM.KYC_QUEUE].sort((a,b) => b.riskScore - a.riskScore);

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 18}}>
      <ViewHeader title="Compliance · KYC"
        sub={`${CRM.KYC_QUEUE.length} verificaciones pendientes · ${CRM.KYC_QUEUE.filter(k => k.riskScore > 70).length} de alto riesgo`}
        actions={<>
          <Btn icon="filter">Filtrar</Btn>
          <Btn icon="download">Reporte CNBV</Btn>
        </>}/>

      <div style={{display:'grid', gridTemplateColumns:'420px 1fr', gap: 16}} className="kyc-grid">
        {/* Queue list */}
        <div style={{background:'var(--surf-0)', border:'1px solid var(--border)', borderRadius: 14, overflow:'hidden'}}>
          <div style={{padding:'13px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span style={{fontSize:13, fontWeight:600}}>Cola de revisión</span>
            <span style={{fontSize:11.5, color:'var(--fg-2)'}}>Ordenado por riesgo</span>
          </div>
          <div style={{maxHeight: 600, overflowY:'auto'}}>
            {sorted.map(k => (
              <button key={k.id} onClick={() => setSelected(k)} style={{
                width:'100%', padding:'13px 16px', display:'flex', alignItems:'center', gap: 11,
                background: k.id === selected.id ? 'var(--accent-tint)' : 'transparent',
                border:'none', borderBottom:'1px solid var(--border)', cursor:'pointer', textAlign:'left',
                fontFamily:'inherit',
              }}>
                <Avatar initials={k.user.initials} hue={k.user.avatarHue} size={36}/>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--fg-1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {k.user.name}
                  </div>
                  <div style={{fontSize:11.5, color:'var(--fg-2)', marginTop: 2, display:'flex', gap:8}}>
                    <span>{k.docType}</span>
                    <span>·</span>
                    <span>{CRM.fmt.relTime(k.submittedAt)}</span>
                  </div>
                </div>
                <RiskPill score={k.riskScore}/>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          <Card title={`${selected.user.name} · ${selected.docType}`}
                action={<RiskPill score={selected.riskScore}/>}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
              <DocPreview label="Documento (frente)" docType={selected.docType}/>
              <DocPreview label="Selfie" isSelfie initials={selected.user.initials} hue={selected.user.avatarHue}/>
            </div>
          </Card>

          <Card title="Datos del usuario">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
              <InfoTile label="Nombre completo" value={selected.user.name}/>
              <InfoTile label="ID" value={selected.user.id} mono/>
              <InfoTile label="Email" value={selected.user.email}/>
              <InfoTile label="Teléfono" value={selected.user.phone}/>
              <InfoTile label="Estado" value={selected.user.state}/>
              <InfoTile label="Enviado" value={CRM.fmt.relTime(selected.submittedAt)}/>
            </div>
          </Card>

          {selected.flags.length > 0 && (
            <Card title="Alertas detectadas">
              {selected.flags.map((f, i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                                       background:'rgba(239,68,68,.08)', borderRadius:10, marginBottom: 8}}>
                  <Icon name="warn" size={16} style={{color:'#EF4444'}}/>
                  <span style={{fontSize:13, color:'#B91C1C', fontWeight:600}}>{f}</span>
                </div>
              ))}
            </Card>
          )}

          <div style={{display:'flex', gap: 10}}>
            <Btn variant="danger" icon="close">Rechazar</Btn>
            <Btn icon="warn">Solicitar nuevo documento</Btn>
            <Btn variant="primary" icon="check" style={{marginLeft:'auto'}}>Aprobar verificación</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskPill = ({ score }) => {
  const tone = score > 70 ? 'danger' : score > 40 ? 'pending' : 'success';
  const label = score > 70 ? 'Alto' : score > 40 ? 'Medio' : 'Bajo';
  return <Badge tone={tone} dot>{label} · {score}</Badge>;
};

const DocPreview = ({ label, docType, isSelfie, initials, hue }) => (
  <div>
    <div style={{fontSize:11, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom: 6}}>{label}</div>
    <div style={{aspectRatio: isSelfie ? '1/1' : '1.58/1', background: 'linear-gradient(135deg, #1F3A5F, #0A1628)',
                  borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#5CB8FF',
                  border:'1px solid var(--border)', position:'relative', overflow:'hidden'}}>
      {isSelfie ? (
        <Avatar initials={initials} hue={hue} size={64}/>
      ) : (
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:11, opacity:.7, letterSpacing:'.1em', textTransform:'uppercase'}}>Instituto Nacional Electoral</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize:14, fontWeight:700, marginTop:4}}>{docType === 'INE' ? 'CREDENCIAL PARA VOTAR' : 'PASAPORTE'}</div>
          <div style={{marginTop:14, fontSize:10, opacity:.5}}>placeholder · documento real difuminado</div>
        </div>
      )}
      <div style={{position:'absolute', top:8, right:8, background:'rgba(34,197,94,.18)', color:'#22C55E', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:99}}>
        ✓ verificado
      </div>
    </div>
  </div>
);

Object.assign(window, { ViewReconciliation, ViewTickets, ViewChatConsole, ViewCompliance });
