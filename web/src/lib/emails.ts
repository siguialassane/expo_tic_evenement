import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_suerq1k";
const PUBLIC_KEY = "pCybPl8of-NZi9mLp";
const TEMPLATE_REGISTRATION = "template_5lhlxx4";
const TEMPLATE_ADMIN = "template_h2q3hij";

function initEmailJS() {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

/* ------------------------------------------------------------------ */
/*  HELPERS MISE EN PAGE                                               */
/* ------------------------------------------------------------------ */
function emailShell(body: string): string {
  return `
  <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f2f2f2;padding:40px 0;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #d6d6d6;">
      <div style="background:#0d1b2a;padding:28px 40px;">
        <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Abidjan Expo Tic 2026</p>
        <p style="margin:5px 0 0;color:#8899aa;font-size:11px;letter-spacing:1px;text-transform:uppercase;">7 &amp; 8 Mai 2026 &mdash; Sofitel H&ocirc;tel Ivoire, Abidjan</p>
      </div>
      <div style="padding:40px;">${body}</div>
      <div style="background:#f8f8f8;border-top:1px solid #e0e0e0;padding:20px 40px;">
        <p style="margin:0;font-size:11px;color:#999999;line-height:1.7;">Cet email a &eacute;t&eacute; g&eacute;n&eacute;r&eacute; automatiquement. Merci de ne pas y r&eacute;pondre directement.<br>Pour toute question&nbsp;: <a href="mailto:galadespmeinfos@gmail.com" style="color:#0d1b2a;text-decoration:none;">galadespmeinfos@gmail.com</a></p>
      </div>
    </div>
  </div>`;
}

function infoBlock(lines: string): string {
  return `<div style="background:#f8f8f8;border:1px solid #e0e0e0;padding:18px 22px;margin:24px 0;">${lines}</div>`;
}

function infoLine(label: string, value: string): string {
  return `<p style="margin:0 0 6px;font-size:13px;color:#333333;"><span style="color:#777777;display:inline-block;min-width:140px;">${label} :</span><strong>${value}</strong></p>`;
}

/* ------------------------------------------------------------------ */
/*  EMAIL AU PARTICIPANT                                               */
/* ------------------------------------------------------------------ */
export async function sendParticipantConfirmation(data: {
  firstName: string;
  lastName: string;
  email: string;
  jours: string[];
}) {
  initEmailJS();
  const joursText = data.jours.join(" et ");

  const body = `
    <p style="font-size:20px;font-weight:600;color:#0d1b2a;margin:0 0 8px;">Confirmation d&rsquo;inscription</p>
    <p style="font-size:13px;color:#777777;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase;">Participation &mdash; Entr&eacute;e gratuite</p>

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 20px;">
      Madame, Monsieur <strong>${data.firstName} ${data.lastName}</strong>,
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 24px;">
      Nous avons bien enregistr&eacute; votre inscription &agrave; <strong>Abidjan Expo Tic 2026</strong>. Nous vous remercions de l&rsquo;int&eacute;r&ecirc;t que vous portez &agrave; cet &eacute;v&eacute;nement.
    </p>

    ${infoBlock(
      infoLine("Jours s&eacute;lectionn&eacute;s", joursText) +
      infoLine("Date", "7 &amp; 8 Mai 2026") +
      infoLine("Lieu", "Sofitel H&ocirc;tel Ivoire, Abidjan") +
      infoLine("Participation", "Gratuite")
    )}

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 16px;">
      Vous recevrez prochainement un second email contenant votre <strong>badge d&rsquo;acc&egrave;s</strong>, le <strong>programme d&eacute;taill&eacute;</strong> de l&rsquo;&eacute;v&eacute;nement ainsi que d&rsquo;autres informations pratiques. Nous vous invitons &agrave; rester attentif &agrave; vos messages.
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 32px;">
      Dans l&rsquo;attente de vous accueillir, nous vous adressons nos cordiales salutations.
    </p>

    <p style="font-size:13px;color:#333333;margin:0;line-height:1.6;">L&rsquo;&eacute;quipe Difference Group</p>
    <p style="font-size:12px;color:#999999;margin:4px 0 0;">Organisation &mdash; Abidjan Expo Tic 2026</p>
  `;

  return emailjs.send(SERVICE_ID, TEMPLATE_REGISTRATION, {
    title: "Confirmation d'inscription — Abidjan Expo Tic 2026",
    to_email: data.email,
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    email_participant: emailShell(body),
  });
}

/* ------------------------------------------------------------------ */
/*  EMAIL A L'EXPOSANT                                                 */
/* ------------------------------------------------------------------ */
export async function sendExposantReview(data: {
  company: string;
  contact: string;
  email: string;
  standSize: string;
  total: string;
}) {
  initEmailJS();

  const body = `
    <p style="font-size:20px;font-weight:600;color:#0d1b2a;margin:0 0 8px;">Demande de r&eacute;servation de stand</p>
    <p style="font-size:13px;color:#777777;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase;">Dossier en cours d&rsquo;&eacute;tude</p>

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 20px;">
      Madame, Monsieur <strong>${data.contact}</strong>,
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 24px;">
      Nous accusons bonne r&eacute;ception de votre demande de r&eacute;servation de stand pour le compte de <strong>${data.company}</strong> dans le cadre d&rsquo;<strong>Abidjan Expo Tic 2026</strong>.
    </p>

    ${infoBlock(
      infoLine("Soci&eacute;t&eacute;", data.company) +
      infoLine("Dimension du stand", data.standSize) +
      infoLine("Montant estim&eacute;", data.total) +
      infoLine("Statut", "En cours d&rsquo;&eacute;tude")
    )}

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 16px;">
      Votre dossier est actuellement en cours d&rsquo;&eacute;tude par notre &eacute;quipe. Un charg&eacute; de clientèle prendra contact avec vous <strong>dans un d&eacute;lai de 48 heures</strong> afin de finaliser les modalit&eacute;s de votre r&eacute;servation.
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 16px;">
      Vous recevrez &eacute;galement un email de confirmation incluant la <strong>convention de partenariat</strong>, le <strong>plan d&rsquo;implantation des stands</strong> et l&rsquo;ensemble des informations logistiques. Restez attentif &agrave; vos communications.
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 32px;">
      Nous vous remercions de la confiance que vous accordez &agrave; cet &eacute;v&eacute;nement et nous r&eacute;jouissons de vous compter parmi nos exposants.
    </p>

    <p style="font-size:13px;color:#333333;margin:0;line-height:1.6;">L&rsquo;&eacute;quipe Difference Group</p>
    <p style="font-size:12px;color:#999999;margin:4px 0 0;">Organisation &mdash; Abidjan Expo Tic 2026</p>
  `;

  return emailjs.send(SERVICE_ID, TEMPLATE_REGISTRATION, {
    title: "Demande de stand reçue — Abidjan Expo Tic 2026",
    to_email: data.email,
    name: data.contact,
    email: data.email,
    email_participant: emailShell(body),
  });
}

/* ------------------------------------------------------------------ */
/*  EMAIL AU SPONSOR                                                   */
/* ------------------------------------------------------------------ */
export async function sendSponsorReview(data: {
  company: string;
  contact: string;
  email: string;
  packName: string;
  total: string;
}) {
  initEmailJS();

  const body = `
    <p style="font-size:20px;font-weight:600;color:#0d1b2a;margin:0 0 8px;">Demande de partenariat sponsoring</p>
    <p style="font-size:13px;color:#777777;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase;">Dossier en cours d&rsquo;&eacute;tude</p>

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 20px;">
      Madame, Monsieur <strong>${data.contact}</strong>,
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 24px;">
      Nous accusons bonne r&eacute;ception de votre demande de partenariat sponsoring pour le compte de <strong>${data.company}</strong> dans le cadre d&rsquo;<strong>Abidjan Expo Tic 2026</strong>.
    </p>

    ${infoBlock(
      infoLine("Soci&eacute;t&eacute;", data.company) +
      infoLine("Pack s&eacute;lectionn&eacute;", data.packName) +
      infoLine("Montant estim&eacute;", data.total) +
      infoLine("Statut", "En cours d&rsquo;&eacute;tude")
    )}

    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 16px;">
      Votre dossier est actuellement en cours d&rsquo;&eacute;tude par notre &eacute;quipe. Un charg&eacute; de clientèle prendra contact avec vous <strong>dans un d&eacute;lai de 48 heures</strong> afin de finaliser les conditions de votre partenariat.
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 16px;">
      Vous recevrez &eacute;galement un email de suivi comprenant la <strong>convention de sponsoring</strong>, la <strong>visibilit&eacute; pr&eacute;vue</strong> pour votre marque ainsi que le <strong>programme officiel</strong> de l&rsquo;&eacute;v&eacute;nement. Restez attentif &agrave; vos communications.
    </p>
    <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 32px;">
      Nous vous remercions de votre engagement en faveur de l&rsquo;innovation technologique et nous sommes honor&eacute;s de vous compter parmi nos partenaires.
    </p>

    <p style="font-size:13px;color:#333333;margin:0;line-height:1.6;">L&rsquo;&eacute;quipe Difference Group</p>
    <p style="font-size:12px;color:#999999;margin:4px 0 0;">Organisation &mdash; Abidjan Expo Tic 2026</p>
  `;

  return emailjs.send(SERVICE_ID, TEMPLATE_REGISTRATION, {
    title: "Demande de sponsoring reçue — Abidjan Expo Tic 2026",
    to_email: data.email,
    name: data.contact,
    email: data.email,
    email_participant: emailShell(body),
  });
}

/* ------------------------------------------------------------------ */
/*  NOTIFICATION ADMIN                                                 */
/* ------------------------------------------------------------------ */
export async function notifyAdmin(
  type: "participant" | "exposant" | "sponsor",
  data: Record<string, string>
) {
  initEmailJS();

  const typeLabels: Record<string, string> = {
    participant: "Nouveau Participant",
    exposant: "Nouvel Exposant",
    sponsor: "Nouveau Sponsor",
  };

  const rows = Object.entries(data)
    .map(
      ([key, val]) =>
        `<tr>
          <td style="padding:10px 14px;font-size:12px;color:#777777;white-space:nowrap;border-bottom:1px solid #eeeeee;background:#f8f8f8;">${key}</td>
          <td style="padding:10px 14px;font-size:12px;color:#1a1a1a;font-weight:600;border-bottom:1px solid #eeeeee;">${val}</td>
        </tr>`
    )
    .join("");

  const body = `
    <p style="font-size:20px;font-weight:600;color:#0d1b2a;margin:0 0 8px;">${typeLabels[type]}</p>
    <p style="font-size:13px;color:#777777;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase;">Nouvelle inscription — ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-collapse:collapse;">
      <tbody>${rows}</tbody>
    </table>

    <p style="font-size:13px;color:#777777;margin:24px 0 0;line-height:1.6;">
      Connectez-vous &agrave; l&rsquo;<a href="http://localhost:3000/admin/dashboard" style="color:#0d1b2a;font-weight:600;">espace d&rsquo;administration</a> pour examiner et traiter cette demande.
    </p>
  `;

  const adminHtml = `
  <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f2f2f2;padding:40px 0;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #d6d6d6;">
      <div style="background:#0d1b2a;padding:28px 40px;">
        <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Abidjan Expo Tic 2026 &mdash; Administration</p>
      </div>
      <div style="padding:40px;">${body}</div>
    </div>
  </div>`;

  return emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, {
    title: `${typeLabels[type]} — Abidjan Expo Tic 2026`,
    name: "Admin ExpoTic",
    email: "admin@expotic.ci",
    email_admin: adminHtml,
  });
}
