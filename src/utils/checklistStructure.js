export const checklistItems = [
    { id: "inscricoes", label: "INSCRIÇÕES OBRIGATÓRIAS LEGÍVEIS? (PLACA DE IDENTIFICAÇÃO DA BOMBA)", type: "radio" },
    { id: "instalacaoEletrica", label: "INSTALAÇÃO ELÉTRICA EM BOAS CONDIÇÕES? (CAIXA ANTI-EXPLOSÃO)", type: "radio" },
    { id: "leds", label: "LEDS DOS DÍGITOS DANIFICADOS ?", type: "radio", dangerOnSim: true},
    { id: "grafia", label: "GRAFIA E SIMBOLOGIA CORRETA ?", type: "radio" },
    { id: "permanencia", label: "PERMANÊNCIA DAS INDICAÇÕES APÓS DESLIGAMENTO DA ELÉTRICA DA BOMBA (5 MINUTOS) ?", type: "radio" },
    { id: "iluminacao", label: "ILUMINAÇÃO DO DISPOSITIVO INDICADOR QUEIMADA ?", type: "radio", dangerOnSim: true},
    { id: "selagem", label: "SELAGEM ROMPIDA ? (LACRES)", type: "radio", dangerOnSim: true },
    { id: "selagemLocal", placeholder: "QUAL O LOCAL DA SELAGEM ROMPIDA ?", type: "text", dependsOn: "selagem", showIf: "sim" },
    { id: "arGas", label: "AR E GÁS CONDUZIDOS PARA FORA DA BOMBA OU RETORNA AO TANQUE ?", type: "radio"},
    { id: "protecaoPainel", label: "PROTEÇÃO DO PAINEL INTACTA ?", type: "radio" },
    { id: "vazamentos", label: "FORAM OBSERVADOS VAZAMENTOS INTERNO OU EXTERNO ?", type: "radio", dangerOnSim: true},
    { id: "vzlocal", placeholder: "ONDE FOI OBSERVADO O VAZAMENTO ?", type: "text", dependsOn: "vazamentos", showIf: "sim" },
    { id: "predeterminador", label: "FUNCIONA PRÉ DETERMINADOR ? (TECLADO FUNÇÃO LITROS E R$)", type: "radio" },
];

export const ensaioAfericaoItems = [
    { id: "vazamentoBico", label: "VAZAMENTO DO BICO DE DESCARGA (ATÉ 40 ML)", subtitle: "(3 gatilhadas por segundo em 6 segundos)", type: "text", placeholder: "ML", keyboardType: "numeric", },
    { id: "vazaoBomba", label: "VAZÃO DA BOMBA (Segura 6 seg. o gatilho todo apertado x 10) L/min", subtitle: "(Mínimo De 50% Da Vazão Indicada Na Placa Das Inscrições Obrigatórias)", type: "text", placeholder: "L/min", keyboardType: "numeric", },
    { id: "vazaoMax", label: "VOLUME INDICADO NO AFERIDOR NA VAZÃO MÁXIMA(ML)", subtitle: "(Tolerância: -100ml / +100ml, sinais contrários soman-se as Diferenças Obtidas.)", type: "text", placeholder: "ML", keyboardType: "numeric", allowNegative: true},
    { id: "vazaoMin", label: "VOLUME INDICADO NO AFERIDOR NA VAZÃO MÍNIMA (ML)", subtitle: "(Tolerância: -100ml / +100ml, sinais contrários soman-se as Diferenças Obtidas.)", type: "text", placeholder: "ML", keyboardType: "numeric", allowNegative: true},
    { id: "desliga60seg", label: "DESLIGA EM ATÉ 60 SEGUNDOS?", type: "radio" },
    { id: "comprimentoMangueira", label: "COMPRIMENTO DA MANGUEIRA ATÉ 5 METROS? (ou 6m com dispositivo de segurança)", type: "radio" },
    { id: "mangueiraDanificada", label: "MANGUEIRA DANIFICADA? (Quando trincada aparece a malha)", type: "radio", dangerOnSim: true},
    { id: "bico", placeholder: "Bico", type: "text", dependsOn: "mangueiraDanificada", showIf: "sim" },
    {
        id: "condicoesAferidor", label: "CONDIÇÕES DO AFERIDOR DO POSTO", type: "checkbox",
        options: [
            "Placa ilegível/faltando",
            "Bom",
            "Selagem rompida",
            "Vazamento",
            "Visor danificado/ilegível",
        ],
    },
];

// export const fichaControle = [
//     { id: "data",          label: "Data", type: "date", keyboardType: "date-time", },
//     { id: "bico",          label: "Bico", type: "text", keyboardType: "text", },
//     { id: "vazaoMaxima",   label: "Vazão Máxima", type: "text", keyboardType: "text", },
//     { id: "vazaoMinima",   label: "Vazão Mínima", type: "text", keyboardType: "text", },
//     { id: "vazamentoBico", label: "Vazamento do Bico", type: "text", keyboardType: "text",},
//     { id: "vazaoBomba",    label: "Vazão da Bomba", type: "text", keyboardType: "text",},
// ];
