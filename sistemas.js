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
        { id: "cargas",            nome: "Cargas",              descricao: "Importação do WMS e dimensionamento de frota.",        url: "https://script.google.com/macros/s/AKfycbwlLm31BsyGbfXsDkt7y9b4cc0cGasXIp9UltgqYtJ1F3MH6kurmmPiUNWhKdw59g3F/exec" },
        { id: "controle-estoque",  nome: "Controle de Estoque", descricao: "Insumos por filial, entradas e saídas.",              url: "https://script.google.com/macros/s/AKfycbyL7qkEc9bsiVNnokIxtjzaOxQ6P-MjxRXSQ68st2rS5qJjpzArK79vz-1gB458_zwUsg/exec" },
        { id: "devolucao",         nome: "Devolução Fornecedor", descricao: "Arquivo de notas de devolução ao fornecedor com PDFs.",             url: "https://script.google.com/macros/s/AKfycbxbTEK5i9LZPcR8HrpSRwUQ4Odw8HhiQbiGLmgFdfIB8xL0N4haU52rGdX8i67J8MmL/exec" },
        { id: "despesa-viagem",    nome: "Despesa de Viagem",   descricao: "RDV por funcionário e filial, envio ao pagamento.",   url: "https://script.google.com/macros/s/AKfycbxSt4vJ3N21tCFONlYi8aqH8YGENhQMmzoqq-yBeaKAICCrezb_JaAgwgLq_1HgGA4mHA/exec" },
        { id: "nivel-servico",     nome: "Nível de Serviço",    descricao: "Lançamentos e indicadores por setor.",                url: "https://script.google.com/macros/s/AKfycbywa4StgRAkHl4ZY_RA-pVdvyMnlNm4K18jvAmI1xol0T4Bka5UaZ7idTv50G0youEAwA/exec" },
        { id: "recebimento",       nome: "Recebimento",         descricao: "Controle de recebimento de mercadorias.",             url: "https://script.google.com/macros/s/AKfycby3P71RWpl6_UlZz_kErJ4TZPQzwFeDJRrJOYRGu57Ptf3E3OpHdA-tNcLpLU7GgBPc/exec" },
        { id: "temperatura",       nome: "Temperatura",         descricao: "Registros de temperatura e umidade.",                 url: "https://adeniltonpereiradesantana-oss.github.io/temperatura/"}
      ]
    },
    {
      id: "transporte",
      nome: "Transporte",
      icone: "truck",
      sistemas: [
        { id: "painel-transporte", nome: "Painel de Transporte", descricao: "Escala de viagens, portaria e frota.",              url: "", emBreve: true },
        { id: "agrega-mais",       nome: "Agrega+",              descricao: "Lançamentos, conta corrente e pagamento de agregados.", url: "https://agregaplus.com.br/"}
      ]
    },
    {
      id: "pessoal",
      nome: "Pessoal",
      icone: "users",
      sistemas: [
        { id: "rh-inteligente",    nome: "RH Inteligente",      descricao: "Atestados e rotinas de DP.",                          url: "https://script.google.com/macros/s/AKfycbxXkroYhLIHUH7ue6vJbx_MyeW50Xde2p0oxNW4MLEDUNaBFUSt75xxh4G6AYjiQCkv/exec" }
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
