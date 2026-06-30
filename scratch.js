const fs = require('fs');
let file = fs.readFileSync('lib/i18n.ts', 'utf8');

const frContactStr = `
    // Contact
    contact_badge: "On est là pour vous",
    contact_title: "Contactez-nous",
    contact_sub: "Une question sur votre commande ? Un problème de livraison ? On vous répond rapidement.",
    contact_coords: "Nos coordonnées",
    contact_whatsapp_label: "WhatsApp (principal)",
    contact_whatsapp_sub: "Réponse en moins de 10 min",
    contact_phone_label: "Téléphone",
    contact_phone_sub: "Lun. – Sam., 7h – 12h",
    contact_email_label: "Email",
    contact_email_sub: "Réponse sous 24h",
    contact_address_label: "Adresse / Dakar, Sénégal",
    contact_address_sub: "Livraison partout dans le Grand Dakar",
    contact_hours: "Horaires de service",
    contact_hour_mon_fri: "Lundi – Vendredi",
    contact_hour_mon_fri_val: "7h00 – 11h30",
    contact_hour_sat: "Samedi",
    contact_hour_sat_val: "7h00 – 12h00",
    contact_hour_sun: "Dimanche",
    contact_hour_sun_val: "7h00 – 11h00",
    contact_form_title: "Envoyer un message",
    contact_name: "Prénom & Nom",
    contact_phone: "Téléphone",
    contact_email: "Email (optionnel)",
    contact_subject: "Sujet",
    contact_subject_placeholder: "Choisir un sujet…",
    contact_subject_1: "Suivi de commande",
    contact_subject_2: "Problème de livraison",
    contact_subject_3: "Réclamation",
    contact_subject_4: "Autre",
    contact_message: "Message",
    contact_message_placeholder: "Décrivez votre demande…",
    contact_send: "Envoyer le message",`;

const woContactStr = `
    // Contact
    contact_badge: "Fii la sunu kër / Ñungi fi ngir yaw",
    contact_title: "Jokkool ak nun",
    contact_sub: "Am nga laaj ci sa commande? Wallay jafe-jafe ci yobbal bi? Dinanu la tontu ci lu gaw.",
    contact_coords: "Funu ñu fekk",
    contact_whatsapp_label: "WhatsApp (Bu gën)",
    contact_whatsapp_sub: "Tontu biir 10 simili",
    contact_phone_label: "Téléphone",
    contact_phone_sub: "Altine — Aljumma, 7h — 12h",
    contact_email_label: "Email",
    contact_email_sub: "Tontu biir 24 waxtu",
    contact_address_label: "Féen / Ndakaaru, Gaal gi",
    contact_address_sub: "Ñungi yobbal fép ci Ndakaaru mbooloo",
    contact_hours: "Waxtu liggéey bi",
    contact_hour_mon_fri: "Altine — Aljumma",
    contact_hour_mon_fri_val: "7h00 – 11h30",
    contact_hour_sat: "Gaawu",
    contact_hour_sat_val: "7h00 – 12h00",
    contact_hour_sun: "Dibéer",
    contact_hour_sun_val: "7h00 – 11h00",
    contact_form_title: "Yabal joxe xabar",
    contact_name: "Sant ak Tur",
    contact_phone: "Téléphone",
    contact_email: "Email (Bo ko bëggé)",
    contact_subject: "Li tax nga jokkoo",
    contact_subject_placeholder: "Tànnal li tax…",
    contact_subject_1: "Xool commande bi",
    contact_subject_2: "Problème ci yobbal",
    contact_subject_3: "Fàttalikku",
    contact_subject_4: "Yeneen",
    contact_message: "Xabar",
    contact_message_placeholder: "Bindal li nga bëgg…",
    contact_send: "Yabal xabar bi",`;

file = file.replace(
  /\/\/ Contact\n    contact_badge: "On est là pour vous"[\s\S]*?contact_closed: "Fermé",/,
  frContactStr
);

file = file.replace(
  /\/\/ Contact\n    contact_badge: "Mën nañu fii"[\s\S]*?contact_closed: "Ferme",/,
  woContactStr
);

fs.writeFileSync('lib/i18n.ts', file);
