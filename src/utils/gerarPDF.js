import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { checklistItems, ensaioAfericaoItems } from "../utils/checklistStructure.js";

function addTopo(doc, dados) {
  let y = 10;
  y += 30;

  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(dados.titulo, 105, y, { align: "center" });
  y += 15;

  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(`Usuário: ${dados.usuario}`, 10, y); y += 6;
  doc.text(`Filial: ${dados.filial_nome}`, 10, y); y += 6;
  doc.text(`Data e Hora: ${new Date(dados.data).toLocaleString()}`, 10, y); y += 6;

  if (Array.isArray(dados.checklist)) {
    const bombaItem = dados.checklist.find(c => c.id === "bombaId");
    if (bombaItem && bombaItem.resposta) {
      doc.text(`Identificação da Bomba: ${bombaItem.resposta}`, 10, y);
      y += 10;
    }
  }

  return y;
}


function addChecklist(doc, checklist, startY) {
  const body = checklist
    .filter(item => item.id !== "bombaId") // ignora o ID da bomba
    .map(item => {
      const def = checklistItems.find(i => i.id === item.id);
      if (!def) return null;

      if (def.dependsOn) {
        const depende = checklist.find(c => c.id === def.dependsOn)?.resposta;
        if (depende?.toLowerCase() !== def.showIf) return null;
      }

      const fullLabel = def.label || def.placeholder || "";
      const resposta = item.resposta || "—";

      return [fullLabel, resposta];
    })
    .filter(Boolean);

  autoTable(doc, {
    head: [["Checklist", "Resposta"]],
    body: body,
    startY,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
  });

  return doc.lastAutoTable.finalY + 10;
}


function addEnsaio(doc, ensaio, startY) {
  const body = ensaio
    .map(item => {
      const def = ensaioAfericaoItems.find(i => i.id === item.id);
      if (!def) return null;

      if (def.dependsOn) {
        const depende = ensaio.find(c => c.id === def.dependsOn)?.resposta;
        if (depende?.toLowerCase() !== def.showIf) return null;
      }

      let fullLabel;
      if (item.id === "bico") {
        // usa a resposta para compor, ex: "BICO RESPOSTA 1"
        fullLabel = `BICO`.trim();
      } else {
        const labelBase = def?.label || item.id;
        const placeholder = def?.placeholder && !labelBase.includes(def.placeholder) ? ` (${def.placeholder})` : "";
        const subtitle = def?.subtitle ? ` ${def.subtitle}` : "";
        fullLabel = labelBase + placeholder + subtitle;
      }

      const resposta = Array.isArray(item.resposta)
        ? item.resposta.join(", ")
        : item.resposta || "—";

      return [fullLabel, resposta];
    })
    .filter(Boolean);

  autoTable(doc, {
    head: [["Ensaio/Aferição", "Resposta"]],
    body,
    startY,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: "bold" },
  });

  return doc.lastAutoTable.finalY + 10;
}

export default function gerarPDF(dadosCompletos) {
  const doc = new jsPDF();
  const img = new Image();
  img.src = '/android-chrome-512x512.png'; // URL pública ou dentro da pasta public
  img.onload = () => {
    // primeira página
    let y = 40;
    doc.addImage(img, 'PNG', 10, 10, 30, 30);
    y = addTopo(doc, dadosCompletos, y); // ajuste addTopo pra receber y inicial
    y = addChecklist(doc, dadosCompletos.checklist, y);

    // segunda página
    doc.addPage();
    y = 40;
    y = addEnsaio(doc, dadosCompletos.ensaio, y);

    // rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 200, 290, { align: "right" });
    }

    doc.save(`${dadosCompletos.titulo}.pdf`);
  };
}
