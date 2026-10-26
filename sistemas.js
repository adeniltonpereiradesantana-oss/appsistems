/*
 * ============================================================
 *  CONFIGURAÇÃO DO PORTAL — é o único arquivo que você edita
 *  para incluir, remover ou reordenar sistemas no menu.
 * ============================================================
 *
 *  Cada sistema:
 *    id        → identificador único, sem espaço/acento (vira o link: appsistems.com.br/#/cargas)
 *    nome      → texto do menu e da aba
 *    descricao → texto do card na página inicial
 *    url       → URL do Web App (…/macros/s/XXXX/exec). Vazio = mostra "URL não configurada".
 *    emBreve   → true para mostrar o selo "Em breve"
 *
 *  Ícones de grupo disponíveis: box, truck, users, file, chart, gear
 */
window.PORTAL_CONFIG = {
  nome: "AppSistems",
  empresa: "DPC Distribuidor Atacadista S.A.",
  empresaCurta: "DPC Distribuidor",
  rodape: "Powered by apsantana",
  usuario: { nome: "apsantana", iniciais: "AS" },

  grupos: [
    {
      id: "logistica",
      nome: "Logística",
      icone: "box",
      sistemas: [
        { id: "cargas",            nome: "Cargas",              descricao: "Importação do WMS e dimensionamento de frota.",        url: "" },
        { id: "controle-estoque",  nome: "Controle de Estoque", descricao: "Insumos por filial, entradas e saídas.",              url: "" },
        { id: "devolucao",         nome: "Devolução",           descricao: "Arquivo de notas de devolução com PDFs.",             url: "" },
        { id: "despesa-viagem",    nome: "Despesa de Viagem",   descricao: "RDV por funcionário e filial, envio ao pagamento.",   url: "" },
        { id: "nivel-servico",     nome: "Nível de Serviço",    descricao: "Lançamentos e indicadores por setor.",                url: "" },
        { id: "recebimento",       nome: "Recebimento",         descricao: "Controle de recebimento de mercadorias.",             url: "" },
        { id: "temperatura",       nome: "Temperatura",         descricao: "Registros de temperatura e umidade.",                 url: "" }
      ]
    },
    {
      id: "transporte",
      nome: "Transporte",
      icone: "truck",
      sistemas: [
        { id: "painel-transporte", nome: "Painel de Transporte", descricao: "Escala de viagens, portaria e frota.",              url: "", emBreve: true },
        { id: "agrega-mais",       nome: "Agrega+",              descricao: "Lançamentos, conta corrente e pagamento de agregados.", url: "", emBreve: true }
      ]
    },
    {
      id: "pessoal",
      nome: "Pessoal",
      icone: "users",
      sistemas: [
        { id: "rh-inteligente",    nome: "RH Inteligente",      descricao: "Atestados e rotinas de DP.",                          url: "", emBreve: true }
      ]
    },
    {
      id: "administrativo",
      nome: "Administrativo",
      icone: "file",
      sistemas: [
        { id: "gestao-contratos",  nome: "Gestão de Contratos", descricao: "Cadastro, vigência e alertas de contratos.",          url: "", emBreve: true }
      ]
    }
  ]
};
