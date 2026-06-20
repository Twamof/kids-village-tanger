function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("الورقة1") || spreadsheet.getActiveSheet();
    
    // Liste complète des en-têtes (incluant les colonnes existantes et les nouvelles informations)
    var headers = [
      "Date/Heure", "Nom Pere", "Nom Mere", "Telephone", "Tel. Urgence", "Email", "CIN/CNI", "Adresse",
      "Profession Pere", "Lieu Travail Pere", "Profession Mere", "Lieu Travail Mere", "Source",
      "Enfant 1 - Prenom", "Enfant 1 - Nom", "Enfant 1 - Date Naissance", "Enfant 1 - Ecole", "Enfant 1 - Allergies",
      "Enfant 2 - Prenom", "Enfant 2 - Nom", "Enfant 2 - Date Naissance", "Enfant 2 - Ecole", "Enfant 2 - Allergies",
      "Enfant 3 - Prenom", "Enfant 3 - Nom", "Enfant 3 - Date Naissance", "Enfant 3 - Ecole", "Enfant 3 - Allergies",
      "Statut",
      
      // Nouvelles colonnes pour Enfant 1
      "Enfant 1 - Sexe", "Enfant 1 - Classe", "Enfant 1 - Groupe Sanguin", "Enfant 1 - Contact Urgence Nom", "Enfant 1 - Contact Urgence Tél", "Enfant 1 - Consentement Photo", "Enfant 1 - Besoins Spécifiques", "Enfant 1 - Maladie connue", "Enfant 1 - Maladie chronique", "Enfant 1 - Médicaments", "Enfant 1 - Heure de prise", "Enfant 1 - Observations",
      
      // Nouvelles colonnes pour Enfant 2
      "Enfant 2 - Sexe", "Enfant 2 - Classe", "Enfant 2 - Groupe Sanguin", "Enfant 2 - Contact Urgence Nom", "Enfant 2 - Contact Urgence Tél", "Enfant 2 - Consentement Photo", "Enfant 2 - Besoins Spécifiques", "Enfant 2 - Maladie connue", "Enfant 2 - Maladie chronique", "Enfant 2 - Médicaments", "Enfant 2 - Heure de prise", "Enfant 2 - Observations",
      
      // Nouvelles colonnes pour Enfant 3
      "Enfant 3 - Sexe", "Enfant 3 - Classe", "Enfant 3 - Groupe Sanguin", "Enfant 3 - Contact Urgence Nom", "Enfant 3 - Contact Urgence Tél", "Enfant 3 - Consentement Photo", "Enfant 3 - Besoins Spécifiques", "Enfant 3 - Maladie connue", "Enfant 3 - Maladie chronique", "Enfant 3 - Médicaments", "Enfant 3 - Heure de prise", "Enfant 3 - Observations"
    ];
    
    // Si la feuille est vide, créer les en-têtes
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      // Si la feuille contient déjà des lignes, vérifier si les colonnes ont besoin d'être élargies
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
      data.father_job || "",
      data.father_work_place || "",
      data.mother_job || "",
      data.mother_work_place || "",
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
      c1.gender || "",
      c1.grade_level || "",
      c1.blood_group || "",
      c1.emergency_contact_name || "",
      c1.emergency_contact_phone || "",
      c1.photo_consent ? "Oui" : "Non",
      c1.special_needs || "",
      c1.known_illness || "",
      c1.chronic_illness || "",
      c1.medications || "",
      c1.medication_hours || "",
      c1.observations || "",
      
      // Enfant 2 (Nouvelles colonnes)
      c2.gender || "",
      c2.grade_level || "",
      c2.blood_group || "",
      c2.emergency_contact_name || "",
      c2.emergency_contact_phone || "",
      c2.photo_consent ? "Oui" : "Non",
      c2.special_needs || "",
      c2.known_illness || "",
      c2.chronic_illness || "",
      c2.medications || "",
      c2.medication_hours || "",
      c2.observations || "",
      
      // Enfant 3 (Nouvelles colonnes)
      c3.gender || "",
      c3.grade_level || "",
      c3.blood_group || "",
      c3.emergency_contact_name || "",
      c3.emergency_contact_phone || "",
      c3.photo_consent ? "Oui" : "Non",
      c3.special_needs || "",
      c3.known_illness || "",
      c3.chronic_illness || "",
      c3.medications || "",
      c3.medication_hours || "",
      c3.observations || ""
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
