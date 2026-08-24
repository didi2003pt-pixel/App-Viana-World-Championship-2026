'use strict';

const APP = (() => {
  const STORAGE_KEY = 'fpvArbitragemOperacionalV2';
  const TODAY = new Date('2026-05-13T12:00:00');
  const REPORT_DAYS = 5;
  const EXPIRY_DAYS = 60;
  const NOMINATION_WINDOW_DAYS = 92;

  const NAV_ITEMS = [
    ['dashboard', '◉', 'Dashboard', 'Visão global da arbitragem, nomeações, disponibilidade, relatórios, conflitos e documentos.'],
    ['arbitros', '⚓', 'Árbitros', 'Gestão dos árbitros, categorias, graduações, licenças, disponibilidade e risco operacional.'],
    ['perfil', '👤', 'Perfil do árbitro', 'Ficha individual com histórico, documentos, conflitos, relatórios e ações rápidas.'],
    ['provas', '⛵', 'Provas', 'Gestão de provas, regatas, campeonatos, necessidades de arbitragem e documentação.'],
    ['nomeacoes', '✓', 'Nomeações', 'Centro operacional para nomeações, validações, estados e decisões auditáveis.'],
    ['disponibilidades', '📅', 'Disponibilidades', 'Motor de disponibilidade e accountability dos árbitros.'],
    ['credenciacao', '🎓', 'Licenças e formação', 'Controlo de licença desportiva, formação, graduação e requisitos de progressão.'],
    ['relatorios', '📝', 'Relatórios', 'Ciclo pós-prova, prazos automáticos, submissão, validação e auditoria.'],
    ['conflitos', '⚠', 'Conflitos', 'Registo, análise e decisão sobre conflitos de interesse.'],
    ['documentos', '📄', 'Documentos', 'Gestão documental por prova, árbitro, tipo, versão e estado.'],
    ['comunicacoes', '✉', 'Comunicações', 'Notificações internas, pedidos de resposta e alertas operacionais.'],
    ['honorarios', '€', 'Honorários', 'Workflow financeiro interno com cálculo de dias, quilómetros e despesas.'],
    ['auditoria', '☷', 'Auditoria', 'Histórico completo de ações, alterações de estado e decisões.'],
    ['perfis', '⚙', 'Perfis e permissões', 'Matriz de acesso preparada para futura autenticação real.']
  ];

  const state = {
    page: 'dashboard',
    selectedRefereeId: 1,
    selectedRaceId: 1,
    deferredInstallPrompt: null,
    filters: {
      arbitros: {}, provas: {}, disponibilidades: {}, nomeacoes: {}, documentos: {}, relatorios: {}, conflitos: {}, honorarios: {}
    },
    data: null
  };

  const initialData = () => ({
    arbitros: [
      { id: 1, codigo: 'ARB-024', nome: 'Ana Sofia Almeida', categoria: 'Juiz', graduacao: 'Nacional', licenca: 'Válida', validadeLicenca: '2027-03-15', regiao: 'Associação Regional Centro', contacto: 'ana.almeida.interno@fpv-arb.local', disponibilidade: 'Disponível', ultimaDisponibilidade: '2026-05-05', formacao: 'Seminário RRV 2025', seminarios: 'RRV, Protestos e Audiências', exames: 'Exame Nacional 2024', provasRealizadas: 46, avaliacoes: 18, relatoriosAtraso: 0, estado: 'Ativo', observacoes: 'Perfil recomendado para Comissão de Protestos em provas nacionais.' },
      { id: 2, codigo: 'ARB-041', nome: 'Miguel Nunes', categoria: 'Medidor', graduacao: 'Nacional/Grau 2', licenca: 'Válida', validadeLicenca: '2026-06-30', regiao: 'Associação Regional Norte', contacto: 'miguel.nunes.interno@fpv-arb.local', disponibilidade: 'Por confirmar', ultimaDisponibilidade: '2026-03-01', formacao: 'Formação de Medição 2024', seminarios: 'Medição e Equipamentos', exames: 'Exame Medidor 2024', provasRealizadas: 29, avaliacoes: 11, relatoriosAtraso: 1, estado: 'Ativo', observacoes: 'Adequado para medição em classes jovens e monotipos.' },
      { id: 3, codigo: 'ARB-063', nome: 'Teresa Carvalho', categoria: 'Oficial de Regata', graduacao: 'Regional/Grau 1', licenca: 'Por validar', validadeLicenca: '2026-05-29', regiao: 'Associação Regional Sul', contacto: 'teresa.carvalho.interno@fpv-arb.local', disponibilidade: 'Disponível', ultimaDisponibilidade: '2026-05-08', formacao: 'Curso Oficial de Regata 2025', seminarios: 'Gestão de Regata', exames: 'Exame Regional 2025', provasRealizadas: 17, avaliacoes: 7, relatoriosAtraso: 0, estado: 'Condicionado', observacoes: 'Aguardar validação documental antes de provas nacionais.' },
      { id: 4, codigo: 'ARB-087', nome: 'João Pires', categoria: 'Juiz-Árbitro', graduacao: 'Nacional', licenca: 'Válida', validadeLicenca: '2028-01-10', regiao: 'Associação Regional Lisboa', contacto: 'joao.pires.interno@fpv-arb.local', disponibilidade: 'Indisponível', ultimaDisponibilidade: '2026-05-10', formacao: 'Seminário Match Racing 2025', seminarios: 'Match Racing, Protestos', exames: 'Exame Nacional 2023', provasRealizadas: 38, avaliacoes: 16, relatoriosAtraso: 0, estado: 'Ativo', observacoes: 'Indisponível na segunda quinzena de junho.' },
      { id: 5, codigo: 'ARB-102', nome: 'Marta Reis', categoria: 'Juiz', graduacao: 'Clube', licenca: 'Expirada', validadeLicenca: '2025-12-18', regiao: 'Associação Regional Centro', contacto: 'marta.reis.interno@fpv-arb.local', disponibilidade: 'Indisponível', ultimaDisponibilidade: '2026-01-15', formacao: 'Sem formação recente registada', seminarios: 'Sem registo recente', exames: 'Exame Clube 2022', provasRealizadas: 9, avaliacoes: 3, relatoriosAtraso: 2, estado: 'Inativo', observacoes: 'Não nomear até renovação da Licença Desportiva de Árbitro.' },
      { id: 6, codigo: 'ARB-118', nome: 'Ricardo Matos', categoria: 'Oficial de Regata', graduacao: 'Nacional', licenca: 'Válida', validadeLicenca: '2027-11-02', regiao: 'Associação Regional Setúbal', contacto: 'ricardo.matos.interno@fpv-arb.local', disponibilidade: 'Disponível', ultimaDisponibilidade: '2026-05-11', formacao: 'Seminário Gestão de Regatas 2025', seminarios: 'Gestão de Regata, Segurança', exames: 'Exame Nacional 2024', provasRealizadas: 54, avaliacoes: 22, relatoriosAtraso: 0, estado: 'Ativo', observacoes: 'Perfil sénior para Presidente da Comissão de Regata.' },
      { id: 7, codigo: 'ARB-130', nome: 'Inês Duarte', categoria: 'Classificador Funcional', graduacao: 'Regional/Grau 1', licenca: 'Suspensa', validadeLicenca: '2026-09-20', regiao: 'Associação Regional Norte', contacto: 'ines.duarte.interno@fpv-arb.local', disponibilidade: 'Disponível', ultimaDisponibilidade: '2026-04-01', formacao: 'Classificação Funcional 2024', seminarios: 'Classificação Funcional', exames: 'Exame Classificador 2024', provasRealizadas: 21, avaliacoes: 8, relatoriosAtraso: 0, estado: 'Suspenso', observacoes: 'Suspensão administrativa temporária. Não nomear.' },
      { id: 8, codigo: 'ARB-151', nome: 'Luís Barros', categoria: 'Oficial de Regata', graduacao: 'Clube', licenca: 'Válida', validadeLicenca: '2026-12-05', regiao: 'Associação Regional Madeira', contacto: 'luis.barros.interno@fpv-arb.local', disponibilidade: 'Disponível', ultimaDisponibilidade: '2026-02-01', formacao: 'Curso Clube 2025', seminarios: 'Organização de Prova de Clube', exames: 'Exame Clube 2025', provasRealizadas: 8, avaliacoes: 4, relatoriosAtraso: 0, estado: 'Ativo', observacoes: 'Pode apoiar provas de clube e secretariado.' }
    ],
    provas: [
      { id: 1, nome: 'Campeonato Nacional de ILCA', tipo: 'Campeonato Nacional', ambito: 'Nacional', inicio: '2026-06-06', fim: '2026-06-08', local: 'Cascais', organizador: 'Clube Naval de Cascais', classes: 'ILCA 4, ILCA 6, ILCA 7', barcos: 118, campos: 'Campo Bravo e Campo Charlie', estado: 'Nomeações pendentes', estadoDocumental: 'Aguardando validação', relatorioFinal: 'Pendente', necessidades: { 'Presidente da Comissão de Regata': 1, 'Oficial de Regata': 2, 'Presidente da Comissão de Protestos': 1, 'Juiz': 2, 'Medidor': 1 }, checklist: checklistBase(false) },
      { id: 2, nome: 'Taça de Portugal Optimist', tipo: 'Taça de Portugal', ambito: 'Nacional', inicio: '2026-06-14', fim: '2026-06-16', local: 'Portimão', organizador: 'Clube Naval de Portimão', classes: 'Optimist', barcos: 142, campos: 'Campo Alfa', estado: 'Equipa completa', estadoDocumental: 'Validado', relatorioFinal: 'Pendente', necessidades: { 'Presidente da Comissão de Regata': 1, 'Oficial de Regata': 2, 'Juiz': 1, 'Secretariado de prova': 1 }, checklist: checklistBase(true) },
      { id: 3, nome: 'Regata Atlântico Norte', tipo: 'Prova Internacional', ambito: 'Internacional', inicio: '2026-07-04', fim: '2026-07-06', local: 'Viana do Castelo', organizador: 'Clube de Vela de Viana', classes: 'ORC, ANC', barcos: 34, campos: 'Percurso costeiro', estado: 'Em preparação', estadoDocumental: 'Incompleto', relatorioFinal: 'Pendente', necessidades: { 'Presidente da Comissão de Regata': 1, 'Oficial de Regata': 1, 'Juiz': 1, 'Apoio técnico': 1 }, checklist: checklistBase(false) },
      { id: 4, nome: 'Circuito Regional Centro', tipo: 'Campeonato Regional', ambito: 'Regional', inicio: '2026-05-31', fim: '2026-06-01', local: 'Aveiro', organizador: 'Sporting Clube de Aveiro', classes: '420, Snipe', barcos: 48, campos: 'Ria de Aveiro', estado: 'Planeada', estadoDocumental: 'Incompleto', relatorioFinal: 'Pendente', necessidades: { 'Oficial de Regata': 1, 'Juiz': 1 }, checklist: checklistBase(false) },
      { id: 5, nome: 'Portugal Sailing Grand Prix', tipo: 'Prova Internacional', ambito: 'Internacional', inicio: '2026-08-21', fim: '2026-08-25', local: 'Vilamoura', organizador: 'Autoridade Organizadora FPV', classes: '49er, 470, Nacra 17', barcos: 86, campos: 'Campos Olímpicos Sul', estado: 'Nomeações pendentes', estadoDocumental: 'Aguardando validação', relatorioFinal: 'Pendente', necessidades: { 'Presidente da Comissão de Regata': 1, 'Oficial de Regata': 4, 'Presidente da Comissão de Protestos': 1, 'Juiz-Árbitro': 1, 'Medidor': 2, 'Apoio técnico': 2 }, checklist: checklistBase(false) },
      { id: 6, nome: 'Troféu Clube Naval Local', tipo: 'Prova de Clube', ambito: 'Clube', inicio: '2026-04-26', fim: '2026-04-27', local: 'Sesimbra', organizador: 'Clube Naval de Sesimbra', classes: 'Cruzeiros', barcos: 24, campos: 'Baía de Sesimbra', estado: 'Concluída', estadoDocumental: 'Validado', relatorioFinal: 'Em atraso', necessidades: { 'Oficial de Regata': 1, 'Secretariado de prova': 1 }, checklist: checklistBase(true) }
    ],
    nomeacoes: [
      { id: 1, provaId: 1, arbitroId: 6, funcao: 'Presidente da Comissão de Regata', estado: 'Aceite', justificacao: '', data: '2026-05-01' },
      { id: 2, provaId: 1, arbitroId: 2, funcao: 'Medidor', estado: 'Pendente de resposta', justificacao: 'Relatório anterior em atraso a acompanhar.', data: '2026-05-04' },
      { id: 3, provaId: 1, arbitroId: 1, funcao: 'Presidente da Comissão de Protestos', estado: 'Enviada', justificacao: '', data: '2026-05-04' },
      { id: 4, provaId: 2, arbitroId: 6, funcao: 'Presidente da Comissão de Regata', estado: 'Aceite', justificacao: '', data: '2026-05-02' },
      { id: 5, provaId: 2, arbitroId: 3, funcao: 'Oficial de Regata', estado: 'Aceite', justificacao: 'Nomeação condicionada à validação documental.', data: '2026-05-02' },
      { id: 6, provaId: 2, arbitroId: 1, funcao: 'Juiz', estado: 'Aceite', justificacao: '', data: '2026-05-02' },
      { id: 7, provaId: 3, arbitroId: 7, funcao: 'Classificador Funcional', estado: 'Rascunho', justificacao: 'Aguardando decisão sobre suspensão.', data: '2026-05-09' }
    ],
    disponibilidades: [
      { id: 1, arbitroId: 1, provaId: 1, data: '2026-06-06', estado: 'Disponível', observacoes: 'Disponível para os três dias.', atualizadoEm: '2026-05-05' },
      { id: 2, arbitroId: 2, provaId: 1, data: '2026-06-06', estado: 'Por confirmar', observacoes: 'Depende de agenda profissional.', atualizadoEm: '2026-03-01' },
      { id: 3, arbitroId: 4, provaId: 2, data: '2026-06-14', estado: 'Indisponível', observacoes: 'Indisponibilidade declarada.', atualizadoEm: '2026-05-10' },
      { id: 4, arbitroId: 6, provaId: 2, data: '2026-06-14', estado: 'Disponível', observacoes: 'Confirmado.', atualizadoEm: '2026-05-11' },
      { id: 5, arbitroId: 7, provaId: 3, data: '2026-07-04', estado: 'Disponível', observacoes: 'Disponibilidade condicionada a estado operacional.', atualizadoEm: '2026-04-01' },
      { id: 6, arbitroId: 8, provaId: 4, data: '2026-05-31', estado: 'Disponível', observacoes: 'Disponibilidade para apoio regional.', atualizadoEm: '2026-02-01' }
    ],
    relatorios: [
      { id: 1, provaId: 6, arbitroId: 8, prazo: '2026-05-02', estado: 'Em atraso', observacoes: 'Aguarda relatório final e anexos de protestos.', documentoId: null },
      { id: 2, provaId: 2, arbitroId: 6, prazo: '2026-06-21', estado: 'Pendente', observacoes: 'Prazo automático após conclusão.', documentoId: null },
      { id: 3, provaId: 1, arbitroId: 6, prazo: '2026-06-13', estado: 'Pendente', observacoes: 'A entregar após conclusão.', documentoId: null },
      { id: 4, provaId: 4, arbitroId: 3, prazo: '2026-06-06', estado: 'Pendente', observacoes: 'Relatório regional simplificado.', documentoId: null }
    ],
    conflitos: [
      { id: 1, arbitroId: 7, provaId: 3, tipo: 'Ligação a clube', descricao: 'Vínculo ao clube organizador.', estado: 'Em análise', decisao: 'Aguardar deliberação do Conselho de Arbitragem.', responsavel: 'Conselho de Arbitragem', observacoes: 'Impacto direto na nomeação.', impacto: 'Alerta crítico', dataRegisto: '2026-05-11', dataDecisao: '' },
      { id: 2, arbitroId: 2, provaId: 1, tipo: 'Ligação a atleta', descricao: 'Ligação indireta a atleta participante.', estado: 'Sem impedimento', decisao: 'Sem impedimento para função de medição.', responsavel: 'Conselho de Arbitragem', observacoes: 'Registo mantido para rastreabilidade.', impacto: 'Sem impedimento', dataRegisto: '2026-05-08', dataDecisao: '2026-05-09' },
      { id: 3, arbitroId: 5, provaId: 4, tipo: 'Relação familiar', descricao: 'Relação familiar com atleta inscrito.', estado: 'Impedimento total', decisao: 'Não nomear para esta prova.', responsavel: 'Conselho Regional', observacoes: 'Conflito declarado pelo próprio árbitro.', impacto: 'Bloqueio', dataRegisto: '2026-05-07', dataDecisao: '2026-05-08' }
    ],
    documentos: [
      { id: 1, nome: 'Aviso de Regata - Campeonato Nacional ILCA.pdf', tipo: 'Avisos de regata', provaId: 1, arbitroId: null, versao: '1.0', estado: 'Válido', data: '2026-05-02', responsavel: 'Secretariado FPV', observacoes: 'Documento validado.' },
      { id: 2, nome: 'Instruções de Regata - Optimist.pdf', tipo: 'Instruções de regata', provaId: 2, arbitroId: null, versao: '1.2', estado: 'Válido', data: '2026-05-08', responsavel: 'Autoridade Organizadora', observacoes: 'Versão revista.' },
      { id: 3, nome: 'Mapa disponibilidade junho - Miguel Nunes.xlsx', tipo: 'Mapas de disponibilidade', provaId: null, arbitroId: 2, versao: '1.0', estado: 'Por validar', data: '2026-05-10', responsavel: 'Miguel Nunes', observacoes: 'A validar pelo Conselho Regional.' },
      { id: 4, nome: 'Ata de protesto 04.pdf', tipo: 'Atas', provaId: 2, arbitroId: 1, versao: '1.0', estado: 'Arquivado', data: '2026-05-12', responsavel: 'Comissão de Protestos', observacoes: 'Registo arquivado.' },
      { id: 5, nome: 'Relatório final Sesimbra.docx', tipo: 'Relatórios', provaId: 6, arbitroId: 8, versao: '0.1', estado: 'Em falta', data: '2026-05-13', responsavel: 'Luís Barros', observacoes: 'Documento ainda não submetido.' }
    ],
    comunicacoes: [
      { id: 1, destinatario: 'Miguel Nunes', tipo: 'Pedido de confirmação', estado: 'Pendente', data: '2026-05-12 09:20', prioridade: 'Alta', mensagem: 'Confirmar nomeação como Medidor no Campeonato Nacional de ILCA.', entidade: 'Nomeação #2' },
      { id: 2, destinatario: 'Marta Reis', tipo: 'Licença a expirar/regularizar', estado: 'Enviada', data: '2026-05-12 11:45', prioridade: 'Alta', mensagem: 'Licença expirada. Regularização necessária antes de nova nomeação.', entidade: 'Árbitro ARB-102' },
      { id: 3, destinatario: 'Luís Barros', tipo: 'Relatório em atraso', estado: 'Pendente', data: '2026-05-13 08:10', prioridade: 'Alta', mensagem: 'Relatório final da prova de Sesimbra em atraso.', entidade: 'Relatório #1' },
      { id: 4, destinatario: 'Conselho de Arbitragem', tipo: 'Conflito declarado', estado: 'Lida', data: '2026-05-13 10:00', prioridade: 'Crítica', mensagem: 'Conflito pendente na Regata Atlântico Norte.', entidade: 'Conflito #1' }
    ],
    honorarios: [
      { id: 1, provaId: 6, arbitroId: 8, funcao: 'Oficial de Regata', dias: 2, valorDia: 95, km: 84, valorKm: 0.36, despesas: 12, total: 232.24, estado: 'Em validação', dataSubmissao: '2026-05-03', observacoes: 'Aguarda relatório técnico.' },
      { id: 2, provaId: 1, arbitroId: 6, funcao: 'Presidente da Comissão de Regata', dias: 3, valorDia: 125, km: 60, valorKm: 0.36, despesas: 0, total: 396.60, estado: 'Por submeter', dataSubmissao: '', observacoes: 'Pré-registo preparado pela nomeação.' }
    ],
    auditoria: [
      { id: 1, data: '2026-05-13 10:12', utilizador: 'Conselho de Arbitragem', acao: 'Conflito de interesse declarado', entidade: 'Regata Atlântico Norte', anterior: 'Sem registo', novo: 'Em análise', justificacao: 'Vínculo ao clube organizador.', origem: 'Conflitos' },
      { id: 2, data: '2026-05-13 09:44', utilizador: 'Responsável Operacional', acao: 'Árbitro nomeado', entidade: 'Campeonato Nacional de ILCA', anterior: 'Sem nomeação', novo: 'Enviada', justificacao: 'Necessidade de Comissão de Protestos.', origem: 'Nomeações' },
      { id: 3, data: '2026-05-12 16:20', utilizador: 'Secretariado FPV', acao: 'Documento validado', entidade: 'Aviso de Regata ILCA', anterior: 'Por validar', novo: 'Válido', justificacao: 'Validação documental concluída.', origem: 'Documentos' },
      { id: 4, data: '2026-05-12 14:03', utilizador: 'Árbitro', acao: 'Disponibilidade atualizada', entidade: 'João Pires', anterior: 'Disponível', novo: 'Indisponível', justificacao: 'Indisponibilidade declarada.', origem: 'Disponibilidades' }
    ],
    preferencias: { tema: 'institucional', ultimaPagina: 'dashboard' }
  });

  function checklistBase(validated) {
    return [
      'Anúncio de Regata', 'Instruções de Regata', 'Resultados', 'Protestos', 'Decisões', 'Aditamentos', 'Relatório de prova', 'Mapa de nomeações', 'Documentos de medição'
    ].map((nome, index) => ({ nome, estado: validated || index < 2 ? 'Validado' : 'Pendente' }));
  }

  function initApp() {
    try {
      state.data = loadData();
      normaliseData();
      updateReportsStatus();
      renderNavigation();
      bindGlobalEvents();
      setupPwaInstall();
      const hashPage = (location.hash || '').replace('#', '');
      const startPage = NAV_ITEMS.some(item => item[0] === hashPage) ? hashPage : 'dashboard';
      navigateTo(startPage, false);
      saveData(false);
    } catch (error) {
      console.error('Falha ao iniciar aplicação:', error);
      state.data = initialData();
      renderNavigation();
      navigateTo('dashboard', false);
      toast('A aplicação recuperou dados internos válidos após uma falha de leitura local.');
    }
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialData();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.arbitros) || !Array.isArray(parsed.provas)) throw new Error('Estrutura inválida');
      return { ...initialData(), ...parsed };
    } catch (error) {
      console.warn('Dados locais inválidos. A repor dados de ambiente interno.', error);
      localStorage.removeItem(STORAGE_KEY);
      return initialData();
    }
  }

  function normaliseData() {
    const base = initialData();
    Object.keys(base).forEach(key => {
      if (Array.isArray(base[key]) && !Array.isArray(state.data[key])) state.data[key] = base[key];
      if (!Array.isArray(base[key]) && typeof state.data[key] !== 'object') state.data[key] = base[key];
    });
  }

  function saveData(showMessage = true) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    const status = el('storageStatus');
    if (status) status.textContent = 'Dados guardados neste dispositivo';
    if (showMessage) toast('Dados guardados localmente neste dispositivo.');
  }

  function resetData() {
    if (!confirm('Repor dados de ambiente interno? As alterações guardadas neste dispositivo serão substituídas.')) return;
    state.data = initialData();
    saveData(false);
    audit('Dados de ambiente interno repostos', 'Plataforma', 'Dados locais', 'Dados iniciais', 'Reposição manual pelo utilizador.', 'Definições');
    navigateTo('dashboard');
    toast('Dados de ambiente interno repostos.');
  }

  function renderNavigation() {
    const nav = el('mainNav');
    nav.innerHTML = NAV_ITEMS.map(([id, icon, label]) => `
      <button class="nav-button" type="button" data-page="${id}" aria-label="Abrir ${escapeHtml(label)}">
        <span class="nav-icon">${icon}</span><span>${label}</span>
      </button>
    `).join('');
  }

  function bindGlobalEvents() {
    el('mainNav').addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (!button) return;
      navigateTo(button.dataset.page);
    });
    el('mobileMenuButton').addEventListener('click', openSidebar);
    el('sidebarOverlay').addEventListener('click', closeSidebar);
    el('modalClose').addEventListener('click', closeModal);
    el('modalLayer').addEventListener('click', event => {
      if (event.target.id === 'modalLayer') closeModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
    });
    document.addEventListener('click', event => {
      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;
      handleAction(actionButton.dataset.action, actionButton.dataset, event);
    });
    document.addEventListener('change', event => {
      const actionControl = event.target.closest('[data-action]');
      if (!actionControl || event.type === 'click') return;
      handleAction(actionControl.dataset.action, actionControl.dataset, event);
    });
    window.addEventListener('hashchange', () => {
      const page = location.hash.replace('#', '');
      if (NAV_ITEMS.some(item => item[0] === page)) navigateTo(page, false);
    });
  }

  function setupPwaInstall() {
    const installButton = el('installButton');
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      state.deferredInstallPrompt = event;
      installButton.classList.remove('hidden');
    });
    installButton.addEventListener('click', async () => {
      if (!state.deferredInstallPrompt) return;
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      installButton.classList.add('hidden');
    });
  }

  function navigateTo(page, updateHash = true) {
    if (!NAV_ITEMS.some(item => item[0] === page)) page = 'dashboard';
    state.page = page;
    state.data.preferencias.ultimaPagina = page;
    document.querySelectorAll('.nav-button').forEach(button => button.classList.toggle('active', button.dataset.page === page));
    const meta = NAV_ITEMS.find(item => item[0] === page);
    el('pageEyebrow').textContent = meta[2];
    el('pageTitle').textContent = meta[2];
    el('pageSubtitle').textContent = meta[3];
    closeSidebar();
    safeRender(page);
    if (updateHash) history.replaceState(null, '', `#${page}`);
  }

  function safeRender(page) {
    try {
      const renderer = renderers[page] || renderDashboard;
      el('view').innerHTML = renderer();
    } catch (error) {
      console.error(`Erro ao renderizar ${page}:`, error);
      el('view').innerHTML = emptyState('Não foi possível apresentar este módulo.', 'A aplicação manteve-se ativa. Recarregue a página ou reponha os dados de ambiente interno.');
    }
  }

  const renderers = {
    dashboard: renderDashboard, arbitros: renderArbitros, perfil: renderPerfil, provas: renderProvas, nomeacoes: renderNomeacoes,
    disponibilidades: renderDisponibilidades, credenciacao: renderCredenciacao, relatorios: renderRelatorios, conflitos: renderConflitos,
    documentos: renderDocumentos, comunicacoes: renderComunicacoes, honorarios: renderHonorarios, auditoria: renderAuditoria, perfis: renderPerfis
  };

  function renderDashboard() {
    const d = dashboardMetrics();
    const upcoming = state.data.provas.filter(p => new Date(p.fim) >= TODAY).sort((a, b) => a.inicio.localeCompare(b.inicio)).slice(0, 6);
    const urgentRaces = racesWithinNominationWindow().slice(0, 5);
    const criticalAlerts = buildAlerts();
    return `
      <div class="grid kpi-grid">
        ${kpi('Provas futuras', d.futureRaces, 'Calendário ativo para nomeação e acompanhamento.', 'provas', 'info')}
        ${kpi('Provas sem equipa completa', d.incompleteTeams, 'Funções de arbitragem ainda por preencher.', 'nomeacoes', d.incompleteTeams ? 'warning' : 'ok')}
        ${kpi('Nomeações pendentes', d.pendingAppointments, 'Convites enviados ou pendentes de resposta.', 'nomeacoes', d.pendingAppointments ? 'warning' : 'ok')}
        ${kpi('Nomeações recusadas', d.refusedAppointments, 'Decisões que exigem substituição ou análise.', 'nomeacoes', d.refusedAppointments ? 'warning' : 'ok')}
        ${kpi('Árbitros disponíveis', d.availableReferees, 'Ativos, com licença válida e disponibilidade confirmada.', 'arbitros', 'ok')}
        ${kpi('Sem mapa de disponibilidade', d.missingMaps, 'Árbitros sem atualização recente.', 'disponibilidades', d.missingMaps ? 'warning' : 'ok')}
        ${kpi('Licenças expiradas', d.expiredLicenses, 'Árbitros bloqueados para nomeação.', 'credenciacao', d.expiredLicenses ? 'critical' : 'ok')}
        ${kpi('Licenças a expirar', d.expiringLicenses, 'Validade inferior a 60 dias.', 'credenciacao', d.expiringLicenses ? 'warning' : 'ok')}
        ${kpi('Relatórios em atraso', d.lateReports, 'Prazo pós-prova ultrapassado.', 'relatorios', d.lateReports ? 'critical' : 'ok')}
        ${kpi('Conflitos pendentes', d.pendingConflicts, 'Exigem decisão do Conselho de Arbitragem.', 'conflitos', d.pendingConflicts ? 'critical' : 'ok')}
        ${kpi('Documentos em falta', d.missingDocuments, 'Itens documentais críticos por validar.', 'documentos', d.missingDocuments ? 'warning' : 'ok')}
        ${kpi('Tarefas críticas', d.criticalTasks, 'Somatório de bloqueios e alertas urgentes.', 'auditoria', d.criticalTasks ? 'critical' : 'ok')}
      </div>
      <div class="grid two-col">
        <section class="card">
          <div class="card-title"><div><h3>Alertas críticos</h3><p>Prioridades operacionais que exigem decisão ou ação.</p></div></div>
          <div class="list">${criticalAlerts.length ? criticalAlerts.map(alert => `
            <button class="list-item" type="button" data-action="navigate" data-target="${alert.page}">
              <div>${badge(alert.level, alert.type)}<p><strong>${alert.title}</strong></p><p>${alert.message}</p></div>
              <span class="button small">Abrir</span>
            </button>`).join('') : emptyState('Sem alertas críticos.', 'Não existem bloqueios operacionais relevantes neste momento.')}
          </div>
        </section>
        <section class="card">
          <div class="card-title"><div><h3>Próximas provas</h3><p>Estado da equipa, documentação e relatório final.</p></div></div>
          <div class="list">${upcoming.map(p => raceListItem(p)).join('')}</div>
        </section>
      </div>
      <div class="grid two-col" style="margin-top:16px">
        <section class="card">
          <div class="card-title"><div><h3>Provas a exigir nomeação nos próximos 3 meses</h3><p>Trigger de antecedência para evitar gestão reativa.</p></div></div>
          <div class="list">${urgentRaces.length ? urgentRaces.map(p => raceNeedItem(p)).join('') : emptyState('Sem provas críticas na janela de 3 meses.', 'As equipas previstas encontram-se completas ou fora da janela de alerta.')}</div>
        </section>
        <section class="card">
          <div class="card-title"><div><h3>Risco operacional dos árbitros</h3><p>Licença, disponibilidade, conflitos e relatórios em atraso.</p></div></div>
          <div class="list">${state.data.arbitros.slice().sort((a,b)=>riskScore(b)-riskScore(a)).slice(0,5).map(a => `
            <div class="list-item"><div><strong>${escapeHtml(a.nome)}</strong><p>${escapeHtml(a.categoria)} · ${escapeHtml(a.graduacao)} · ${riskSummary(a)}</p></div>${riskBadge(a)}</div>`).join('')}</div>
        </section>
      </div>`;
  }

  function renderArbitros() {
    const f = state.filters.arbitros;
    const list = state.data.arbitros.filter(a => matchText(a, f.q, ['nome', 'codigo', 'categoria', 'graduacao', 'regiao']) && matchFilters(a, f, { categoria:'categoria', graduacao:'graduacao', regiao:'regiao', licenca:'licenca', disponibilidade:'disponibilidade', estado:'estado' }));
    return `
      <section class="card">
        ${toolbar('arbitros', [
          inputFilter('arbitros','q','Pesquisar por nome, código ou categoria'),
          selectFilter('arbitros','categoria','Categoria', unique(state.data.arbitros.map(a=>a.categoria))),
          selectFilter('arbitros','graduacao','Graduação', unique(state.data.arbitros.map(a=>a.graduacao))),
          selectFilter('arbitros','regiao','Região', unique(state.data.arbitros.map(a=>a.regiao))),
          selectFilter('arbitros','licenca','Licença', unique(state.data.arbitros.map(a=>a.licenca))),
          selectFilter('arbitros','disponibilidade','Disponibilidade', unique(state.data.arbitros.map(a=>a.disponibilidade))),
          selectFilter('arbitros','estado','Estado', unique(state.data.arbitros.map(a=>a.estado)))
        ], 'modalArbitro')}
        ${table(['Árbitro','Categoria','Graduação','Licença','Região','Disponibilidade','Formação','Provas','Avaliações','Risco','Estado','Ações'], list.map(a => [
          titleSub(a.nome, `${a.codigo} · ${a.contacto}`), a.categoria, a.graduacao, `${statusBadge(a.licenca)}<div class="row-sub">até ${formatDate(a.validadeLicenca)}</div>`, a.regiao,
          statusBadge(a.disponibilidade), a.formacao, String(a.provasRealizadas), String(a.avaliacoes), riskBadge(a), statusBadge(a.estado),
          actions([
            ['Perfil','selectProfile',a.id], ['Editar','modalArbitro',a.id], ['Indisponível','markUnavailable',a.id], ['Histórico','showRefereeHistory',a.id], ['Documento','modalDocumentoForRef',a.id], ['Conflito','modalConflitoForRef',a.id]
          ])
        ]))}
        ${!list.length ? emptyState('Sem árbitros para os filtros aplicados.', 'Ajuste os critérios de pesquisa ou reponha os filtros.') : ''}
      </section>`;
  }

  function renderPerfil() {
    const a = referee(state.selectedRefereeId) || state.data.arbitros[0];
    if (!a) return emptyState('Sem árbitros registados.', 'Adicione árbitros para consultar fichas individuais.');
    const noms = state.data.nomeacoes.filter(n => n.arbitroId === a.id);
    const rels = state.data.relatorios.filter(r => r.arbitroId === a.id);
    const confs = state.data.conflitos.filter(c => c.arbitroId === a.id);
    const docs = state.data.documentos.filter(d => d.arbitroId === a.id);
    const timeline = buildTimeline(a, noms, rels, confs);
    return `
      <div class="grid two-col">
        <aside class="card">
          <div class="profile-header"><div class="avatar">${initials(a.nome)}</div><div><h3>${escapeHtml(a.nome)}</h3><p class="row-sub">${escapeHtml(a.codigo)} · ${escapeHtml(a.categoria)} · ${escapeHtml(a.graduacao)}</p>${riskBadge(a)}</div></div>
          <div class="metric-list" style="margin-top:16px">
            ${metric('Licença', `${a.licenca} · ${formatDate(a.validadeLicenca)}`)}${metric('Disponibilidade', a.disponibilidade)}${metric('Última atualização', formatDate(a.ultimaDisponibilidade))}${metric('Região', a.regiao)}${metric('Estado operacional', a.estado)}${metric('Relatórios em atraso', String(a.relatoriosAtraso))}
          </div>
          <div class="row-actions" style="margin-top:16px">
            ${button('Nomear','modalNomeacaoForRef',a.id,'primary')}${button('Editar','modalArbitro',a.id)}${button('Disponibilidade','modalDisponibilidadeForRef',a.id)}${button('Conflito','modalConflitoForRef',a.id)}${button('Documento','modalDocumentoForRef',a.id)}${button('Exportar ficha','exportReferee',a.id)}
          </div>
        </aside>
        <section class="grid">
          <div class="card"><div class="card-title"><h3>Resumo operacional</h3>${appointmentRiskBadge(a)}</div><div class="grid three-col"><div class="risk-box"><strong>${noms.length}</strong><p>Nomeações registadas</p></div><div class="risk-box"><strong>${rels.filter(r=>r.estado==='Entregue'||r.estado==='Validado').length}</strong><p>Relatórios entregues/validados</p></div><div class="risk-box"><strong>${confs.length}</strong><p>Conflitos declarados</p></div></div><p>${escapeHtml(a.observacoes)}</p></div>
          <div class="grid two-col">
            <div class="card"><div class="card-title"><h3>Histórico de provas</h3></div><div class="list">${noms.length ? noms.map(n => nominationItem(n)).join('') : emptyState('Sem histórico de nomeações.', 'Não existem provas associadas a este árbitro.')}</div></div>
            <div class="card"><div class="card-title"><h3>Formação e documentos</h3></div><div class="list"><div class="list-item"><div><strong>${escapeHtml(a.formacao)}</strong><p>${escapeHtml(a.seminarios)} · ${escapeHtml(a.exames)}</p></div></div>${docs.length ? docs.map(d=>documentItem(d)).join('') : emptyState('Sem documentos associados.', 'Associe documentos à ficha do árbitro.')}</div></div>
          </div>
          <div class="grid two-col">
            <div class="card"><div class="card-title"><h3>Conflitos</h3></div><div class="list">${confs.length ? confs.map(c=>conflictItem(c)).join('') : emptyState('Sem conflitos ativos.', 'Não existem conflitos associados a este árbitro.')}</div></div>
            <div class="card"><div class="card-title"><h3>Linha temporal</h3></div><div class="timeline">${timeline.map(t=>`<div class="timeline-item"><small>${escapeHtml(t.date)}</small><div class="timeline-content"><strong>${escapeHtml(t.title)}</strong><p>${escapeHtml(t.text)}</p></div></div>`).join('')}</div></div>
          </div>
        </section>
      </div>`;
  }

  function renderProvas() {
    const f = state.filters.provas;
    const list = state.data.provas.filter(p => matchText(p, f.q, ['nome','tipo','ambito','local','organizador','classes']) && matchFilters(p, f, { tipo:'tipo', ambito:'ambito', local:'local', estado:'estado', estadoDocumental:'estadoDocumental' }));
    return `<section class="card">
      ${toolbar('provas', [
        inputFilter('provas','q','Pesquisar prova, local, classe ou clube'),
        selectFilter('provas','tipo','Tipo', unique(state.data.provas.map(p=>p.tipo))),
        selectFilter('provas','ambito','Âmbito', unique(state.data.provas.map(p=>p.ambito))),
        selectFilter('provas','local','Local', unique(state.data.provas.map(p=>p.local))),
        selectFilter('provas','estado','Estado', unique(state.data.provas.map(p=>p.estado))),
        selectFilter('provas','estadoDocumental','Documentos', unique(state.data.provas.map(p=>p.estadoDocumental)))
      ], 'modalProva')}
      ${table(['Prova','Tipo','Datas','Local','Organização','Classes','Barcos','Equipa','Documentos','Relatório','Ações'], list.map(p => [
        titleSub(p.nome, `${p.ambito} · ${p.campos}`), p.tipo, `${formatDate(p.inicio)} — ${formatDate(p.fim)}`, p.local, p.organizador, p.classes, String(p.barcos), teamStatus(p), docStateBadge(p.estadoDocumental), reportStateBadge(currentReportStateForRace(p.id)), actions([
          ['Detalhe','showRaceDetail',p.id], ['Editar','modalProva',p.id], ['Nomear','goNominationRace',p.id], ['Checklist','showRaceChecklist',p.id], ['Histórico','showRaceHistory',p.id]
        ])
      ]))}
      ${!list.length ? emptyState('Sem provas para os filtros aplicados.', 'Ajuste os filtros ou registe uma nova prova.') : ''}
    </section>`;
  }

  function renderNomeacoes() {
    const p = race(state.selectedRaceId) || state.data.provas[0];
    if (!p) return emptyState('Sem provas registadas.', 'Registe uma prova para preparar nomeações.');
    const nominations = state.data.nomeacoes.filter(n => n.provaId === p.id);
    const needs = Object.entries(p.necessidades);
    return `
      <div class="grid two-col">
        <section class="card">
          <div class="card-title"><div><h3>Prova selecionada</h3><p>Necessidades, equipa e validações de nomeação.</p></div>${statusBadge(p.estado)}</div>
          <select class="select" data-action="select-race" aria-label="Escolher prova">${state.data.provas.map(r=>`<option value="${r.id}" ${r.id===p.id?'selected':''}>${escapeHtml(r.nome)} · ${formatDate(r.inicio)}</option>`).join('')}</select>
          <div class="list" style="margin-top:14px">${needs.map(([funcao, qty]) => needItem(p, funcao, qty)).join('')}</div>
        </section>
        <section class="card">
          <div class="card-title"><div><h3>Árbitros elegíveis e validações</h3><p>Bloqueios, alertas críticos e alertas moderados antes da nomeação.</p></div>${button('Nova nomeação','modalNomeacao',p.id,'primary')}</div>
          <div class="list">${state.data.arbitros.map(a => candidateItem(a,p)).join('')}</div>
        </section>
      </div>
      <section class="card" style="margin-top:16px">
        <div class="card-title"><div><h3>Equipa nomeada</h3><p>Estados e decisões auditáveis.</p></div>${button('Exportar CSV','exportCsv','nomeacoes')}</div>
        ${table(['Árbitro','Função','Estado','Validação','Justificação','Ações'], nominations.map(n => {
          const a = referee(n.arbitroId); const validation = validateAppointment(a,p,n.funcao);
          return [titleSub(a?.nome || 'Árbitro removido', `${a?.categoria || ''} · ${a?.graduacao || ''}`), n.funcao, nominationStateBadge(n.estado), validationSummary(validation), n.justificacao || '—', actions([
            ['Aceitar','changeNominationState',n.id,'Aceite'], ['Recusar','refuseNomination',n.id], ['Substituir','substituteNomination',n.id], ['Cancelar','changeNominationState',n.id,'Cancelada'], ['Concluir','changeNominationState',n.id,'Concluída']
          ])];
        }))}
        ${!nominations.length ? emptyState('Sem nomeações nesta prova.', 'Use as necessidades da prova para iniciar a equipa de arbitragem.') : ''}
      </section>`;
  }

  function renderDisponibilidades() {
    const f = state.filters.disponibilidades;
    const records = state.data.disponibilidades.filter(d => {
      const a = referee(d.arbitroId); const p = race(d.provaId);
      return (!f.q || `${a?.nome} ${p?.nome} ${d.estado}`.toLowerCase().includes(f.q.toLowerCase())) && (!f.categoria || a?.categoria === f.categoria) && (!f.regiao || a?.regiao === f.regiao) && (!f.graduacao || a?.graduacao === f.graduacao) && (!f.estado || d.estado === f.estado);
    });
    const missing = refereesWithoutAvailability();
    return `<section class="card">
      ${toolbar('disponibilidades', [
        inputFilter('disponibilidades','q','Pesquisar árbitro ou prova'),
        selectFilter('disponibilidades','categoria','Categoria', unique(state.data.arbitros.map(a=>a.categoria))),
        selectFilter('disponibilidades','regiao','Região', unique(state.data.arbitros.map(a=>a.regiao))),
        selectFilter('disponibilidades','graduacao','Graduação', unique(state.data.arbitros.map(a=>a.graduacao))),
        selectFilter('disponibilidades','estado','Estado', ['Disponível','Indisponível','Condicionado','Por confirmar'])
      ], 'modalDisponibilidade')}
      <div class="grid three-col" style="margin-bottom:16px">
        <div class="risk-box"><strong>${records.length}</strong><p>Registos de disponibilidade filtrados</p></div>
        <div class="risk-box ${missing.length?'moderate':''}"><strong>${missing.length}</strong><p>Árbitros sem mapa atualizado</p></div>
        <div class="risk-box"><strong>${state.data.disponibilidades.filter(d=>d.estado==='Indisponível').length}</strong><p>Indisponibilidades declaradas</p></div>
      </div>
      ${table(['Árbitro','Prova/Data','Estado','Última atualização','Observações','Ações'], records.map(d => [
        titleSub(referee(d.arbitroId)?.nome || '—', referee(d.arbitroId)?.categoria || ''), titleSub(race(d.provaId)?.nome || 'Disponibilidade geral', formatDate(d.data)), statusBadge(d.estado), formatDate(d.atualizadoEm), d.observacoes || '—', actions([['Editar','modalDisponibilidade',d.id], ['Pedido atualização','sendAvailabilityRequest',d.arbitroId]])
      ]))}
      <div style="margin-top:16px" class="card-title"><h3>Mapas em falta</h3>${button('Gerar pedidos','generateMissingAvailabilityRequests')}</div>
      <div class="list">${missing.length ? missing.map(a=>`<div class="list-item"><div><strong>${escapeHtml(a.nome)}</strong><p>${escapeHtml(a.categoria)} · ${escapeHtml(a.regiao)} · última atualização: ${formatDate(a.ultimaDisponibilidade)}</p></div>${button('Pedir atualização','sendAvailabilityRequest',a.id,'warning')}</div>`).join('') : emptyState('Todos os árbitros têm mapa registado.', 'Não existem pedidos pendentes de atualização de disponibilidade.')}</div>
    </section>`;
  }

  function renderCredenciacao() {
    const list = state.data.arbitros;
    return `<section class="card">
      <div class="card-title"><div><h3>Licenças, formação e graduação</h3><p>Estado de credenciação e alertas de renovação nos próximos 60 dias.</p></div>${button('Exportar CSV','exportCsv','arbitros')}</div>
      ${table(['Árbitro','Categoria','Graduação','Licença','Validade','Formação/Seminários','Exames','Avaliações','Requisitos','Estado','Ações'], list.map(a => [
        titleSub(a.nome,a.codigo), a.categoria, a.graduacao, statusBadge(a.licenca), formatDate(a.validadeLicenca), titleSub(a.formacao,a.seminarios), a.exames, String(a.avaliacoes), requirementsText(a), credentialBadge(a), actions([['Rever','showCredentialDetail',a.id], ['Editar','modalArbitro',a.id]])
      ]))}
    </section>`;
  }

  function renderRelatorios() {
    updateReportsStatus();
    const list = state.data.relatorios;
    return `<section class="card">
      <div class="card-title"><div><h3>Relatórios pós-prova</h3><p>Prazo automático: 5 dias após o fim da prova.</p></div>${button('Registar relatório','modalRelatorio',0,'primary')} ${button('Exportar CSV','exportCsv','relatorios')}</div>
      ${table(['Prova','Árbitro responsável','Fim da prova','Prazo','Estado','Observações','Ações'], list.map(r => {
        const p = race(r.provaId), a = referee(r.arbitroId);
        return [titleSub(p?.nome || '—', p?.tipo || ''), a?.nome || '—', formatDate(p?.fim), formatDate(r.prazo), reportStateBadge(r.estado), r.observacoes, actions([['Entregue','deliverReport',r.id], ['Validar','setReportState',r.id,'Validado'], ['Devolver','setReportState',r.id,'Devolvido'], ['Documento','attachReportDocument',r.id], ['Detalhe','showReportDetail',r.id]])];
      }))}
    </section>`;
  }

  function renderConflitos() {
    const list = state.data.conflitos;
    return `<section class="card">
      <div class="card-title"><div><h3>Conflitos de interesse</h3><p>Registo e decisão pelo Conselho competente, com impacto direto na nomeação.</p></div>${button('Registar conflito','modalConflito',0,'primary')} ${button('Exportar CSV','exportCsv','conflitos')}</div>
      ${table(['Árbitro','Prova','Tipo','Estado','Impacto','Decisão','Responsável','Ações'], list.map(c => [
        referee(c.arbitroId)?.nome || '—', race(c.provaId)?.nome || '—', c.tipo, conflictStateBadge(c.estado), c.impacto, c.decisao, c.responsavel, actions([['Detalhe','showConflictDetail',c.id], ['Sem impedimento','decideConflict',c.id,'Sem impedimento'], ['Parcial','decideConflict',c.id,'Impedimento parcial'], ['Total','decideConflict',c.id,'Impedimento total'], ['Arquivar','decideConflict',c.id,'Arquivado']])
      ]))}
    </section>`;
  }

  function renderDocumentos() {
    const list = state.data.documentos;
    return `<section class="card">
      <div class="card-title"><div><h3>Gestão documental</h3><p>Arquivo por tipo, prova, árbitro, versão e estado.</p></div>${button('Adicionar documento','modalDocumento',0,'primary')} ${button('Exportar CSV','exportCsv','documentos')}</div>
      ${table(['Documento','Tipo','Prova','Árbitro','Versão','Estado','Data','Responsável','Ações'], list.map(d => [
        titleSub(d.nome,d.observacoes), d.tipo, race(d.provaId)?.nome || '—', referee(d.arbitroId)?.nome || '—', d.versao, docStateBadge(d.estado), formatDate(d.data), d.responsavel, actions([['Detalhe','showDocumentDetail',d.id], ['Validar','setDocumentState',d.id,'Válido'], ['Rejeitar','setDocumentState',d.id,'Rejeitado'], ['Arquivar','setDocumentState',d.id,'Arquivado'], ['Remover','removeDocument',d.id]])
      ]))}
    </section>`;
  }

  function renderComunicacoes() {
    const list = state.data.comunicacoes;
    return `<section class="card">
      <div class="card-title"><div><h3>Comunicações e notificações</h3><p>Pedidos de confirmação, relatórios, mapas, conflitos e documentação.</p></div>${button('Nova comunicação','modalComunicacao',0,'primary')}</div>
      ${table(['Destinatário','Tipo','Mensagem','Estado','Data','Prioridade','Entidade','Ações'], list.map(c => [
        c.destinatario, c.tipo, c.mensagem, communicationStateBadge(c.estado), c.data, priorityBadge(c.prioridade), c.entidade, actions([['Lida','setCommunicationState',c.id,'Lida'], ['Respondida','setCommunicationState',c.id,'Respondida'], ['Arquivar','setCommunicationState',c.id,'Arquivada'], ['Detalhe','showCommunicationDetail',c.id]])
      ]))}
    </section>`;
  }

  function renderHonorarios() {
    const list = state.data.honorarios;
    return `<section class="card">
      <div class="card-title"><div><h3>Honorários e workflow financeiro</h3><p>Cálculo interno: dias × valor/dia + quilómetros × valor/km + despesas.</p></div>${button('Novo registo','modalHonorario',0,'primary')} ${button('Exportar CSV','exportCsv','honorarios')}</div>
      ${table(['Prova','Árbitro','Função','Dias','Valor/dia','KM','Valor/KM','Despesas','Total','Estado','Ações'], list.map(h => [
        race(h.provaId)?.nome || '—', referee(h.arbitroId)?.nome || '—', h.funcao, String(h.dias), money(h.valorDia), String(h.km), money(h.valorKm), money(h.despesas), money(calculateHonorarium(h)), financeStateBadge(h.estado), actions([['Detalhe','showHonorariumDetail',h.id], ['Submeter','setHonorariumState',h.id,'Submetido'], ['Aprovar','setHonorariumState',h.id,'Aprovado'], ['Devolver','setHonorariumState',h.id,'Devolvido'], ['Pago','setHonorariumState',h.id,'Pago']])
      ]))}
    </section>`;
  }

  function renderAuditoria() {
    const list = state.data.auditoria;
    return `<section class="card">
      <div class="card-title"><div><h3>Auditoria e histórico</h3><p>Registo auditável de alterações, decisões e exportações.</p></div>${button('Exportar CSV','exportCsv','auditoria')}</div>
      ${table(['Data e hora','Utilizador','Ação','Entidade afetada','Estado anterior','Novo estado','Justificação','Origem'], list.map(a => [a.data,a.utilizador,a.acao,a.entidade,a.anterior,a.novo,a.justificacao,a.origem]))}
    </section>`;
  }

  function renderPerfis() {
    const perfis = [
      ['Administrador da Federação', 'Total', 'Total', 'Total', 'Total', 'Total', 'Gere configurações e utilizadores.'],
      ['Federação / Conselho Nacional', 'Total', 'Decide', 'Valida', 'Valida', 'Consulta total', 'Visibilidade nacional e regras de negócio.'],
      ['Conselho Regional', 'Regional', 'Analisa regional', 'Consulta/propõe', 'Acompanha', 'Regional', 'Gere quadros e escalas da região.'],
      ['Responsável Operacional de Arbitragem', 'Prepara/acompanha', 'Regista', 'Consulta', 'Gere', 'Operacional', 'Cria provas, nomeações e acompanha relatórios.'],
      ['Árbitro', 'Próprias', 'Declara', 'Consulta própria', 'Submete', 'Própria', 'Atualiza disponibilidade, conflitos e relatórios.'],
      ['Clube Organizador', 'Consulta da sua prova', 'Sem acesso', 'Sem acesso', 'Consulta', 'Limitado', 'Consulta equipa, documentos e estado operacional.'],
      ['Consulta/Auditoria', 'Leitura', 'Leitura', 'Leitura', 'Leitura', 'Leitura', 'Consulta dados autorizados e histórico.']
    ];
    return `<div class="grid three-col">${perfis.map(p=>`<section class="card"><h3>${escapeHtml(p[0])}</h3><p>${escapeHtml(p[6])}</p>${badge('info','Preparado para autenticação futura')}</section>`).join('')}</div>
      <section class="card" style="margin-top:16px"><div class="card-title"><h3>Matriz de permissões</h3></div>${table(['Perfil','Nomeações','Conflitos','Licenças/graduação','Relatórios','Auditoria'], perfis.map(p=>[p[0],p[1],p[2],p[3],p[4],p[5]]))}</section>`;
  }

  function handleAction(action, data, event = null) {
    const fn = actionsMap[action];
    if (!fn) {
      toast('Ação indisponível neste contexto.');
      console.warn('Ação sem função associada:', action);
      return;
    }
    try { fn(data, event); } catch (error) { console.error('Erro na ação:', action, error); toast('Não foi possível concluir a ação.'); }
  }

  const actionsMap = {
    'navigate': d => navigateTo(d.target),
    'filter': d => { state.filters[d.module][d.field] = d.value || ''; safeRender(state.page); },
    'clear-filters': d => { state.filters[d.module] = {}; safeRender(state.page); },
    'save-local': () => saveData(true),
    'reset-data': resetData,
    'select-race': (d, event) => { state.selectedRaceId = Number(event?.target?.value || state.selectedRaceId); safeRender('nomeacoes'); },
    modalArbitro: d => modalArbitro(Number(d.id) || null), modalProva: d => modalProva(Number(d.id) || null), modalNomeacao: d => modalNomeacao(Number(d.id) || state.selectedRaceId, null, ''), modalDisponibilidade: d => modalDisponibilidade(Number(d.id) || null), modalDocumento: () => modalDocumento(), modalConflito: () => modalConflito(), modalRelatorio: () => modalRelatorio(), modalComunicacao: () => modalComunicacao(), modalHonorario: () => modalHonorario(),
    selectProfile: d => { state.selectedRefereeId = Number(d.id); navigateTo('perfil'); },
    modalNomeacaoForRef: d => modalNomeacao(state.selectedRaceId, Number(d.id), ''), modalDisponibilidadeForRef: d => modalDisponibilidade(null, Number(d.id)), modalDocumentoForRef: d => modalDocumento(Number(d.id), null), modalConflitoForRef: d => modalConflito(Number(d.id), null),
    markUnavailable: d => markUnavailable(Number(d.id)), showRefereeHistory: d => showRefereeHistory(Number(d.id)), exportReferee: d => exportReferee(Number(d.id)),
    showRaceDetail: d => showRaceDetail(Number(d.id)), goNominationRace: d => { state.selectedRaceId = Number(d.id); navigateTo('nomeacoes'); }, showRaceChecklist: d => showRaceChecklist(Number(d.id)), showRaceHistory: d => showRaceHistory(Number(d.id)),
    saveArbitro: () => saveArbitro(), saveProva: () => saveProva(), saveNomeacao: () => saveNomeacao(), saveDisponibilidade: () => saveDisponibilidade(), saveDocumento: () => saveDocumento(), saveConflito: () => saveConflito(), saveRelatorio: () => saveRelatorio(), saveComunicacao: () => saveComunicacao(), saveHonorario: () => saveHonorario(),
    changeNominationState: d => changeNominationState(Number(d.id), d.extra), refuseNomination: d => refuseNomination(Number(d.id)), substituteNomination: d => substituteNomination(Number(d.id)),
    sendAvailabilityRequest: d => sendAvailabilityRequest(Number(d.id)), generateMissingAvailabilityRequests: generateMissingAvailabilityRequests,
    showCredentialDetail: d => showCredentialDetail(Number(d.id)), deliverReport: d => deliverReport(Number(d.id)), setReportState: d => setReportState(Number(d.id), d.extra), attachReportDocument: d => attachReportDocument(Number(d.id)), showReportDetail: d => showReportDetail(Number(d.id)),
    showConflictDetail: d => showConflictDetail(Number(d.id)), decideConflict: d => decideConflict(Number(d.id), d.extra),
    showDocumentDetail: d => showDocumentDetail(Number(d.id)), setDocumentState: d => setDocumentState(Number(d.id), d.extra), removeDocument: d => removeDocument(Number(d.id)),
    setCommunicationState: d => setCommunicationState(Number(d.id), d.extra), showCommunicationDetail: d => showCommunicationDetail(Number(d.id)),
    showHonorariumDetail: d => showHonorariumDetail(Number(d.id)), setHonorariumState: d => setHonorariumState(Number(d.id), d.extra),
    exportCsv: d => exportCsv(d.id || d.extra)
  };

  // Modals and save actions
  function openModal(title, body, footer = '') {
    const safeTitle = title && String(title).trim() ? title : 'Informação';
    const safeBody = body && String(body).trim() ? body : `<div class="empty-state"><strong>Conteúdo indisponível</strong><p>Esta ação não devolveu dados para apresentar. A aplicação manteve-se estável.</p></div>`;
    el('modalTitle').textContent = safeTitle;
    el('modalBody').innerHTML = safeBody;
    el('modalActions').innerHTML = footer || `<button class="button primary" type="button" onclick="APP.closeModal()">Fechar</button>`;
    el('modalLayer').classList.add('show');
    el('modalLayer').setAttribute('aria-hidden', 'false');
    el('modalClose').focus();
  }

  function closeModal() {
    el('modalLayer').classList.remove('show');
    el('modalLayer').setAttribute('aria-hidden', 'true');
  }

  function modalArbitro(id) {
    const a = id ? referee(id) : {};
    openModal(id ? 'Editar árbitro' : 'Novo árbitro', `<form id="formArbitro" class="form-grid">
      ${hidden('id', a.id || '')}${field('nome','Nome',a.nome || '', true)}${field('codigo','Código interno',a.codigo || nextCode('ARB'), true)}
      ${selectField('categoria','Categoria',a.categoria || 'Juiz',['Oficial de Regata','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional'])}${selectField('graduacao','Graduação',a.graduacao || 'Regional/Grau 1',['Clube','Regional/Grau 1','Nacional/Grau 2','Nacional'])}
      ${selectField('licenca','Licença',a.licenca || 'Válida',['Válida','Expirada','Suspensa','Por validar'])}${field('validadeLicenca','Validade da licença',a.validadeLicenca || '2027-01-01', true, 'date')}
      ${field('regiao','Região',a.regiao || '', true)}${field('contacto','Contacto de ambiente interno',a.contacto || '', true)}
      ${selectField('disponibilidade','Disponibilidade',a.disponibilidade || 'Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}${field('ultimaDisponibilidade','Última atualização de disponibilidade',a.ultimaDisponibilidade || isoDate(TODAY), true, 'date')}
      ${field('formacao','Formação recente',a.formacao || '')}${field('seminarios','Seminários',a.seminarios || '')}${field('exames','Exames',a.exames || '')}
      ${field('provasRealizadas','Provas realizadas',a.provasRealizadas || 0, true, 'number')}${field('avaliacoes','Avaliações positivas',a.avaliacoes || 0, true, 'number')}${field('relatoriosAtraso','Relatórios em atraso',a.relatoriosAtraso || 0, true, 'number')}
      ${selectField('estado','Estado operacional',a.estado || 'Ativo',['Ativo','Condicionado','Suspenso','Inativo'])}
      <div class="field full"><label>Observações internas</label><textarea class="textarea" name="observacoes" rows="4">${escapeHtml(a.observacoes || '')}</textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveArbitro">Guardar árbitro</button>`);
  }

  function saveArbitro() {
    const f = formData('formArbitro');
    if (!f.nome || !f.codigo) return toast('Preencha o nome e o código interno.');
    const id = Number(f.id);
    const payload = { id: id || nextId(state.data.arbitros), codigo: f.codigo, nome: f.nome, categoria: f.categoria, graduacao: f.graduacao, licenca: f.licenca, validadeLicenca: f.validadeLicenca, regiao: f.regiao, contacto: f.contacto, disponibilidade: f.disponibilidade, ultimaDisponibilidade: f.ultimaDisponibilidade, formacao: f.formacao, seminarios: f.seminarios, exames: f.exames, provasRealizadas: Number(f.provasRealizadas), avaliacoes: Number(f.avaliacoes), relatoriosAtraso: Number(f.relatoriosAtraso), estado: f.estado, observacoes: f.observacoes };
    const index = state.data.arbitros.findIndex(a => a.id === id);
    if (index >= 0) { state.data.arbitros[index] = payload; audit('Árbitro editado', payload.nome, 'Ficha anterior', 'Ficha atualizada', 'Atualização de dados operacionais.', 'Árbitros'); }
    else { state.data.arbitros.push(payload); audit('Árbitro criado', payload.nome, 'Inexistente', 'Registado', 'Novo registo de ambiente interno.', 'Árbitros'); }
    saveData(false); closeModal(); safeRender(state.page); toast('Árbitro guardado.');
  }

  function modalProva(id) {
    const p = id ? race(id) : {};
    openModal(id ? 'Editar prova' : 'Nova prova', `<form id="formProva" class="form-grid">
      ${hidden('id', p.id || '')}${field('nome','Nome da prova',p.nome || '', true)}${selectField('tipo','Tipo',p.tipo || 'Campeonato Regional',['Campeonato Nacional','Campeonato de Portugal','Prova de Apuramento Nacional','Taça de Portugal','Campeonato Regional','Prova de Clube','Prova Internacional','Outra'])}
      ${selectField('ambito','Âmbito',p.ambito || 'Regional',['Clube','Regional','Nacional','Internacional'])}${field('inicio','Data de início',p.inicio || isoDate(TODAY), true, 'date')}${field('fim','Data de fim',p.fim || isoDate(TODAY), true, 'date')}
      ${field('local','Local',p.local || '', true)}${field('organizador','Clube/autoridade organizadora',p.organizador || '', true)}${field('classes','Classes',p.classes || '', true)}${field('barcos','N.º previsto de barcos',p.barcos || 20, true, 'number')}${field('campos','Campos de regata',p.campos || '')}
      ${selectField('estado','Estado da prova',p.estado || 'Planeada',['Planeada','Em preparação','Nomeações pendentes','Equipa completa','Em curso','Concluída','Encerrada'])}${selectField('estadoDocumental','Estado documental',p.estadoDocumental || 'Incompleto',['Incompleto','Aguardando validação','Validado','Arquivado'])}${selectField('relatorioFinal','Relatório final',p.relatorioFinal || 'Pendente',['Pendente','Entregue','Em atraso','Validado','Devolvido'])}
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveProva">Guardar prova</button>`);
  }

  function saveProva() {
    const f = formData('formProva');
    if (!f.nome || !f.inicio || !f.fim) return toast('Preencha nome e datas da prova.');
    const id = Number(f.id);
    const previous = id ? race(id) : null;
    const payload = { id: id || nextId(state.data.provas), nome: f.nome, tipo: f.tipo, ambito: f.ambito, inicio: f.inicio, fim: f.fim, local: f.local, organizador: f.organizador, classes: f.classes, barcos: Number(f.barcos), campos: f.campos, estado: f.estado, estadoDocumental: f.estadoDocumental, relatorioFinal: f.relatorioFinal, necessidades: previous?.necessidades || { 'Oficial de Regata': 1, 'Juiz': 1 }, checklist: previous?.checklist || checklistBase(false) };
    const index = state.data.provas.findIndex(p => p.id === id);
    if (index >= 0) { state.data.provas[index] = payload; audit('Prova alterada', payload.nome, previous.estado, payload.estado, 'Atualização de dados de prova.', 'Provas'); }
    else { state.data.provas.push(payload); audit('Prova criada', payload.nome, 'Inexistente', payload.estado, 'Nova prova registada.', 'Provas'); }
    if (payload.estado === 'Concluída') ensureReportForRace(payload.id);
    saveData(false); closeModal(); safeRender(state.page); toast('Prova guardada.');
  }

  function modalNomeacao(provaId, arbitroId = null, funcao = '') {
    const p = race(provaId) || race(state.selectedRaceId) || state.data.provas[0];
    const a = arbitroId ? referee(arbitroId) : state.data.arbitros[0];
    const currentFunction = funcao || Object.keys(p.necessidades)[0] || 'Juiz';
    const validation = validateAppointment(a, p, currentFunction);
    openModal('Preparar nomeação', `<form id="formNomeacao" class="form-grid">
      ${selectField('provaId','Prova',p.id,state.data.provas.map(x=>[x.id,`${x.nome} · ${formatDate(x.inicio)}`]))}${selectField('arbitroId','Árbitro',a?.id,state.data.arbitros.map(x=>[x.id,`${x.nome} · ${x.categoria} · ${x.graduacao}`]))}
      ${selectField('funcao','Função',currentFunction,['Presidente da Comissão de Regata','Oficial de Regata','Presidente da Comissão de Protestos','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional','Apoio técnico','Secretariado de prova','Outra função'])}${selectField('estado','Estado','Rascunho',['Rascunho','Enviada','Pendente de resposta','Aceite','Recusada','Substituída','Cancelada','Concluída'])}
      <div class="field full"><label>Justificação / decisão operacional</label><textarea class="textarea" name="justificacao" rows="4" placeholder="Obrigatório para alertas críticos.">${escapeHtml(validation.critical.join('; '))}</textarea></div>
      <div class="field full"><div class="risk-box ${validation.blocks.length?'block':validation.critical.length?'critical':validation.moderate.length?'moderate':''}"><strong>Validação automática</strong><p>${validationSummary(validation)}</p></div></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveNomeacao">Guardar nomeação</button>`);
  }

  function saveNomeacao() {
    const f = formData('formNomeacao');
    const p = race(Number(f.provaId)); const a = referee(Number(f.arbitroId));
    const validation = validateAppointment(a, p, f.funcao);
    if (validation.blocks.length) return toast(`Nomeação bloqueada: ${validation.blocks[0]}`);
    if (validation.critical.length && !f.justificacao.trim()) return toast('Alertas críticos exigem justificação antes de avançar.');
    state.data.nomeacoes.push({ id: nextId(state.data.nomeacoes), provaId: p.id, arbitroId: a.id, funcao: f.funcao, estado: f.estado, justificacao: f.justificacao || validation.moderate.join('; '), data: isoDate(TODAY) });
    if (['Enviada','Pendente de resposta','Aceite'].includes(f.estado)) ensureHonorariumForNomination(p, a, f.funcao);
    audit('Nomeação criada', p.nome, 'Sem nomeação', `${a.nome} · ${f.funcao} · ${f.estado}`, f.justificacao || validationSummary(validation), 'Nomeações');
    state.selectedRaceId = p.id; saveData(false); closeModal(); navigateTo('nomeacoes'); toast(validation.critical.length || validation.moderate.length ? 'Nomeação guardada com alertas registados.' : 'Nomeação guardada sem risco operacional.');
  }

  function modalDisponibilidade(recordId = null, refId = null) {
    const d = recordId ? state.data.disponibilidades.find(x => x.id === recordId) : {};
    openModal(recordId ? 'Editar disponibilidade' : 'Registar disponibilidade', `<form id="formDisponibilidade" class="form-grid">
      ${hidden('id', d.id || '')}${selectField('arbitroId','Árbitro',d.arbitroId || refId || state.data.arbitros[0].id,state.data.arbitros.map(a=>[a.id,a.nome]))}${selectField('provaId','Prova associada',d.provaId || state.selectedRaceId,state.data.provas.map(p=>[p.id,p.nome]))}${field('data','Data',d.data || isoDate(TODAY), true, 'date')}${selectField('estado','Estado',d.estado || 'Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}${field('atualizadoEm','Data da atualização',d.atualizadoEm || isoDate(TODAY), true, 'date')}<div class="field full"><label>Observações</label><textarea class="textarea" name="observacoes" rows="3">${escapeHtml(d.observacoes || '')}</textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveDisponibilidade">Guardar disponibilidade</button>`);
  }

  function saveDisponibilidade() {
    const f = formData('formDisponibilidade'); const id = Number(f.id);
    const payload = { id: id || nextId(state.data.disponibilidades), arbitroId: Number(f.arbitroId), provaId: Number(f.provaId), data: f.data, estado: f.estado, observacoes: f.observacoes, atualizadoEm: f.atualizadoEm };
    const index = state.data.disponibilidades.findIndex(x => x.id === id);
    if (index >= 0) state.data.disponibilidades[index] = payload; else state.data.disponibilidades.push(payload);
    const a = referee(payload.arbitroId); const previous = a.disponibilidade; a.disponibilidade = payload.estado; a.ultimaDisponibilidade = payload.atualizadoEm;
    audit('Disponibilidade atualizada', a.nome, previous, payload.estado, payload.observacoes || 'Atualização de mapa de disponibilidade.', 'Disponibilidades');
    saveData(false); closeModal(); safeRender(state.page); toast('Disponibilidade registada.');
  }

  function modalDocumento(refId = null, raceId = null) {
    openModal('Adicionar documento', `<form id="formDocumento" class="form-grid">
      ${field('nome','Nome do documento','Novo documento.pdf', true)}${selectField('tipo','Tipo','Relatórios',['Regulamentos','Regras de regata','Prescrições','Avisos de regata','Instruções de regata','Relatórios','Mapas de disponibilidade','Atas','Decisões','Protestos','Formulários','Avaliações','Certificados','Outros'])}${selectField('provaId','Prova associada',raceId || 0,[[0,'Sem prova'],...state.data.provas.map(p=>[p.id,p.nome])])}${selectField('arbitroId','Árbitro associado',refId || 0,[[0,'Sem árbitro'],...state.data.arbitros.map(a=>[a.id,a.nome])])}${field('versao','Versão','1.0')}${selectField('estado','Estado','Por validar',['Válido','Por validar','Em falta','Rejeitado','Arquivado'])}${field('responsavel','Responsável','Secretariado FPV')}<div class="field full"><label>Observações</label><textarea class="textarea" name="observacoes" rows="3"></textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveDocumento">Adicionar documento</button>`);
  }

  function saveDocumento() {
    const f = formData('formDocumento');
    const doc = { id: nextId(state.data.documentos), nome: f.nome, tipo: f.tipo, provaId: Number(f.provaId) || null, arbitroId: Number(f.arbitroId) || null, versao: f.versao, estado: f.estado, data: isoDate(TODAY), responsavel: f.responsavel, observacoes: f.observacoes };
    state.data.documentos.unshift(doc); audit('Documento adicionado', doc.nome, 'Inexistente', doc.estado, doc.observacoes || 'Registo documental criado.', 'Documentos');
    saveData(false); closeModal(); safeRender(state.page); toast('Documento registado.');
  }

  function modalConflito(refId = null, raceId = null) {
    openModal('Registar conflito de interesse', `<form id="formConflito" class="form-grid">
      ${selectField('arbitroId','Árbitro',refId || state.data.arbitros[0].id,state.data.arbitros.map(a=>[a.id,a.nome]))}${selectField('provaId','Prova',raceId || state.selectedRaceId,state.data.provas.map(p=>[p.id,p.nome]))}${selectField('tipo','Tipo','Ligação a clube',['Ligação a clube','Ligação a atleta','Ligação a equipa','Relação familiar','Relação profissional','Interesse financeiro','Participação anterior relevante','Outro'])}${selectField('estado','Estado','Declarado',['Declarado','Em análise','Sem impedimento','Impedimento parcial','Impedimento total','Resolvido','Arquivado'])}${field('responsavel','Responsável pela decisão','Conselho de Arbitragem')}<div class="field full"><label>Descrição</label><textarea class="textarea" name="descricao" rows="3"></textarea></div><div class="field full"><label>Decisão</label><textarea class="textarea" name="decisao" rows="3">A aguardar análise.</textarea></div><div class="field full"><label>Observações</label><textarea class="textarea" name="observacoes" rows="3"></textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveConflito">Registar conflito</button>`);
  }

  function saveConflito() {
    const f = formData('formConflito'); const c = { id: nextId(state.data.conflitos), arbitroId: Number(f.arbitroId), provaId: Number(f.provaId), tipo: f.tipo, descricao: f.descricao, estado: f.estado, decisao: f.decisao, responsavel: f.responsavel, observacoes: f.observacoes, impacto: conflictImpact(f.estado), dataRegisto: isoDate(TODAY), dataDecisao: ['Sem impedimento','Impedimento parcial','Impedimento total','Resolvido','Arquivado'].includes(f.estado) ? isoDate(TODAY) : '' };
    state.data.conflitos.unshift(c); audit('Conflito declarado', race(c.provaId)?.nome || 'Prova', 'Sem registo', c.estado, c.descricao || c.tipo, 'Conflitos');
    saveData(false); closeModal(); safeRender(state.page); toast('Conflito de interesse registado.');
  }

  function modalRelatorio() {
    openModal('Registar relatório pós-prova', `<form id="formRelatorio" class="form-grid">
      ${selectField('provaId','Prova',state.data.provas[0].id,state.data.provas.map(p=>[p.id,p.nome]))}${selectField('arbitroId','Árbitro responsável',state.data.arbitros[0].id,state.data.arbitros.map(a=>[a.id,a.nome]))}${selectField('estado','Estado','Entregue',['Pendente','Entregue','Em atraso','Validado','Devolvido'])}<div class="field full"><label>Observações</label><textarea class="textarea" name="observacoes" rows="4">Relatório registado na plataforma operacional.</textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveRelatorio">Guardar relatório</button>`);
  }

  function saveRelatorio() {
    const f = formData('formRelatorio'), p = race(Number(f.provaId));
    const r = { id: nextId(state.data.relatorios), provaId: Number(f.provaId), arbitroId: Number(f.arbitroId), prazo: addDays(p.fim, REPORT_DAYS), estado: f.estado, observacoes: f.observacoes, documentoId: null };
    state.data.relatorios.unshift(r); p.relatorioFinal = f.estado;
    if (f.estado === 'Entregue') ensureHonorariumForReport(r);
    audit('Relatório registado', p.nome, 'Sem relatório', f.estado, f.observacoes, 'Relatórios'); saveData(false); closeModal(); safeRender(state.page); toast('Relatório registado.');
  }

  function modalComunicacao() {
    openModal('Nova comunicação interna', `<form id="formComunicacao" class="form-grid">
      ${field('destinatario','Destinatário','Conselho de Arbitragem', true)}${selectField('tipo','Tipo','Pedido de confirmação',['Nomeação enviada','Pedido de confirmação','Nomeação aceite','Nomeação recusada','Alteração de prova','Pedido de relatório','Relatório em atraso','Licença a expirar','Formação em falta','Conflito declarado','Documento validado','Documento rejeitado','Mapa de disponibilidade em falta','Alerta de nomeação a 3 meses'])}${selectField('estado','Estado','Enviada',['Enviada','Lida','Pendente','Respondida','Arquivada'])}${selectField('prioridade','Prioridade','Normal',['Normal','Alta','Crítica'])}${field('entidade','Entidade relacionada','Processo operacional')}<div class="field full"><label>Mensagem</label><textarea class="textarea" name="mensagem" rows="4"></textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveComunicacao">Enviar comunicação</button>`);
  }

  function saveComunicacao() {
    const f = formData('formComunicacao');
    state.data.comunicacoes.unshift({ id: nextId(state.data.comunicacoes), destinatario: f.destinatario, tipo: f.tipo, estado: f.estado, data: nowString(), prioridade: f.prioridade, mensagem: f.mensagem || 'Comunicação operacional registada.', entidade: f.entidade });
    audit('Comunicação enviada', f.entidade, 'Inexistente', f.estado, f.mensagem || f.tipo, 'Comunicações'); saveData(false); closeModal(); safeRender(state.page); toast('Comunicação registada.');
  }

  function modalHonorario() {
    openModal('Novo registo de honorários', `<form id="formHonorario" class="form-grid">
      ${selectField('provaId','Prova',state.data.provas[0].id,state.data.provas.map(p=>[p.id,p.nome]))}${selectField('arbitroId','Árbitro',state.data.arbitros[0].id,state.data.arbitros.map(a=>[a.id,a.nome]))}${field('funcao','Função','Oficial de Regata', true)}${field('dias','Dias de prova',1,true,'number')}${field('valorDia','Valor por dia',95,true,'number')}${field('km','Quilómetros',0,true,'number')}${field('valorKm','Valor por quilómetro',0.36,true,'number')}${field('despesas','Despesas adicionais',0,true,'number')}${selectField('estado','Estado','Por submeter',['Por submeter','Submetido','Em validação','Aprovado','Devolvido','Pago','Arquivado'])}<div class="field full"><label>Observações</label><textarea class="textarea" name="observacoes" rows="3"></textarea></div>
    </form>`, `<button class="button" type="button" onclick="APP.closeModal()">Cancelar</button><button class="button primary" type="button" data-action="saveHonorario">Guardar honorários</button>`);
  }

  function saveHonorario() {
    const f = formData('formHonorario');
    const h = { id: nextId(state.data.honorarios), provaId: Number(f.provaId), arbitroId: Number(f.arbitroId), funcao: f.funcao, dias: Number(f.dias), valorDia: Number(f.valorDia), km: Number(f.km), valorKm: Number(f.valorKm), despesas: Number(f.despesas), total: 0, estado: f.estado, dataSubmissao: f.estado === 'Por submeter' ? '' : isoDate(TODAY), observacoes: f.observacoes };
    h.total = calculateHonorarium(h); state.data.honorarios.unshift(h); audit('Honorários registados', race(h.provaId)?.nome || 'Prova', 'Inexistente', h.estado, `Total calculado: ${money(h.total)}`, 'Honorários'); saveData(false); closeModal(); safeRender(state.page); toast('Registo financeiro guardado.');
  }

  // Detail and state functions
  function markUnavailable(id) { const a = referee(id); const old = a.disponibilidade; a.disponibilidade = 'Indisponível'; a.ultimaDisponibilidade = isoDate(TODAY); audit('Disponibilidade atualizada', a.nome, old, 'Indisponível', 'Indisponibilidade marcada pela gestão interna.', 'Árbitros'); saveData(false); safeRender(state.page); toast(`${a.nome} marcado como indisponível.`); }
  function showRefereeHistory(id) { const a = referee(id); openModal(`Histórico de ${a.nome}`, `<div class="timeline">${buildTimeline(a, state.data.nomeacoes.filter(n=>n.arbitroId===id), state.data.relatorios.filter(r=>r.arbitroId===id), state.data.conflitos.filter(c=>c.arbitroId===id)).map(t=>`<div class="timeline-item"><small>${t.date}</small><div class="timeline-content"><strong>${t.title}</strong><p>${t.text}</p></div></div>`).join('')}</div>`); }
  function exportReferee(id) { const a = referee(id); exportRows(`fpv-ficha-${a.codigo}.csv`, [a]); audit('Exportação CSV', a.nome, 'Ficha', 'Exportada', 'Exportação de ficha individual.', 'Árbitros'); saveData(false); }
  function showRaceDetail(id) { const p = race(id); const noms = state.data.nomeacoes.filter(n=>n.provaId===id); openModal(`Detalhe da prova`, `<div class="grid two-col"><div class="card"><h3>${escapeHtml(p.nome)}</h3><div class="metric-list">${metric('Tipo',p.tipo)}${metric('Âmbito',p.ambito)}${metric('Datas',`${formatDate(p.inicio)} — ${formatDate(p.fim)}`)}${metric('Local',p.local)}${metric('Organização',p.organizador)}${metric('Classes',p.classes)}${metric('Campos',p.campos)}${metric('Barcos previstos',String(p.barcos))}</div></div><div class="card"><h3>Equipa nomeada</h3><div class="list">${noms.length?noms.map(n=>nominationItem(n)).join(''):emptyState('Sem equipa nomeada.','Abra Nomeações para preparar a equipa.')}</div></div></div>`, `<button class="button" onclick="APP.closeModal()">Fechar</button><button class="button primary" data-action="goNominationRace" data-id="${p.id}">Gerir nomeações</button>`); }
  function showRaceChecklist(id) { const p = race(id); openModal(`Checklist documental`, `<div class="list">${p.checklist.map((c,i)=>`<div class="list-item"><div><strong>${escapeHtml(c.nome)}</strong><p>Estado documental da prova ${escapeHtml(p.nome)}</p></div>${docStateBadge(c.estado)} <button class="button small" type="button" onclick="APP.toggleChecklist(${p.id},${i})">Alternar</button></div>`).join('')}</div>`); }
  function showRaceHistory(id) { const p = race(id); const rows = state.data.auditoria.filter(a=>a.entidade.includes(p.nome) || p.nome.includes(a.entidade)); openModal(`Histórico da prova`, rows.length ? `<div class="timeline">${rows.map(r=>`<div class="timeline-item"><small>${r.data}</small><div class="timeline-content"><strong>${r.acao}</strong><p>${r.justificacao}</p></div></div>`).join('')}</div>` : emptyState('Sem histórico específico.', 'Ainda não existem registos diretos desta prova na auditoria.')); }
  function changeNominationState(id, newState) { const n = state.data.nomeacoes.find(x=>x.id===id); const old = n.estado; n.estado = newState; if (newState === 'Aceite') ensureHonorariumForNomination(race(n.provaId), referee(n.arbitroId), n.funcao); audit(`Nomeação ${newState.toLowerCase()}`, race(n.provaId)?.nome || 'Prova', old, newState, n.justificacao || 'Alteração de estado de nomeação.', 'Nomeações'); saveData(false); safeRender(state.page); toast(`Nomeação marcada como ${newState}.`); }
  function refuseNomination(id) { const reason = prompt('Motivo da recusa:') || 'Recusa registada sem detalhe adicional.'; const n = state.data.nomeacoes.find(x=>x.id===id); const old = n.estado; n.estado = 'Recusada'; n.justificacao = reason; audit('Nomeação recusada', race(n.provaId)?.nome || 'Prova', old, 'Recusada', reason, 'Nomeações'); saveData(false); safeRender(state.page); toast('Recusa registada.'); }
  function substituteNomination(id) { const reason = prompt('Motivo da substituição:') || 'Substituição operacional.'; const n = state.data.nomeacoes.find(x=>x.id===id); const old = n.estado; n.estado = 'Substituída'; n.justificacao = reason; audit('Nomeação substituída', race(n.provaId)?.nome || 'Prova', old, 'Substituída', reason, 'Nomeações'); saveData(false); safeRender(state.page); toast('Substituição registada.'); }
  function sendAvailabilityRequest(id) { const a = referee(id); state.data.comunicacoes.unshift({ id: nextId(state.data.comunicacoes), destinatario: a.nome, tipo: 'Mapa de disponibilidade em falta', estado: 'Pendente', data: nowString(), prioridade: 'Alta', mensagem: 'Solicitada atualização do mapa de disponibilidade.', entidade: a.codigo }); audit('Pedido de mapa enviado', a.nome, 'Sem pedido', 'Pendente', 'Atualização de disponibilidade solicitada.', 'Disponibilidades'); saveData(false); safeRender(state.page); toast(`Pedido enviado a ${a.nome}.`); }
  function generateMissingAvailabilityRequests() { refereesWithoutAvailability().forEach(a => sendAvailabilityRequest(a.id)); }
  function showCredentialDetail(id) { const a = referee(id); openModal('Detalhe de credenciação', `<div class="grid two-col"><div class="card"><h3>${escapeHtml(a.nome)}</h3><div class="metric-list">${metric('Licença',a.licenca)}${metric('Validade',formatDate(a.validadeLicenca))}${metric('Categoria',a.categoria)}${metric('Graduação',a.graduacao)}${metric('Estado',credentialText(a))}</div></div><div class="card"><h3>Requisitos</h3><p>${requirementsText(a)}</p><p>${escapeHtml(a.formacao)} · ${escapeHtml(a.seminarios)}</p></div></div>`); }
  function deliverReport(id) { setReportStateRaw(id,'Entregue','Relatório entregue e associado ao processo pós-prova.'); }
  function setReportState(id,stateName) { setReportStateRaw(id,stateName,`Relatório marcado como ${stateName}.`); }
  function setReportStateRaw(id,stateName,reason){const r=state.data.relatorios.find(x=>x.id===id),old=r.estado;r.estado=stateName;if(stateName==='Entregue')ensureHonorariumForReport(r);const p=race(r.provaId);if(p)p.relatorioFinal=stateName;audit(`Relatório ${stateName.toLowerCase()}`,p?.nome||'Prova',old,stateName,reason,'Relatórios');saveData(false);safeRender(state.page);toast(`Relatório marcado como ${stateName}.`)}
  function attachReportDocument(id){const r=state.data.relatorios.find(x=>x.id===id);modalDocumento(r.arbitroId,r.provaId)}
  function showReportDetail(id){const r=state.data.relatorios.find(x=>x.id===id);openModal('Detalhe do relatório',`<div class="metric-list">${metric('Prova',race(r.provaId)?.nome||'—')}${metric('Árbitro',referee(r.arbitroId)?.nome||'—')}${metric('Prazo',formatDate(r.prazo))}${metric('Estado',r.estado)}${metric('Observações',r.observacoes)}</div>`)}
  function showConflictDetail(id){const c=state.data.conflitos.find(x=>x.id===id);openModal('Detalhe do conflito',`<div class="metric-list">${metric('Árbitro',referee(c.arbitroId)?.nome||'—')}${metric('Prova',race(c.provaId)?.nome||'—')}${metric('Tipo',c.tipo)}${metric('Estado',c.estado)}${metric('Impacto',c.impacto)}${metric('Decisão',c.decisao)}${metric('Responsável',c.responsavel)}${metric('Observações',c.observacoes)}</div>`)}
  function decideConflict(id,newState){const c=state.data.conflitos.find(x=>x.id===id),old=c.estado;c.estado=newState;c.impacto=conflictImpact(newState);c.dataDecisao=isoDate(TODAY);c.decisao=`Decisão registada: ${newState}.`;audit('Conflito decidido',race(c.provaId)?.nome||'Prova',old,newState,c.decisao,'Conflitos');saveData(false);safeRender(state.page);toast('Decisão de conflito registada.')}
  function showDocumentDetail(id){const d=state.data.documentos.find(x=>x.id===id);openModal('Detalhe documental',`<div class="metric-list">${metric('Documento',d.nome)}${metric('Tipo',d.tipo)}${metric('Prova',race(d.provaId)?.nome||'—')}${metric('Árbitro',referee(d.arbitroId)?.nome||'—')}${metric('Versão',d.versao)}${metric('Estado',d.estado)}${metric('Responsável',d.responsavel)}${metric('Observações',d.observacoes)}</div>`)}
  function setDocumentState(id,newState){const d=state.data.documentos.find(x=>x.id===id),old=d.estado;d.estado=newState;audit(`Documento ${newState.toLowerCase()}`,d.nome,old,newState,'Alteração de estado documental.','Documentos');saveData(false);safeRender(state.page);toast(`Documento marcado como ${newState}.`)}
  function removeDocument(id){const i=state.data.documentos.findIndex(x=>x.id===id);if(i<0)return;if(!confirm('Remover documento do registo local?'))return;const d=state.data.documentos.splice(i,1)[0];audit('Documento removido',d.nome,d.estado,'Removido','Remoção do registo local.','Documentos');saveData(false);safeRender(state.page);toast('Documento removido.')}
  function setCommunicationState(id,newState){const c=state.data.comunicacoes.find(x=>x.id===id),old=c.estado;c.estado=newState;audit(`Comunicação ${newState.toLowerCase()}`,c.entidade,old,newState,c.mensagem,'Comunicações');saveData(false);safeRender(state.page);toast(`Comunicação marcada como ${newState}.`)}
  function showCommunicationDetail(id){const c=state.data.comunicacoes.find(x=>x.id===id);openModal('Detalhe da comunicação',`<div class="metric-list">${metric('Destinatário',c.destinatario)}${metric('Tipo',c.tipo)}${metric('Estado',c.estado)}${metric('Prioridade',c.prioridade)}${metric('Entidade',c.entidade)}${metric('Mensagem',c.mensagem)}</div>`)}
  function showHonorariumDetail(id){const h=state.data.honorarios.find(x=>x.id===id);openModal('Detalhe de honorários',`<div class="metric-list">${metric('Prova',race(h.provaId)?.nome||'—')}${metric('Árbitro',referee(h.arbitroId)?.nome||'—')}${metric('Função',h.funcao)}${metric('Fórmula',`${h.dias} × ${money(h.valorDia)} + ${h.km} × ${money(h.valorKm)} + ${money(h.despesas)}`)}${metric('Total',money(calculateHonorarium(h)))}${metric('Estado',h.estado)}${metric('Observações',h.observacoes)}</div>`)}
  function setHonorariumState(id,newState){const h=state.data.honorarios.find(x=>x.id===id),old=h.estado;h.estado=newState;if(newState!=='Por submeter'&&!h.dataSubmissao)h.dataSubmissao=isoDate(TODAY);h.total=calculateHonorarium(h);audit('Honorários atualizados',race(h.provaId)?.nome||'Prova',old,newState,`Total: ${money(h.total)}`,'Honorários');saveData(false);safeRender(state.page);toast(`Honorários marcados como ${newState}.`)}
  function toggleChecklist(raceId,index){const p=race(raceId);const item=p.checklist[index];const old=item.estado;item.estado=item.estado==='Validado'?'Pendente':'Validado';p.estadoDocumental=p.checklist.every(x=>x.estado==='Validado')?'Validado':'Incompleto';audit('Checklist documental alterada',p.nome,old,item.estado,item.nome,'Documentos');saveData(false);showRaceChecklist(raceId);}

  // Business rules
  function validateAppointment(a, p, funcao) {
    const result = { blocks: [], critical: [], moderate: [] };
    if (!a || !p) { result.blocks.push('Árbitro ou prova inválidos.'); return result; }
    if (a.licenca === 'Expirada') result.blocks.push('Licença expirada.');
    if (a.licenca === 'Suspensa') result.blocks.push('Licença suspensa.');
    if (['Suspenso','Inativo'].includes(a.estado)) result.blocks.push(`Estado operacional ${a.estado.toLowerCase()}.`);
    if (hasTotalConflict(a.id,p.id)) result.blocks.push('Conflito de interesse com impedimento total.');
    if (isUnavailableForRace(a.id,p)) result.blocks.push('Indisponível na data da prova.');
    if (hasOverlappingAppointment(a.id,p.id)) result.blocks.push('Nomeação bloqueada: este árbitro já se encontra associado a outra prova em datas sobrepostas.');
    if (obviousCategoryMismatch(a,funcao)) result.blocks.push('Função incompatível com a categoria principal.');
    if (a.licenca === 'Por validar') result.critical.push('Licença por validar.');
    if (hasPendingConflict(a.id,p.id)) result.critical.push('Conflito de interesse em análise.');
    if (a.relatoriosAtraso > 0) result.critical.push('Relatório anterior em atraso.');
    if (insufficientGraduation(a,funcao)) result.critical.push('Graduação possivelmente insuficiente para a função.');
    if (categoryWarning(a,funcao)) result.critical.push('Nomeação fora da categoria principal.');
    if (!hasRecentAvailability(a.id)) result.critical.push('Ausência de mapa de disponibilidade recente.');
    if (a.disponibilidade === 'Por confirmar') result.moderate.push('Disponibilidade por confirmar.');
    if (daysUntil(a.validadeLicenca) <= EXPIRY_DAYS && daysUntil(a.validadeLicenca) >= 0) result.moderate.push('Licença a expirar dentro de 60 dias.');
    if (a.provasRealizadas > 45) result.moderate.push('Elevada carga de provas recentes.');
    if (locationDistanceWarning(a,p)) result.moderate.push('Localização/região potencialmente desfavorável.');
    if (a.formacao.toLowerCase().includes('sem formação')) result.moderate.push('Pouca formação recente registada.');
    if (a.avaliacoes < 5 && funcao.includes('Presidente')) result.moderate.push('Poucas avaliações positivas para a responsabilidade da função.');
    return result;
  }

  function hasOverlappingAppointment(refId, raceId) { const current = race(raceId); return state.data.nomeacoes.some(n => n.arbitroId === refId && n.provaId !== raceId && ['Aceite','Enviada','Pendente de resposta'].includes(n.estado) && overlap(race(n.provaId), current)); }
  function hasTotalConflict(refId,raceId){return state.data.conflitos.some(c=>c.arbitroId===refId&&c.provaId===raceId&&c.estado==='Impedimento total')}
  function hasPendingConflict(refId,raceId){return state.data.conflitos.some(c=>c.arbitroId===refId&&c.provaId===raceId&&['Declarado','Em análise','Impedimento parcial'].includes(c.estado))}
  function isUnavailableForRace(refId,p){return state.data.disponibilidades.some(d=>d.arbitroId===refId&&d.provaId===p.id&&d.estado==='Indisponível') || referee(refId)?.disponibilidade==='Indisponível'}
  function hasRecentAvailability(refId){const a=referee(refId);return a && daysBetween(a.ultimaDisponibilidade, isoDate(TODAY)) <= 60}
  function insufficientGraduation(a,funcao){return funcao.includes('Presidente') && !['Nacional','Nacional/Grau 2'].includes(a.graduacao)}
  function obviousCategoryMismatch(a,funcao){ if(funcao==='Medidor')return a.categoria!=='Medidor'; if(funcao==='Classificador Funcional')return a.categoria!=='Classificador Funcional'; if(funcao==='Juiz-Árbitro')return a.categoria!=='Juiz-Árbitro'; return false; }
  function categoryWarning(a,funcao){ if(funcao.includes('Comissão de Regata')||funcao==='Oficial de Regata')return a.categoria!=='Oficial de Regata'; if(funcao.includes('Protestos')||funcao==='Juiz')return !['Juiz','Juiz-Árbitro'].includes(a.categoria); return false; }
  function locationDistanceWarning(a,p){return (a.regiao.includes('Madeira') && !p.local.includes('Madeira')) || (a.regiao.includes('Norte') && ['Portimão','Vilamoura'].includes(p.local));}

  // Helpers render
  function kpi(label,value,hint,page,type){return `<button class="card kpi-card ${type||''}" type="button" data-action="navigate" data-target="${page}"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-hint">${hint}</div></button>`}
  function toolbar(module, controls, createAction){return `<div class="toolbar"><div class="filters">${controls.join('')}</div><div class="row-actions"><button class="button" type="button" data-action="clear-filters" data-module="${module}">Limpar filtros</button>${createAction?`<button class="button primary" type="button" data-action="${createAction}">Adicionar</button>`:''}<button class="button" type="button" data-action="exportCsv" data-id="${module}">Exportar CSV</button></div></div>`}
  function inputFilter(module,field,placeholder){const v=state.filters[module][field]||'';return `<input class="input" value="${escapeHtml(v)}" placeholder="${placeholder}" oninput="APP.setFilter('${module}','${field}',this.value)">`}
  function selectFilter(module,field,label,options){const v=state.filters[module][field]||'';return `<select class="select" onchange="APP.setFilter('${module}','${field}',this.value)"><option value="">${label}</option>${options.map(o=>`<option value="${escapeHtml(o)}" ${o===v?'selected':''}>${escapeHtml(o)}</option>`).join('')}</select>`}
  function table(headers, rows){return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td data-label="${escapeHtml(headers[i])}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  function titleSub(title, sub){return `<div class="row-title">${escapeHtml(title||'—')}</div><div class="row-sub">${escapeHtml(sub||'')}</div>`}
  function actions(items){return `<div class="row-actions">${items.map(([label,action,id,extra])=>`<button class="button small" type="button" data-action="${action}" data-id="${id ?? ''}" data-extra="${escapeHtml(extra ?? '')}">${label}</button>`).join('')}</div>`}
  function button(label,action,id='',variant=''){return `<button class="button ${variant}" type="button" data-action="${action}" data-id="${id}">${label}</button>`}
  function badge(type,text){const cls={ok:'ok',success:'ok',warning:'warning',danger:'danger',critical:'danger',info:'info',neutral:'neutral',dark:'dark',moderate:'warning',block:'danger'}[type]||'neutral';return `<span class="badge ${cls}">${escapeHtml(text)}</span>`}
  function emptyState(title,msg){return `<div class="empty-state"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(msg)}</p></div>`}
  function metric(label,value){return `<div class="metric"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`}
  function hidden(name,value){return `<input type="hidden" name="${name}" value="${escapeHtml(value)}">`}
  function field(name,label,value='',required=false,type='text'){return `<div class="field"><label>${label}</label><input class="input" name="${name}" type="${type}" value="${escapeHtml(value)}" ${required?'required':''}></div>`}
  function selectField(name,label,value,options){return `<div class="field"><label>${label}</label><select class="select" name="${name}">${options.map(o=>Array.isArray(o)?`<option value="${escapeHtml(o[0])}" ${String(o[0])===String(value)?'selected':''}>${escapeHtml(o[1])}</option>`:`<option value="${escapeHtml(o)}" ${String(o)===String(value)?'selected':''}>${escapeHtml(o)}</option>`).join('')}</select></div>`}
  function statusBadge(v){const t=String(v||'');if(['Válida','Ativo','Disponível','Equipa completa','Concluída','Encerrada','Validado','Válido','Entregue','Sem impedimento','Aceite','Concluída','Respondida','Lida','Aprovado','Pago'].includes(t))return badge('ok',t);if(['Expirada','Suspensa','Suspenso','Inativo','Indisponível','Em atraso','Em falta','Recusada','Cancelada','Impedimento total','Rejeitado','Crítica'].includes(t))return badge('danger',t);if(['Por validar','Condicionado','Por confirmar','Nomeações pendentes','Em preparação','Aguardando validação','Pendente','Declarado','Em análise','Impedimento parcial','Devolvido','Alta','Substituída','Em validação'].includes(t))return badge('warning',t);return badge('neutral',t)}
  const nominationStateBadge=statusBadge, reportStateBadge=statusBadge, docStateBadge=statusBadge, conflictStateBadge=statusBadge, communicationStateBadge=statusBadge, priorityBadge=statusBadge, financeStateBadge=statusBadge;
  function credentialBadge(a){return statusBadge(credentialText(a))} function credentialText(a){if(['Suspensa','Expirada'].includes(a.licenca)||['Suspenso','Inativo'].includes(a.estado))return 'Suspenso';if(a.licenca==='Por validar')return 'Incompleto';if(daysUntil(a.validadeLicenca)<=EXPIRY_DAYS)return 'Necessita renovação';if(a.formacao.toLowerCase().includes('sem formação'))return 'Em risco';return 'Regular'}
  function riskBadge(a){const s=riskScore(a);return s>=5?badge('danger','Risco elevado'):s>=3?badge('warning','Risco moderado'):badge('ok','Risco baixo')}
  function appointmentRiskBadge(a){return riskBadge(a)}
  function riskScore(a){let s=0;if(a.licenca!=='Válida')s+=3;if(['Suspenso','Inativo'].includes(a.estado))s+=3;if(a.disponibilidade!=='Disponível')s+=1;if(a.relatoriosAtraso>0)s+=2;if(daysUntil(a.validadeLicenca)<=EXPIRY_DAYS)s+=1;if(activeConflictsForRef(a.id).length)s+=2;if(!hasRecentAvailability(a.id))s+=1;return s}
  function riskSummary(a){return `${a.licenca}, ${a.disponibilidade}, ${a.relatoriosAtraso} relatório(s) em atraso, ${activeConflictsForRef(a.id).length} conflito(s)`}
  function validationSummary(v){if(v.blocks.length)return `${badge('danger','Bloqueio')} ${v.blocks.join(' · ')}`;if(v.critical.length)return `${badge('danger','Alerta crítico')} ${v.critical.join(' · ')}`;if(v.moderate.length)return `${badge('warning','Alerta moderado')} ${v.moderate.join(' · ')}`;return `${badge('ok','Sem risco')} Nomeação elegível.`}
  function teamStatus(p){const required=requiredCount(p), nominated=state.data.nomeacoes.filter(n=>n.provaId===p.id&&!['Cancelada','Recusada'].includes(n.estado)).length;return `<div>${statusBadge(nominated>=required?'Equipa completa':'Incompleto')}<div class="row-sub">${nominated}/${required} funções</div></div>`}
  function requiredCount(p){return Object.values(p.necessidades||{}).reduce((a,b)=>a+Number(b),0)}
  function raceListItem(p){return `<div class="list-item"><div><strong>${escapeHtml(p.nome)}</strong><p>${formatDate(p.inicio)} · ${escapeHtml(p.local)} · ${teamStatusPlain(p)}</p></div><div class="row-actions">${docStateBadge(p.estadoDocumental)}${button('Abrir','showRaceDetail',p.id)}</div></div>`}
  function raceNeedItem(p){return `<div class="list-item"><div><strong>${escapeHtml(p.nome)}</strong><p>${formatDate(p.inicio)} · ${missingFunctions(p)} função(ões) por preencher</p></div>${button('Nomear','goNominationRace',p.id,'primary')}</div>`}
  function needItem(p,funcao,qty){const count=state.data.nomeacoes.filter(n=>n.provaId===p.id&&n.funcao===funcao&&!['Cancelada','Recusada'].includes(n.estado)).length;return `<div class="list-item"><div><strong>${escapeHtml(funcao)}</strong><p>Necessários: ${qty} · Nomeados: ${count}</p></div>${button('Nomear','modalNomeacao',p.id,count>=qty?'':'primary')}</div>`}
  function candidateItem(a,p){const validation=validateAppointment(a,p,Object.keys(p.necessidades)[0]||'Juiz');return `<div class="list-item"><div><strong>${escapeHtml(a.nome)}</strong><p>${escapeHtml(a.categoria)} · ${escapeHtml(a.graduacao)} · ${escapeHtml(a.regiao)}</p>${validationSummary(validation)}</div>${button('Nomear','modalNomeacaoForRef',a.id,validation.blocks.length?'':'primary')}</div>`}
  function nominationItem(n){const a=referee(n.arbitroId),p=race(n.provaId);return `<div class="list-item"><div><strong>${escapeHtml(p?.nome||'Prova')}</strong><p>${escapeHtml(n.funcao)} · ${escapeHtml(a?.nome||'Árbitro')} · ${formatDate(p?.inicio)}</p></div>${nominationStateBadge(n.estado)}</div>`}
  function documentItem(d){return `<div class="list-item"><div><strong>${escapeHtml(d.nome)}</strong><p>${escapeHtml(d.tipo)} · v${escapeHtml(d.versao)}</p></div>${docStateBadge(d.estado)}</div>`}
  function conflictItem(c){return `<div class="list-item"><div><strong>${escapeHtml(c.tipo)}</strong><p>${escapeHtml(race(c.provaId)?.nome||'Prova')} · ${escapeHtml(c.descricao)}</p></div>${conflictStateBadge(c.estado)}</div>`}

  // metrics and data helpers
  function dashboardMetrics(){const incomplete=state.data.provas.filter(p=>new Date(p.fim)>=TODAY&&missingFunctions(p)>0).length;const pending=state.data.nomeacoes.filter(n=>['Enviada','Pendente de resposta','Rascunho'].includes(n.estado)).length;const refused=state.data.nomeacoes.filter(n=>n.estado==='Recusada').length;const available=state.data.arbitros.filter(a=>a.estado==='Ativo'&&a.licenca==='Válida'&&a.disponibilidade==='Disponível').length;const missingMaps=refereesWithoutAvailability().length;const expired=state.data.arbitros.filter(a=>['Expirada','Suspensa'].includes(a.licenca)).length;const expiring=state.data.arbitros.filter(a=>a.licenca==='Válida'&&daysUntil(a.validadeLicenca)<=EXPIRY_DAYS).length;const late=state.data.relatorios.filter(r=>r.estado==='Em atraso').length;const conflicts=state.data.conflitos.filter(c=>['Declarado','Em análise','Impedimento parcial'].includes(c.estado)).length;const docs=state.data.documentos.filter(d=>['Em falta','Por validar','Rejeitado'].includes(d.estado)).length;return {futureRaces:state.data.provas.filter(p=>new Date(p.fim)>=TODAY).length,incompleteTeams:incomplete,pendingAppointments:pending,refusedAppointments:refused,availableReferees:available,missingMaps,expiredLicenses:expired,expiringLicenses:expiring,lateReports:late,pendingConflicts:conflicts,missingDocuments:docs,criticalTasks:expired+late+conflicts+docs}}
  function buildAlerts(){const d=dashboardMetrics();return [['danger','Relatórios','Relatórios em atraso',`${d.lateReports} relatório(s) ultrapassaram o prazo de 5 dias.`,'relatorios',d.lateReports],['danger','Conflitos','Conflitos pendentes',`${d.pendingConflicts} conflito(s) exigem decisão.`,'conflitos',d.pendingConflicts],['warning','Disponibilidade','Mapas de disponibilidade em falta',`${d.missingMaps} árbitro(s) sem mapa atualizado.`,'disponibilidades',d.missingMaps],['warning','Licenças','Licenças expiradas ou a expirar',`${d.expiredLicenses+d.expiringLicenses} situação(ões) de credenciação exigem atenção.`,'credenciacao',d.expiredLicenses+d.expiringLicenses],['warning','Documentos','Documentos pendentes',`${d.missingDocuments} documento(s) em falta, por validar ou rejeitados.`,'documentos',d.missingDocuments]].filter(x=>x[5]>0).map(([level,type,title,message,page])=>({level,type,title,message,page}))}
  function racesWithinNominationWindow(){return state.data.provas.filter(p=>{const days=daysBetween(isoDate(TODAY),p.inicio);return days>=0&&days<=NOMINATION_WINDOW_DAYS&&missingFunctions(p)>0})}
  function missingFunctions(p){return Math.max(0,requiredCount(p)-state.data.nomeacoes.filter(n=>n.provaId===p.id&&!['Cancelada','Recusada'].includes(n.estado)).length)}
  function teamStatusPlain(p){return `${requiredCount(p)-missingFunctions(p)}/${requiredCount(p)} elementos`}
  function refereesWithoutAvailability(){return state.data.arbitros.filter(a=>!hasRecentAvailability(a.id))}
  function activeConflictsForRef(id){return state.data.conflitos.filter(c=>c.arbitroId===id&&['Declarado','Em análise','Impedimento parcial','Impedimento total'].includes(c.estado))}
  function currentReportStateForRace(id){const r=state.data.relatorios.find(x=>x.provaId===id);return r?.estado||race(id)?.relatorioFinal||'Pendente'}
  function updateReportsStatus(){state.data.relatorios.forEach(r=>{if(r.estado!=='Entregue'&&r.estado!=='Validado'&&new Date(r.prazo)<TODAY)r.estado='Em atraso'});}
  function ensureReportForRace(raceId){const p=race(raceId);if(!state.data.relatorios.some(r=>r.provaId===raceId)){state.data.relatorios.push({id:nextId(state.data.relatorios),provaId:raceId,arbitroId:state.data.nomeacoes.find(n=>n.provaId===raceId)?.arbitroId||state.data.arbitros[0].id,prazo:addDays(p.fim,REPORT_DAYS),estado:'Pendente',observacoes:'Pedido criado automaticamente após conclusão da prova.',documentoId:null});audit('Pedido de relatório criado',p.nome,'Sem relatório','Pendente','Prova marcada como concluída.','Relatórios')}}
  function ensureHonorariumForReport(r){ensureHonorariumForNomination(race(r.provaId),referee(r.arbitroId),state.data.nomeacoes.find(n=>n.provaId===r.provaId&&n.arbitroId===r.arbitroId)?.funcao||'Função de arbitragem')}
  function ensureHonorariumForNomination(p,a,funcao){if(!p||!a||state.data.honorarios.some(h=>h.provaId===p.id&&h.arbitroId===a.id))return;const days=Math.max(1,daysBetween(p.inicio,p.fim)+1);const h={id:nextId(state.data.honorarios),provaId:p.id,arbitroId:a.id,funcao,dias,valorDia:funcao.includes('Presidente')?125:95,km:0,valorKm:.36,despesas:0,total:0,estado:'Por submeter',dataSubmissao:'',observacoes:'Pré-registo financeiro preparado pelo fluxo de nomeação.'};h.total=calculateHonorarium(h);state.data.honorarios.push(h)}
  function calculateHonorarium(h){return Number(((Number(h.dias)||0)*(Number(h.valorDia)||0)+(Number(h.km)||0)*(Number(h.valorKm)||0)+(Number(h.despesas)||0)).toFixed(2))}
  function requirementsText(a){if(a.licenca!=='Válida')return 'Regularizar licença antes de progressão ou nomeação.';if(a.graduacao==='Clube')return 'Requer mais provas acompanhadas, formação regional e avaliações positivas.';if(a.graduacao.includes('Regional'))return 'Requer seminário nacional, avaliações positivas e experiência adicional.';if(daysUntil(a.validadeLicenca)<=EXPIRY_DAYS)return 'Renovação de licença necessária nos próximos 60 dias.';return 'Requisitos principais completos.'}
  function conflictImpact(stateName){if(stateName==='Impedimento total')return 'Bloqueio';if(['Em análise','Impedimento parcial','Declarado'].includes(stateName))return 'Alerta crítico';return 'Sem impedimento'}

  // CSV
  function exportCsv(key){const map={arbitros:state.data.arbitros,provas:state.data.provas,nomeacoes:state.data.nomeacoes,disponibilidades:state.data.disponibilidades,relatorios:state.data.relatorios,conflitos:state.data.conflitos,documentos:state.data.documentos,honorarios:state.data.honorarios,auditoria:state.data.auditoria};const rows=map[key];if(!rows)return toast('Exportação indisponível para este módulo.');exportRows(`fpv-${key}.csv`,rows);audit('Exportação CSV',key,'Dados internos','Ficheiro CSV',`Exportação local de ${key}.`,'Exportações');saveData(false);toast(`Exportação ${key} preparada.`)}
  function exportRows(filename,rows){const flat=rows.map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v):v])));const headers=Object.keys(flat[0]||{});const csv=[headers.join(';'),...flat.map(r=>headers.map(h=>csvCell(r[h])).join(';'))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
  function csvCell(v){return `"${String(v??'').replace(/"/g,'""')}"`}

  // low-level helpers
  function audit(acao,entidade,anterior,novo,justificacao,origem){state.data.auditoria.unshift({id:nextId(state.data.auditoria),data:nowString(),utilizador:'Conselho de Arbitragem',acao,entidade,anterior,novo,justificacao,origem})}
  function referee(id){return state.data.arbitros.find(a=>a.id===Number(id))} function race(id){return state.data.provas.find(p=>p.id===Number(id))}
  function el(id){return document.getElementById(id)} function openSidebar(){el('sidebar').classList.add('open');el('sidebarOverlay').classList.add('show')} function closeSidebar(){el('sidebar').classList.remove('open');el('sidebarOverlay').classList.remove('show')}
  function setFilter(module,field,value){state.filters[module][field]=value;safeRender(state.page)}
  function formData(id){return Object.fromEntries(new FormData(el(id)).entries())}
  function matchText(obj,q,fields){return !q||fields.some(f=>String(obj[f]||'').toLowerCase().includes(String(q).toLowerCase()))} function matchFilters(obj,filters,map){return Object.entries(map).every(([f,k])=>!filters[f]||obj[k]===filters[f])}
  function unique(arr){return [...new Set(arr.filter(Boolean))].sort()} function nextId(arr){return arr.length?Math.max(...arr.map(x=>Number(x.id)||0))+1:1} function nextCode(prefix){return `${prefix}-${String(150+state.data.arbitros.length+1).padStart(3,'0')}`}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]))}
  function formatDate(d){if(!d)return '—';return new Intl.DateTimeFormat('pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d))} function isoDate(d){return new Date(d).toISOString().slice(0,10)} function nowString(){return '2026-05-13 12:00'}
  function daysUntil(d){return Math.ceil((new Date(d)-TODAY)/(86400000))} function daysBetween(a,b){return Math.ceil((new Date(b)-new Date(a))/(86400000))} function addDays(date,days){const d=new Date(date);d.setDate(d.getDate()+days);return isoDate(d)} function overlap(a,b){return a&&b&&a.inicio<=b.fim&&b.inicio<=a.fim}
  function initials(name){return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()} function money(v){return new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(v)||0)}
  function toast(message){const t=el('toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200)}

  document.addEventListener('DOMContentLoaded', initApp);
  return { closeModal, setFilter, toggleChecklist };
})();
