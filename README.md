# La meva App – Google Sheets Web App

Aplicació web full-stack que utilitza **Google Sheets com a base de dades** i **Google Apps Script** com a API.

---

## Estructura de fitxers

```
├── Code.gs       ← Backend (Google Apps Script)
└── index.html    ← Frontend (Bootstrap 5 + Fetch API)
```

---

## Posada en marxa pas a pas

### 1. Crear el Google Sheet

1. Crea un nou Google Sheets al teu Google Drive.
2. Anomena la pestanya `Registres` (o canvia la constant `SHEET_NAME` a `Code.gs`).

### 2. Afegir el codi Apps Script

1. Al Google Sheet: **Extensions → Apps Script**.
2. Esborra el contingut per defecte i enganxa el contingut de `Code.gs`.
3. Desa el projecte (icona disquet).
4. Executa la funció `inicialitzaSheet()` **una sola vegada** per crear les capçaleres i dades de mostra.

### 3. Desplegar la Web App

1. A Apps Script: **Deploy → New deployment**.
2. Tipus: **Web App**.
3. Configuració:
   - **Execute as:** Me (el teu compte)
   - **Who has access:** Anyone  *(o "Anyone with Google account" si vols restringir)*
4. Copia l'**URL de la Web App** que et proporciona.

### 4. Configurar el Frontend

Obre `index.html` i substitueix la línia:

```javascript
const API_URL = "AQUÍ_LA_TEVA_URL_DE_WEB_APP";
```

per la URL copiada al pas anterior.

### 5. Obrir l'aplicació

Obre `index.html` al navegador (doble clic o arrossega al navegador).

---

## Estructura del Google Sheet (`Registres`)

| Columna | Nom        | Descripció                          |
|---------|------------|-------------------------------------|
| A       | ID         | UUID generat automàticament         |
| B       | Nom        | Nom del registre                    |
| C       | Descripció | Descripció opcional                 |
| D       | Categoria  | Etiqueta / categoria                |
| E       | Data       | Data de creació (YYYY-MM-DD)        |
| F       | Estat      | `actiu` o `inactiu` (el. lògica)   |

---

## Funcionalitats

| Funció          | Descripció                                        |
|-----------------|---------------------------------------------------|
| `doGet()`       | Retorna registres en JSON. Filtre: `?filtre=tots` o `?filtre=actiu` |
| `doPost()`      | CRUD: `crear`, `editar`, `eliminar` (lògica)     |
| Vista pública   | Taula amb cerca en temps real (només actius)     |
| Vista admin     | Taula completa + botons editar/desactivar + formulari modal |
| Responsive      | Adaptat a PC i mòbil (Bootstrap 5, menú hamburguesa) |
| Notificacions   | Toast de confirmació per a cada acció            |

---

## Personalització

### Colors corporatius

Edita les variables CSS a `index.html`:

```css
:root {
  --color-primary:   #0d6efd;   /* color principal / botons */
  --color-secondary: #6c757d;   /* accents secundaris */
  --color-dark:      #212529;   /* navbar i capçaleres */
  --color-light:     #f8f9fa;   /* fons de la pàgina */
}
```

### Nom i descripció de l'app

Canvia els textos a `index.html`:
- `<title>` → títol de la pestanya
- `navbar-brand` → nom a la barra de navegació
- `<h1>` al `<header>` → títol de la pàgina
- `<p class="lead">` → subtítol descriptiu

### Camps addicionals

1. Afegeix la columna al Sheet i actualitza `COLS` a `Code.gs`.
2. Afegeix el camp al formulari modal (`index.html`).
3. Actualitza `rowToObj()`, `crear()` i `editar()` a `Code.gs`.

---

## Seguretat

> La secció admin és accessible per a tothom. Per protegir-la, pots afegir:
> - Autenticació per contrasenya (JS)
> - Comprovació amb Google Login (OAuth)
> - Restricció a nivell d'Apps Script (`Session.getActiveUser()`)
