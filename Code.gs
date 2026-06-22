function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("الورقة1") || spreadsheet.getActiveSheet();
    
    // Liste complète des en-têtes (incluant les colonnes existantes et les nouvelles informations)
    var headers = [
      "Date/Heure", "Nom Pere", "Nom Mere", "Telephone", "Tel. Urgence", "Email", "CIN/CNI", "Adresse",
      "Personne Autorisée (Nom)", "Personne Autorisée (Téléphone)", "Source",
      "Enfant 1 - Prenom", "Enfant 1 - Nom", "Enfant 1 - Date Naissance", "Enfant 1 - Ecole", "Enfant 1 - Allergies",
      "Enfant 2 - Prenom", "Enfant 2 - Nom", "Enfant 2 - Date Naissance", "Enfant 2 - Ecole", "Enfant 2 - Allergies",
      "Enfant 3 - Prenom", "Enfant 3 - Nom", "Enfant 3 - Date Naissance", "Enfant 3 - Ecole", "Enfant 3 - Allergies",
      "Statut",
      "Enfant 1 - Sexe", "Enfant 1 - Classe", "Enfant 1 - Groupe Sanguin", "Enfant 1 - Contact Urgence Nom", "Enfant 1 - Contact Urgence Tel", "Enfant 1 - Consentement Photo",
      "Enfant 2 - Sexe", "Enfant 2 - Classe", "Enfant 2 - Groupe Sanguin", "Enfant 2 - Contact Urgence Nom", "Enfant 2 - Contact Urgence Tel", "Enfant 2 - Consentement Photo",
      "Enfant 3 - Sexe", "Enfant 3 - Classe", "Enfant 3 - Groupe Sanguin", "Enfant 3 - Contact Urgence Nom", "Enfant 3 - Contact Urgence Tel", "Enfant 3 - Consentement Photo"
    ];
    
    // Si la feuille est vide, créer les en-têtes
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      // S'assurer que les en-têtes de la première ligne correspondent exactement
      var lastCol = sheet.getLastColumn();
      if (lastCol < headers.length) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
    
    var timestamp = data.timestamp || new Date().toLocaleString('fr-FR');
    var children = data.children || [];
    
    // Récupérer individuellement les enfants (Max 3)
    var c1 = children[0] || {};
    var c2 = children[1] || {};
    var c3 = children[2] || {};
    
    // Assemblage de la ligne
    var rowData = [
      timestamp,
      data.father_name || "",
      data.mother_name || "",
      data.phone || "",
      data.emergency_phone || "",
      data.email || "",
      data.cin || "",
      data.address || "",
      data.authorized_name || "",
      data.authorized_phone || "",
      data.source || "Inscription en ligne",
      
      // Enfant 1 (Colonnes existantes)
      c1.first_name || "",
      c1.last_name || "",
      c1.date_of_birth || "",
      c1.school_name || "",
      c1.allergies || "",
      
      // Enfant 2 (Colonnes existantes)
      c2.first_name || "",
      c2.last_name || "",
      c2.date_of_birth || "",
      c2.school_name || "",
      c2.allergies || "",
      
      // Enfant 3 (Colonnes existantes)
      c3.first_name || "",
      c3.last_name || "",
      c3.date_of_birth || "",
      c3.school_name || "",
      c3.allergies || "",
      
      "En attente", // Statut (AC)
      
      // Enfant 1 (Nouvelles colonnes)
      c1.gender === "boy" ? "Garçon" : (c1.gender === "girl" ? "Fille" : ""),
      c1.grade_level || "",
      c1.blood_group || "",
      c1.emergency_contact_name || "",
      c1.emergency_contact_phone || "",
      c1.photo_consent ? "Oui" : "Non",
      
      // Enfant 2 (Nouvelles colonnes)
      c2.gender === "boy" ? "Garçon" : (c2.gender === "girl" ? "Fille" : ""),
      c2.grade_level || "",
      c2.blood_group || "",
      c2.emergency_contact_name || "",
      c2.emergency_contact_phone || "",
      c2.photo_consent ? "Oui" : "Non",
      
      // Enfant 3 (Nouvelles colonnes)
      c3.gender === "boy" ? "Garçon" : (c3.gender === "girl" ? "Fille" : ""),
      c3.grade_level || "",
      c3.blood_group || "",
      c3.emergency_contact_name || "",
      c3.emergency_contact_phone || "",
      c3.photo_consent ? "Oui" : "Non"
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════════
// doGet — Handle GET requests
// ═══════════════════════════════════════════════════════════════
// ?action=clearImported  → Delete all data rows (keep header)
// (no action)            → Health check / status
// ═══════════════════════════════════════════════════════════════
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  
  if (action === 'clearImported') {
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = spreadsheet.getSheetByName("الورقة1") || spreadsheet.getActiveSheet();
      var lastRow = sheet.getLastRow();
      
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
        return ContentService.createTextOutput(JSON.stringify({
          "result": "success", "action": "clearImported", "deleted_rows": lastRow - 1
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        "result": "success", "action": "clearImported", "deleted_rows": 0
      })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error", "action": "clearImported", "error": error.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok', message: 'Kids Village Registration API is running!'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Fonction pour nettoyer la feuille et mettre à jour les en-têtes automatiquement
function cleanSheetAndHeaders() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("الورقة1") || spreadsheet.getActiveSheet();
  
  // 1. Colonnes obsolètes à supprimer
  var toDelete = [
    "Profession Pere", "Lieu Travail Pere", "Profession Mere", "Lieu Travail Mere",
    "Enfant 1 - Besoins Specifiques", "Enfant 1 - Maladie connue", "Enfant 1 - Maladie chronique", "Enfant 1 - Medicaments", "Enfant 1 - Heure de prise", "Enfant 1 - Observations",
    "Enfant 2 - Besoins Specifiques", "Enfant 2 - Maladie connue", "Enfant 2 - Maladie chronique", "Enfant 2 - Medicaments", "Enfant 2 - Heure de prise", "Enfant 2 - Observations",
    "Enfant 3 - Besoins Specifiques", "Enfant 3 - Maladie connue", "Enfant 3 - Maladie chronique", "Enfant 3 - Medicaments", "Enfant 3 - Heure de prise", "Enfant 3 - Observations"
  ];
  
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var colIndexesToDelete = [];
    for (var i = 0; i < currentHeaders.length; i++) {
      var headerVal = currentHeaders[i].toString().trim();
      if (toDelete.indexOf(headerVal) !== -1) {
        colIndexesToDelete.push(i + 1);
      }
    }
    colIndexesToDelete.sort(function(a, b) { return b - a; });
    for (var j = 0; j < colIndexesToDelete.length; j++) {
      sheet.deleteColumn(colIndexesToDelete[j]);
    }
  }
  
  // 2. Insérer les colonnes pour la personne autorisée avant "Source" si nécessaire
  lastCol = sheet.getLastColumn();
  var currentHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var sourceIndex = -1;
  for (var i = 0; i < currentHeaders.length; i++) {
    if (currentHeaders[i].toString().trim() === "Source") {
      sourceIndex = i + 1;
      break;
    }
  }
  var hasAuthNom = false;
  var hasAuthTel = false;
  for (var i = 0; i < currentHeaders.length; i++) {
    var h = currentHeaders[i].toString().trim();
    if (h === "Personne Autorisée (Nom)") hasAuthNom = true;
    if (h === "Personne Autorisée (Téléphone)" || h === "Personne Autorisée (Tél)") hasAuthTel = true;
  }
  if (sourceIndex !== -1 && !hasAuthNom && !hasAuthTel) {
    sheet.insertColumnsBefore(sourceIndex, 2);
  }
  
  // 3. Réécrire et formater tous les en-têtes
  var finalHeaders = [
    "Date/Heure", "Nom Pere", "Nom Mere", "Telephone", "Tel. Urgence", "Email", "CIN/CNI", "Adresse",
    "Personne Autorisée (Nom)", "Personne Autorisée (Téléphone)", "Source",
    "Enfant 1 - Prenom", "Enfant 1 - Nom", "Enfant 1 - Date Naissance", "Enfant 1 - Ecole", "Enfant 1 - Allergies",
    "Enfant 2 - Prenom", "Enfant 2 - Nom", "Enfant 2 - Date Naissance", "Enfant 2 - Ecole", "Enfant 2 - Allergies",
    "Enfant 3 - Prenom", "Enfant 3 - Nom", "Enfant 3 - Date Naissance", "Enfant 3 - Ecole", "Enfant 3 - Allergies",
    "Statut",
    "Enfant 1 - Sexe", "Enfant 1 - Classe", "Enfant 1 - Groupe Sanguin", "Enfant 1 - Contact Urgence Nom", "Enfant 1 - Contact Urgence Tel", "Enfant 1 - Consentement Photo",
    "Enfant 2 - Sexe", "Enfant 2 - Classe", "Enfant 2 - Groupe Sanguin", "Enfant 2 - Contact Urgence Nom", "Enfant 2 - Contact Urgence Tel", "Enfant 2 - Consentement Photo",
    "Enfant 3 - Sexe", "Enfant 3 - Classe", "Enfant 3 - Groupe Sanguin", "Enfant 3 - Contact Urgence Nom", "Enfant 3 - Contact Urgence Tel", "Enfant 3 - Consentement Photo"
  ];
  
  sheet.getRange("1:1").clearContent();
  sheet.getRange(1, 1, 1, finalHeaders.length).setValues([finalHeaders]);
  
  var headerRange = sheet.getRange(1, 1, 1, finalHeaders.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0F52BA"); // Bleu
  headerRange.setFontColor("#FFFFFF"); // Blanc
  
  Logger.log("Nettoyage et mise à jour des en-têtes terminés avec succès !");
}
