// ============================================================
//  CONFIGURACIÓ  –  canvia SHEET_NAME pel nom de la teva pestanya
// ============================================================
const SHEET_NAME = "Registres";
const COLS = {
  ID:          1,
  NOM:         2,
  DESCRIPCIO:  3,
  CATEGORIA:   4,
  DATA:        5,
  ESTAT:       6   // "actiu" | "inactiu"  (eliminació lògica)
};
const TOTAL_COLS = 6;

// ============================================================
//  doGet  –  retorna tots els registres en JSON
//  Paràmetre opcional: ?filtre=actiu  o  ?filtre=tots
// ============================================================
function doGet(e) {
  const filtre = (e && e.parameter && e.parameter.filtre) ? e.parameter.filtre : "actiu";
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data   = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows    = data.slice(1);

  const registres = rows
    .filter(r => filtre === "tots" || r[COLS.ESTAT - 1] === "actiu")
    .map(r => rowToObj(r));

  return jsonResponse({ ok: true, registres });
}

// ============================================================
//  doPost  –  CRUD: accio = crear | editar | eliminar
// ============================================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const accio   = payload.accio;
    const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (accio === "crear")   return jsonResponse(crear(sheet, payload));
    if (accio === "editar")  return jsonResponse(editar(sheet, payload));
    if (accio === "eliminar")return jsonResponse(eliminar(sheet, payload));

    return jsonResponse({ ok: false, error: "Acció desconeguda: " + accio });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ============================================================
//  Operacions CRUD
// ============================================================
function crear(sheet, p) {
  const id    = Utilities.getUuid();
  const data  = new Date().toISOString().split("T")[0];
  const fila  = [id, p.nom, p.descripcio, p.categoria, data, "actiu"];
  sheet.appendRow(fila);
  return { ok: true, registre: rowToObj(fila) };
}

function editar(sheet, p) {
  const fila = trobaFila(sheet, p.id);
  if (!fila) return { ok: false, error: "Registre no trobat: " + p.id };

  const row = fila.row;
  sheet.getRange(row, COLS.NOM).setValue(p.nom);
  sheet.getRange(row, COLS.DESCRIPCIO).setValue(p.descripcio);
  sheet.getRange(row, COLS.CATEGORIA).setValue(p.categoria);
  return { ok: true };
}

function eliminar(sheet, p) {
  const fila = trobaFila(sheet, p.id);
  if (!fila) return { ok: false, error: "Registre no trobat: " + p.id };

  sheet.getRange(fila.row, COLS.ESTAT).setValue("inactiu");
  return { ok: true };
}

// ============================================================
//  Utilitats
// ============================================================
function trobaFila(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][COLS.ID - 1] === id) return { row: i + 1, values: data[i] };
  }
  return null;
}

function rowToObj(r) {
  return {
    id:         r[COLS.ID - 1],
    nom:        r[COLS.NOM - 1],
    descripcio: r[COLS.DESCRIPCIO - 1],
    categoria:  r[COLS.CATEGORIA - 1],
    data:       r[COLS.DATA - 1],
    estat:      r[COLS.ESTAT - 1]
  };
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  Inicialitza el full si no existeix (executa manualment 1 cop)
// ============================================================
function inicialitzaSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const capcaleres = ["ID", "Nom", "Descripció", "Categoria", "Data", "Estat"];
  sheet.getRange(1, 1, 1, capcaleres.length).setValues([capcaleres]);
  sheet.getRange(1, 1, 1, capcaleres.length)
    .setBackground("#343a40")
    .setFontColor("#ffffff")
    .setFontWeight("bold");

  // Dades de mostra
  const mostra = [
    [Utilities.getUuid(), "Element de mostra 1", "Descripció de l'element 1", "Categoria A", "2026-01-10", "actiu"],
    [Utilities.getUuid(), "Element de mostra 2", "Descripció de l'element 2", "Categoria B", "2026-02-15", "actiu"],
    [Utilities.getUuid(), "Element de mostra 3", "Descripció de l'element 3", "Categoria A", "2026-03-20", "actiu"]
  ];
  sheet.getRange(2, 1, mostra.length, TOTAL_COLS).setValues(mostra);
  SpreadsheetApp.flush();
  Logger.log("Full '" + SHEET_NAME + "' inicialitzat correctament.");
}
