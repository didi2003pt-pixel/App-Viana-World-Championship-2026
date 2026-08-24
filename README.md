# FPV Arbitragem — Plataforma de Gestão Operacional

Plataforma web local/PWA para gestão operacional da arbitragem da Federação Portuguesa de Vela em ambiente interno. A aplicação foi preparada para centralizar dados de arbitragem, disponibilidade, nomeações, relatórios, conflitos de interesse, documentos, honorários e auditoria.

Esta versão foi desenhada para funcionar localmente, ser publicada em GitHub Pages e ser instalada como PWA em Android, iOS, tablet e desktop.

## Ficheiros incluídos

- `index.html` — estrutura principal da aplicação.
- `styles.css` — estilos responsivos, mobile-first e suporte a safe areas iOS.
- `app.js` — dados, regras de negócio, renderização, localStorage, modais, auditoria e exportações.
- `manifest.json` — configuração PWA.
- `service-worker.js` — cache básica, fallback offline e limpeza de versões antigas.
- `offline.html` — ecrã institucional para ausência de ligação.
- `icons/` — ícones PWA 192x192 e 512x512, incluindo versões maskable.

## Como abrir localmente

A forma mais simples é servir a pasta com um servidor local:

```bash
cd fpv-arbitragem-operacional-v2
python3 -m http.server 8080
```

Depois abrir:

```text
http://localhost:8080
```

Também pode abrir o `index.html` diretamente, mas a instalação PWA e o service worker funcionam melhor com servidor local ou GitHub Pages.

## Como publicar em GitHub Pages

1. Criar um repositório no GitHub.
2. Colocar todos os ficheiros na raiz do repositório.
3. Ativar GitHub Pages em `Settings > Pages`.
4. Escolher branch `main` e pasta `/root`.
5. Abrir o endereço gerado pelo GitHub Pages.

A aplicação usa caminhos relativos como `./styles.css`, `./app.js`, `./manifest.json` e `./service-worker.js`, por isso funciona em subpastas do GitHub Pages.

## Como testar em Android

1. Abrir a URL da aplicação no Chrome.
2. Abrir o menu do navegador.
3. Escolher “Adicionar ao ecrã principal” ou “Instalar aplicação”.
4. Abrir a aplicação instalada.
5. Testar Dashboard, Nomeações, Provas, Árbitros, Disponibilidades e exportações.

## Como testar em iOS

1. Abrir a URL no Safari.
2. Tocar no botão de partilha.
3. Escolher “Adicionar ao ecrã principal”.
4. Abrir a aplicação pelo ícone criado.
5. Validar navegação, menu lateral, modais e formulários.

## Funcionalidades incluídas

- Dashboard operacional com cartões clicáveis.
- Gestão de árbitros com filtros, perfil, edição e risco de nomeação.
- Gestão de provas, necessidades de arbitragem e checklist documental.
- Centro de nomeações com validação automática.
- Motor de disponibilidade com accountability e alertas de mapas em falta.
- Licenças, formação, graduação e alertas de expiração em 60 dias.
- Relatórios pós-prova com prazo automático de 5 dias.
- Conflitos de interesse com decisão e impacto na nomeação.
- Documentos por tipo, prova, árbitro, versão e estado.
- Comunicações internas com estados.
- Honorários e workflow financeiro interno.
- Auditoria com registo de ações relevantes.
- Exportação CSV de árbitros, provas, nomeações, disponibilidades, relatórios, conflitos, documentos, honorários e auditoria.
- Persistência local com `localStorage`.
- Reposição de dados de ambiente interno.
- PWA instalável com funcionamento offline básico.

## Regras de negócio implementadas

### Nomeações

A nomeação de árbitros avalia:

- licença desportiva válida;
- estado operacional ativo;
- disponibilidade na data da prova;
- conflitos de interesse;
- relatórios anteriores em atraso;
- sobreposição com outra prova;
- graduação adequada;
- categoria adequada;
- existência de mapa de disponibilidade recente.

### Níveis de validação

- **Bloqueio:** impede a nomeação.
- **Alerta crítico:** exige justificação.
- **Alerta moderado:** permite avançar com aviso.
- **Sem risco:** permite avançar normalmente.

### Bloqueios principais

- licença expirada;
- licença suspensa;
- árbitro suspenso ou inativo;
- conflito com impedimento total;
- indisponível na data da prova;
- sobreposição com outra prova aceite, enviada ou pendente;
- função evidentemente incompatível com categoria.

### Relatórios

- prazo automático de 5 dias após fim da prova;
- relatórios fora do prazo passam para “Em atraso”;
- entrega, validação e devolução ficam registadas em auditoria;
- entrega pode preparar registo financeiro interno.

### Honorários

O cálculo interno usa:

```text
Total = dias de prova × valor por dia + quilómetros × valor por quilómetro + despesas adicionais
```

Este módulo é apenas workflow financeiro interno local, não um sistema real de pagamento.

## Persistência local

A aplicação guarda dados em `localStorage` neste dispositivo. Isto permite manter alterações após recarregar a página no mesmo navegador.

Se o `localStorage` estiver vazio ou corrompido, a aplicação repõe automaticamente dados válidos de ambiente interno.

## Limitações atuais

Esta versão funciona localmente e usa `localStorage`. Para uso oficial em produção será obrigatório implementar:

- backend;
- base de dados centralizada;
- autenticação real;
- permissões reais no servidor;
- armazenamento seguro de documentos;
- backups;
- logs de segurança;
- conformidade RGPD;
- alojamento seguro;
- validação formal pela Federação Portuguesa de Vela;
- eventual integração com Odoo ou outro ERP.

## Próximos passos para produção real

- Backend com API segura.
- Base de dados PostgreSQL.
- Autenticação com perfis e permissões no servidor.
- Armazenamento documental seguro.
- Logs de auditoria imutáveis.
- Sistema de notificações por email.
- Integração com Odoo para workflows administrativos e financeiros.
- Gestão real de utilizadores: Federação, Conselho Nacional, Conselhos Regionais, Árbitros e Clubes.
- Política de retenção de dados e conformidade RGPD.
- Testes de usabilidade com stakeholders da Federação Portuguesa de Vela.

## Nota RGPD

Os dados incluídos são dados de ambiente interno/teste e não representam pessoas reais. Qualquer utilização oficial exigirá base legal, controlo de acessos, consentimentos quando aplicável, política de retenção, segurança documental e validação formal de conformidade RGPD.
