import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

// Fonction pour générer un token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Configuration Multer
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
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

// ✅ Brevo HTTP API — remplace nodemailer (contourne le blocage SMTP de Render)
const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "TECHNOVIA",
        email: process.env.EMAIL_USER || "abdoulayeseibou126@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }
  return response.json();
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test email
app.get("/api/test-email", async (req, res) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      return res.status(400).json({ success: false, message: "BREVO_API_KEY non configurée" });
    }
    await sendEmail(
      process.env.EMAIL_USER || "abdoulayeseibou126@gmail.com",
      "✅ Test email TECHNOVIA",
      "<p>Email de test envoyé depuis Render via Brevo API. Configuration OK !</p>"
    );
    res.json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur email",
    });
  }
});

// Route d'envoi de candidature
app.post("/api/applications/submit", upload.single("cv"), async (req, res) => {
  try {
    const {
      fullName, email, phone, motivation, experience,
      skills, availability, questions, jobTitle, companyName,
    } = req.body;

    if (!fullName || !email || !phone || !motivation) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "CV requis" });
    }

    const applicationId = `APP-${Date.now()}`;
    const token = generateToken();
    const date = new Date().toLocaleDateString("fr-FR");
    const time = new Date().toLocaleTimeString("fr-FR");

    // Insérer la candidature dans Supabase
    const { error: appError } = await supabase.from("applications").insert({
      id: applicationId,
      full_name: fullName,
      email,
      phone,
      motivation,
      experience: experience || "Non fourni",
      skills: skills || "Non fourni",
      availability: availability || "Non spécifiée",
      questions: questions || "Aucune",
      job_title: jobTitle,
      company_name: companyName,
      date,
      time,
      cv_file: req.file.originalname,
    });

    if (appError) throw new Error(appError.message);

    // Insérer le token dans Supabase
    const { error: tokenError } = await supabase.from("tokens").insert({
      token,
      application_id: applicationId,
      email,
      created_at: Date.now(),
      expires_at: Date.now() + 24 * 60 * 60 * 1000,
      used: false,
    });

    if (tokenError) throw new Error(tokenError.message);

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const verificationUrl = `${frontendUrl}/technical-form?token=${token}&appId=${applicationId}`;

    const candidateEmailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #120F14; padding: 36px 32px; text-align: center; }
          .header h1 { color: rgb(255,205,0); margin: 0; font-size: 24px; font-weight: 800; }
          .content { padding: 36px 32px; }
          .success-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; margin-bottom: 24px; border-radius: 6px; }
          .success-box h2 { color: #15803d; margin-top: 0; font-size: 18px; }
          .btn { display: inline-block; background: rgb(255,205,0); color: #120F14; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 800; margin-top: 20px; font-size: 15px; border: 2px solid #120F14; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 24px; }
          .detail-row { margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 14px; }
          .detail-label { font-weight: 700; color: #333; }
          .detail-value { color: #666; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
          .url-box { word-break: break-all; font-size: 12px; color: #999; background: #f5f5f5; padding: 12px; border-radius: 6px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>✓ Candidature Reçue</h1></div>
          <div class="content">
            <p style="font-size:16px;">Bonjour <strong>${fullName}</strong>,</p>
            <div class="success-box">
              <h2>Merci ! Votre candidature a bien été envoyée 🎉</h2>
              <p style="margin:0;color:#166534;">Nous avons reçu votre candidature pour le poste de <strong>${jobTitle}</strong> chez <strong>${companyName}</strong>.</p>
            </div>
            <p style="color:#444;">Pour finaliser votre dossier, veuillez compléter le formulaire technique en cliquant sur le bouton ci-dessous :</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${verificationUrl}" class="btn">Accéder au formulaire technique →</a>
            </div>
            <p style="font-size:13px;color:#888;">Ou copiez ce lien dans votre navigateur :</p>
            <div class="url-box">${verificationUrl}</div>
            <div class="details">
              <h3 style="margin-top:0;color:#333;font-size:15px;">Récapitulatif</h3>
              <div class="detail-row"><span class="detail-label">Poste :</span><span class="detail-value">${jobTitle}</span></div>
              <div class="detail-row"><span class="detail-label">Entreprise :</span><span class="detail-value">${companyName}</span></div>
              <div class="detail-row"><span class="detail-label">Nom :</span><span class="detail-value">${fullName}</span></div>
              <div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${date} à ${time}</span></div>
            </div>
            <p style="margin-top:24px;color:#999;font-size:13px;">⚠️ Ce lien expire dans 24 heures.</p>
          </div>
          <div class="footer"><p>Email envoyé automatiquement par TECHNOVIA.</p></div>
        </div>
      </body>
      </html>
    `;

    const companyEmailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"></head>
      <body style="font-family:sans-serif;padding:20px;background:#f5f5f5;">
        <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;padding:32px;">
          <h2 style="color:#120F14;border-bottom:3px solid rgb(255,205,0);padding-bottom:12px;">📨 Nouvelle candidature — ${jobTitle}</h2>
          <p><strong>Nom :</strong> ${fullName}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${phone}</p>
          <p><strong>Date :</strong> ${date} à ${time}</p>
          <h3>Motivation</h3>
          <p style="background:#f9f9f9;padding:16px;border-radius:8px;">${motivation.replace(/\n/g, "<br>")}</p>
          <p style="color:#888;font-size:13px;">⚠️ Le CV a été joint à cette candidature.</p>
        </div>
      </body>
      </html>
    `;

    // Envoi email candidat
    sendEmail(email, `✓ Candidature reçue — ${jobTitle} chez ${companyName}`, candidateEmailHtml)
      .then(() => console.log(`✅ Email envoyé au candidat: ${email}`))
      .catch((err) => console.error("❌ Erreur email candidat:", err.message));

    // Envoi email entreprise
    sendEmail(
      process.env.COMPANY_EMAIL || "company@example.com",
      `Nouvelle candidature — ${jobTitle}`,
      companyEmailHtml
    )
      .then(() => console.log(`✅ Email envoyé à l'entreprise`))
      .catch((err) => console.error("❌ Erreur email entreprise:", err.message));

    // Supprimer le CV après envoi
    setTimeout(() => {
      fs.unlink(req.file!.path, (err) => {
        if (err) console.error("Erreur suppression fichier:", err);
      });
    }, 10000);

    res.json({
      success: true,
      message: "Candidature envoyée avec succès.",
      applicationId,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({
      error: "Erreur lors du traitement de la candidature",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Vérifier le token
app.post("/api/verify-token", async (req, res) => {
  try {
    const { token, applicationId } = req.body;

    if (!token || !applicationId) {
      return res.status(400).json({ error: "Token ou applicationId manquant" });
    }

    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (data.expires_at < Date.now()) {
      return res.status(400).json({ error: "Token expiré" });
    }

    if (data.application_id !== applicationId) {
      return res.status(400).json({ error: "ApplicationId ne correspond pas" });
    }

    res.json({ success: true, message: "Token valide", applicationId });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la vérification" });
  }
});

// Soumettre le formulaire technique
app.post("/api/technical-form/submit", async (req, res) => {
  try {
    const {
      token, applicationId, email, password,
      technicalQuestion1, technicalQuestion2, technicalQuestion3,
    } = req.body;

    if (!token || !applicationId) {
      return res.status(400).json({ error: "Token ou applicationId manquant" });
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (tokenData.expires_at < Date.now()) {
      return res.status(400).json({ error: "Token expiré" });
    }

    if (tokenData.application_id !== applicationId) {
      return res.status(400).json({ error: "ApplicationId ne correspond pas" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data: appData, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !appData) {
      return res.status(400).json({ error: "Candidature non trouvée" });
    }

    const { error: updateError } = await supabase
      .from("applications")
      .update({
        technical_email: email,
        technical_password: password,
        technical_question1: technicalQuestion1,
        technical_question2: technicalQuestion2,
        technical_question3: technicalQuestion3,
        technical_form_submitted_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (updateError) throw new Error(updateError.message);

    await supabase.from("tokens").update({ used: true }).eq("token", token);

    // Email de confirmation formulaire technique
    sendEmail(
      email,
      `✓ Formulaire Technique Reçu — ${appData.job_title}`,
      `<div style="font-family:sans-serif;padding:32px;max-width:500px;margin:0 auto;">
        <h2 style="color:#120F14;">✓ Formulaire reçu !</h2>
        <p>Bonjour <strong>${appData.full_name}</strong>,</p>
        <p>Votre formulaire technique a bien été soumis. Nous reviendrons vers vous prochainement.</p>
        <p style="color:#888;font-size:13px;">Merci de votre intérêt pour le poste de ${appData.job_title}.</p>
      </div>`
    ).catch(console.error);

    console.log(`✅ Formulaire technique reçu pour ${applicationId}`);

    res.json({
      success: true,
      message: "Formulaire technique soumis avec succès",
      applicationId,
    });
  } catch (error) {
    console.error("Erreur soumission formulaire technique:", error);
    res.status(500).json({
      error: "Erreur lors de la soumission du formulaire",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Route admin — toutes les candidatures
app.get("/api/admin/applications", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const formattedApplications: Record<string, any> = {};
    data.forEach((app: any) => {
      formattedApplications[app.id] = {
        fullName: app.full_name,
        email: app.email,
        phone: app.phone,
        motivation: app.motivation,
        experience: app.experience,
        skills: app.skills,
        availability: app.availability,
        questions: app.questions,
        jobTitle: app.job_title,
        companyName: app.company_name,
        date: app.date,
        time: app.time,
        cvFile: app.cv_file,
        technicalEmail: app.technical_email,
        technicalPassword: app.technical_password,
        technicalQuestion1: app.technical_question1,
        technicalQuestion2: app.technical_question2,
        technicalQuestion3: app.technical_question3,
        technicalFormSubmittedAt: app.technical_form_submitted_at,
      };
    });

    res.json({ success: true, count: data.length, applications: formattedApplications });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des candidatures",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

// Test endpoint
app.get("/api/test-create-application", async (req, res) => {
  try {
    const testAppId = "test-" + Date.now();
    const testToken = generateToken();

    const { error: appError } = await supabase.from("applications").insert({
      id: testAppId,
      full_name: "Test Candidat",
      email: "test@example.com",
      phone: "0612345678",
      motivation: "Application de test",
      experience: "Test",
      skills: "Test",
      availability: "Immédiatement",
      questions: "Test questions",
      job_title: "Stage Développement Web",
      company_name: "TECHNOVIA",
      date: new Date().toLocaleDateString("fr-FR"),
      time: new Date().toLocaleTimeString("fr-FR"),
      cv_file: "test.pdf",
    });

    if (appError) throw new Error(appError.message);

    const { error: tokenError } = await supabase.from("tokens").insert({
      token: testToken,
      application_id: testAppId,
      email: "test@example.com",
      created_at: Date.now(),
      expires_at: Date.now() + 24 * 60 * 60 * 1000,
      used: false,
    });

    if (tokenError) throw new Error(tokenError.message);

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const technicalFormUrl = `${frontendUrl}/technical-form?token=${testToken}&appId=${testAppId}`;

    res.json({
      success: true,
      message: "Application de test créée",
      technicalFormUrl,
      token: testToken,
      applicationId: testAppId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création de l'application de test",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 Serveur lancé sur http://localhost:${port}             
║  📧 Email: ${process.env.EMAIL_USER || "À configurer"}
║  🏢 Destinataire: ${process.env.COMPANY_EMAIL || "À configurer"}
║  🔑 Brevo API: ${process.env.BREVO_API_KEY ? "✅ Configurée" : "❌ Manquante"}
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;