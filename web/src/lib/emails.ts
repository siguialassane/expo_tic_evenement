import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const TEMPLATE_REGISTRATION = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTRATION!;
const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!;

/* ------------------------------------------------------------------ */
/*  EMAIL AU PARTICIPANT (gratuit — confirmation immédiate)            */
/* ------------------------------------------------------------------ */
export async function sendParticipantConfirmation(data: {
  firstName: string;
  lastName: string;
  email: string;
  jours: string[];
}) {
  const joursText = data.jours.join(" et ");

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Inscription confirmée !</h1>
        <p style="color: #dcfce7; margin: 8px 0 0; font-size: 14px;">Abidjan Expo Tic 2026</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #1e293b;">Bonjour <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          Nous avons le plaisir de vous confirmer votre inscription à <strong>Abidjan Expo Tic 2026</strong>.<br/>
          Vous êtes inscrit(e) pour : <strong>${joursText}</strong>.
        </p>
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #166534;">
            📅 <strong>7 &amp; 8 Mai 2026</strong><br/>
            📍 <strong>Sofitel Hôtel Ivoire, Abidjan</strong><br/>
            🎟️ <strong>Entrée gratuite</strong> — Un QR code d'accès vous sera envoyé avant l'événement.
          </p>
        </div>
        <p style="font-size: 14px; color: #475569;">À très bientôt !</p>
        <p style="font-size: 14px; color: #475569;"><strong>L'équipe Difference Group</strong></p>
      </div>
      <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Abidjan Expo Tic 2026 — La Tech au service de l'Innovation</p>
      </div>
    </div>
  `;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_REGISTRATION,
    {
      title: "Confirmation d'inscription — Abidjan Expo Tic 2026",
      to_email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      email_participant: htmlBody,
    },
    PUBLIC_KEY
  );
}

/* ------------------------------------------------------------------ */
/*  EMAIL À L'EXPOSANT (inscription en étude)                         */
/* ------------------------------------------------------------------ */
export async function sendExposantReview(data: {
  company: string;
  contact: string;
  email: string;
  standSize: string;
  total: string;
}) {
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📋 Demande de stand reçue</h1>
        <p style="color: #ede9fe; margin: 8px 0 0; font-size: 14px;">Abidjan Expo Tic 2026</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #1e293b;">Bonjour <strong>${data.contact}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          Nous avons bien reçu votre demande de réservation de stand pour <strong>${data.company}</strong> à Abidjan Expo Tic 2026.
        </p>
        <div style="background: #faf5ff; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #581c87;">
            🏢 Stand : <strong>${data.standSize}</strong><br/>
            💰 Total estimé : <strong>${data.total}</strong>
          </p>
        </div>
        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          Votre inscription est actuellement <strong>en cours d'étude</strong>. Un membre de l'équipe <strong>Difference Group</strong> vous contactera sous <strong>48 heures</strong> pour finaliser votre réservation et vous communiquer les modalités de paiement.
        </p>
        <p style="font-size: 14px; color: #475569;">Cordialement,</p>
        <p style="font-size: 14px; color: #475569;"><strong>L'équipe Difference Group</strong></p>
      </div>
      <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Abidjan Expo Tic 2026 — La Tech au service de l'Innovation</p>
      </div>
    </div>
  `;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_REGISTRATION,
    {
      title: "Demande de stand reçue — Abidjan Expo Tic 2026",
      to_email: data.email,
      name: data.contact,
      email: data.email,
      email_participant: htmlBody,
    },
    PUBLIC_KEY
  );
}

/* ------------------------------------------------------------------ */
/*  EMAIL AU SPONSOR (inscription en étude)                           */
/* ------------------------------------------------------------------ */
export async function sendSponsorReview(data: {
  company: string;
  contact: string;
  email: string;
  packName: string;
  total: string;
}) {
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🤝 Demande de sponsoring reçue</h1>
        <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">Abidjan Expo Tic 2026</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #1e293b;">Bonjour <strong>${data.contact}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          Nous avons bien reçu votre demande de sponsoring pour <strong>${data.company}</strong> à Abidjan Expo Tic 2026.
        </p>
        <div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            🏆 Pack : <strong>${data.packName}</strong><br/>
            💰 Total estimé : <strong>${data.total}</strong>
          </p>
        </div>
        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          Votre inscription est actuellement <strong>en cours d'étude</strong>. Un membre de l'équipe <strong>Difference Group</strong> vous contactera sous <strong>48 heures</strong> pour finaliser votre partenariat et vous communiquer les modalités de paiement.
        </p>
        <p style="font-size: 14px; color: #475569;">Cordialement,</p>
        <p style="font-size: 14px; color: #475569;"><strong>L'équipe Difference Group</strong></p>
      </div>
      <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Abidjan Expo Tic 2026 — La Tech au service de l'Innovation</p>
      </div>
    </div>
  `;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_REGISTRATION,
    {
      title: "Demande de sponsoring reçue — Abidjan Expo Tic 2026",
      to_email: data.email,
      name: data.contact,
      email: data.email,
      email_participant: htmlBody,
    },
    PUBLIC_KEY
  );
}

/* ------------------------------------------------------------------ */
/*  NOTIFICATION ADMIN (nouvelle inscription)                         */
/* ------------------------------------------------------------------ */
export async function notifyAdmin(
  type: "participant" | "exposant" | "sponsor",
  data: Record<string, string>
) {
  const typeLabels: Record<string, string> = {
    participant: "👤 Nouveau Participant",
    exposant: "🏢 Nouvel Exposant",
    sponsor: "🤝 Nouveau Sponsor",
  };

  const detailsRows = Object.entries(data)
    .map(([key, val]) => `<tr><td style="padding:8px 12px;color:#64748b;font-size:13px;white-space:nowrap;">${key}</td><td style="padding:8px 12px;font-weight:600;color:#1e293b;font-size:13px;">${val}</td></tr>`)
    .join("");

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">${typeLabels[type]}</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">Nouvelle inscription — Abidjan Expo Tic 2026</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${detailsRows}
          </tbody>
        </table>
      </div>
      <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Connectez-vous à l'espace admin pour gérer cette inscription.</p>
      </div>
    </div>
  `;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ADMIN,
    {
      title: `${typeLabels[type]} — Abidjan Expo Tic 2026`,
      name: "Admin ExpoTic",
      email: "admin@expotic.ci",
      email_admin: htmlBody,
    },
    PUBLIC_KEY
  );
}
