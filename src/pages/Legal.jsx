import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageProvider, useLang } from '@/lib/i18n';
import SEO from '@/components/SEO';
import { ArrowLeft } from 'lucide-react';

const legalContent = {
  fr: {
    back: 'Retour au site',
    badge: 'SAYNARELEC · BELGIQUE',
    mentions: {
      title: 'Mentions Légales',
      description: "Informations légales, identification de l'entreprise et conditions générales d'utilisation du site Saynarelec.",
      sections: [
        {
          title: "1. Identification de l'entreprise",
          paragraphs: [
            "Le présent site internet est édité par l'entreprise Saynarelec, spécialisée dans les travaux d'électricité générale, la rénovation, la mise en conformité et les solutions solaires photovoltaïques en Belgique.",
            "• Dénomination : Saynarelec",
            "• Site web : saynarelec.com",
            "• Responsable de la publication & gérant : Ibragim Sainaro",
            "• Pays d'établissement : Belgique",
            "• Contact e-mail : contact@saynarelec.com",
            "• Activité : Électricité générale du bâtiment, rénovations complètes, conformité RGIE, dépannage électrique et pose de panneaux solaires."
          ]
        },
        {
          title: "2. Conformité aux normes & Réglementation RGIE",
          paragraphs: [
            "Toutes les interventions et installations réalisées par Saynarelec sont strictement exécutées en conformité avec le Règlement Général sur les Installations Électriques (RGIE) en vigueur en Belgique.",
            "Les travaux sont préparés selon les règles de l'art en vue de l'obtention du certificat de conformité lors du passage des organismes de contrôle agréés belges."
          ]
        },
        {
          title: "3. Hébergement du site",
          paragraphs: [
            "Le site internet est hébergé par la société Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, États-Unis).",
            "La navigation et les échanges de données sur le site sont sécurisés par le protocole de chiffrement SSL/TLS (HTTPS)."
          ]
        },
        {
          title: "4. Propriété intellectuelle",
          paragraphs: [
            "L'ensemble des éléments figurant sur le site Saynarelec (textes, photographies, logos, charte graphique, mise en page et codes) sont protégés par les dispositions du Code de droit économique belge et les traités internationaux relatifs à la propriété intellectuelle.",
            "Toute reproduction, représentation, diffusion ou modification, totale ou partielle, de ces éléments sans l'accord écrit préalable de Saynarelec est strictement interdite."
          ]
        },
        {
          title: "5. Devis et limitation de responsabilité",
          paragraphs: [
            "Les informations et descriptifs de prestations présentés sur ce site sont donnés à titre informatif et indicatif.",
            "Seul un devis écrit et formel, établi après étude technique ou visite sur place et accepté par les deux parties, constitue un engagement contractuel.",
            "Saynarelec s'efforce d'assurer l'exactitude des informations fournies sur le site, mais décline toute responsabilité en cas d'erreur ou d'indisponibilité momentanée du service."
          ]
        },
        {
          title: "6. Droit applicable et juridiction compétente",
          paragraphs: [
            "Les présentes mentions légales sont soumises au droit belge. En cas de contestation, les juridictions belges compétentes seront seules habilitées à trancher le litige."
          ]
        }
      ]
    },
    privacy: {
      title: 'Politique de Confidentialité',
      description: "Protection de vos données personnelles, conformité au RGPD et gestion de vos droits.",
      sections: [
        {
          title: "1. Engagement et respect du RGPD",
          paragraphs: [
            "Saynarelec s'engage à respecter la vie privée et la confidentialité des données personnelles de ses utilisateurs et clients.",
            "Les traitements de données effectués sur ce site sont conformes au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des données personnelles."
          ]
        },
        {
          title: "2. Responsable du traitement",
          paragraphs: [
            "Le responsable du traitement des données est :",
            "• Entreprise : Saynarelec",
            "• Responsable : Ibragim Sainaro",
            "• Site web : saynarelec.com",
            "• E-mail de contact : contact@saynarelec.com",
            "• Pays : Belgique"
          ]
        },
        {
          title: "3. Données collectées et finalités",
          paragraphs: [
            "Nous collectons uniquement les informations transmises volontairement via le formulaire de contact ou par e-mail afin de traiter vos demandes :",
            "• Données d'identité et de contact : Nom, prénom, adresse e-mail, numéro de téléphone.",
            "• Données relatives au projet : Type de travaux souhaités, description du chantier et localisation.",
            "• Finalités : Traitement et réponse à votre demande de devis, organisation technique des interventions, suivi de chantier et facturation.",
            "• Base légale : Exécution de mesures précontractuelles ou contractuelles (Article 6.1.b du RGPD) et obligations légales et comptables (Article 6.1.c du RGPD)."
          ]
        },
        {
          title: "4. Confidentialité et non-transmission des données",
          paragraphs: [
            "Vos données sont traitées de façon strictement confidentielle.",
            "Saynarelec ne commercialise, ne loue et ne cède aucune donnée personnelle à des tiers à des fins publicitaires.",
            "Seuls les prestataires techniques indispensables au fonctionnement du service (service sécurisé d'envoi d'e-mails, hébergeur) ont accès aux données strictement nécessaires à leur mission."
          ]
        },
        {
          title: "5. Durée de conservation des données",
          paragraphs: [
            "• Demandes de devis restées sans suite : conservées pendant un délai maximal de 2 ans à compter du dernier contact.",
            "• Données clients et facturation : conservées pendant 7 à 10 ans conformément aux obligations fiscales, comptables et légales en vigueur en Belgique."
          ]
        },
        {
          title: "6. Vos droits (RGPD)",
          paragraphs: [
            "Conformément à la réglementation européenne, vous bénéficiez des droits suivants :",
            "• Droit d'accès, de rectification et d'effacement (« droit à l'oubli ») de vos données.",
            "• Droit à la limitation du traitement et droit d'opposition pour motifs légitimes.",
            "• Droit à la portabilité de vos données personnelles.",
            "Pour exercer ces droits, envoyez simplement un e-mail à contact@saynarelec.com. Votre demande sera traitée sous 30 jours."
          ]
        },
        {
          title: "7. Cookies",
          paragraphs: [
            "Ce site utilise exclusivement des éléments techniques nécessaires au bon fonctionnement et à la sécurité de votre navigation. Aucun cookie publicitaire ou traceur invasif n'est utilisé."
          ]
        },
        {
          title: "8. Réclamation auprès de l'autorité compétente",
          paragraphs: [
            "Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire une réclamation auprès de l'Autorité de Protection des Données en Belgique (APD / GBA) :",
            "• Rue de la Presse 35, 1000 Bruxelles — Site : https://www.autoriteprotectiondonnees.be"
          ]
        }
      ]
    }
  },
  nl: {
    back: 'Terug naar de site',
    badge: 'SAYNARELEC · BELGIË',
    mentions: {
      title: 'Wettelijke Vermeldingen',
      description: 'Juridische informatie, identificatie van de uitgever en gebruiksvoorwaarden van de website Saynarelec.',
      sections: [
        {
          title: '1. Bedrijfsidentificatie',
          paragraphs: [
            'Deze website wordt uitgegeven door Saynarelec, gespecialiseerd in algemene elektriciteit, renovatie, AREI-gelijkvormigheid en zonne-energie in België.',
            '• Handelsnaam: Saynarelec',
            '• Website: saynarelec.com',
            '• Zaakvoerder & publicatieverantwoordelijke: Ibragim Sainaro',
            '• Land van vestiging: België',
            '• E-mail: contact@saynarelec.com'
          ]
        },
        {
          title: '2. AREI-conformiteit & Keuringen',
          paragraphs: [
            'Alle elektrische installaties door Saynarelec worden uitgevoerd volgens het Algemeen Reglement op de Elektrische Installaties (AREI) in België.'
          ]
        },
        {
          title: '3. Intellectuele eigendom',
          paragraphs: [
            'Alle teksten, afbeeldingen en ontwerpen op deze site zijn beschermd door het auteursrecht. Reproductie zonder schriftelijke toestemming is verboden.'
          ]
        },
        {
          title: '4. Toepasselijk recht',
          paragraphs: [
            'Het Belgisch recht is van toepassing. Geschillen vallen onder de bevoegdheid van de bevoegde Belgische rechtbanken.'
          ]
        }
      ]
    },
    privacy: {
      title: 'Privacybeleid (AVG / GDPR)',
      description: 'Bescherming van persoonsgegevens en beheer van uw rechten volgens de AVG.',
      sections: [
        {
          title: '1. Verwerkingsverantwoordelijke',
          paragraphs: [
            'Saynarelec (Ibragim Sainaro) — België — saynarelec.com — contact@saynarelec.com'
          ]
        },
        {
          title: '2. Verzamelde gegevens & Doel',
          paragraphs: [
            'Wij verzamelen uitsluitend de nodige contactgegevens (naam, e-mail, telefoon, projectbeschrijving) om uw offerteaanvraag te verwerken.',
            'Gegevens worden nooit verkocht aan derden voor commerciële doeleinden.'
          ]
        },
        {
          title: '3. Uw rechten',
          paragraphs: [
            'U heeft recht op inzage, correctie en verwijdering van uw gegevens via contact@saynarelec.com.'
          ]
        }
      ]
    }
  },
  en: {
    back: 'Back to site',
    badge: 'SAYNARELEC · BELGIUM',
    mentions: {
      title: 'Legal Notice',
      description: 'Legal information, company identification, and terms of use for Saynarelec.',
      sections: [
        {
          title: '1. Company Identification',
          paragraphs: [
            'This website is published by Saynarelec, general electricity and solar company operating in Belgium.',
            '• Commercial name: Saynarelec',
            '• Website: saynarelec.com',
            '• Publication manager: Ibragim Sainaro',
            '• Country: Belgium',
            '• Email: contact@saynarelec.com'
          ]
        },
        {
          title: '2. Standards & RGIE Compliance',
          paragraphs: [
            'All electrical works carried out by Saynarelec strictly comply with Belgian RGIE / AREI regulations.'
          ]
        },
        {
          title: '3. Intellectual Property & Law',
          paragraphs: [
            'All website contents are protected under Belgian and international copyright laws. Belgian law applies to all disputes.'
          ]
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy (GDPR)',
      description: 'Personal data protection and management of your privacy rights under the GDPR.',
      sections: [
        {
          title: '1. Data Controller',
          paragraphs: [
            'Saynarelec (Ibragim Sainaro) — Belgium — saynarelec.com — contact@saynarelec.com'
          ]
        },
        {
          title: '2. Data Collection & Purpose',
          paragraphs: [
            'We only collect information submitted via the contact form (name, email, phone, project details) to respond to your quote requests and manage electrical works.',
            'Your data is strictly confidential and never sold to third parties.'
          ]
        },
        {
          title: '3. Your Rights',
          paragraphs: [
            'You may request access, correction, or deletion of your personal data at any time by contacting contact@saynarelec.com.'
          ]
        }
      ]
    }
  }
};

function formatParagraph(text) {
  // Replace saynarelec.com with clean link
  if (text.includes('saynarelec.com')) {
    const parts = text.split('saynarelec.com');
    return (
      <>
        {parts[0]}
        <a
          href="https://saynarelec.com"
          className="text-electric hover:text-solar transition-colors font-medium underline"
        >
          saynarelec.com
        </a>
        {parts[1]}
      </>
    );
  }

  // Replace contact email with mailto link
  if (text.includes('contact@saynarelec.com')) {
    const parts = text.split('contact@saynarelec.com');
    return (
      <>
        {parts[0]}
        <a
          href="mailto:contact@saynarelec.com"
          className="text-electric hover:text-solar transition-colors font-medium underline"
        >
          contact@saynarelec.com
        </a>
        {parts[1]}
      </>
    );
  }

  // Replace external https:// links
  if (text.includes('https://www.autoriteprotectiondonnees.be')) {
    const parts = text.split('https://www.autoriteprotectiondonnees.be');
    return (
      <>
        {parts[0]}
        <a
          href="https://www.autoriteprotectiondonnees.be"
          target="_blank"
          rel="noreferrer"
          className="text-electric hover:text-solar transition-colors underline"
        >
          autoriteprotectiondonnees.be
        </a>
        {parts[1]}
      </>
    );
  }

  return text;
}

function LegalContent({ kind }) {
  const { lang } = useLang();
  const currentLang = legalContent[lang] ? lang : 'fr';
  const data = legalContent[currentLang];
  const doc = kind === 'mentions' ? data.mentions : data.privacy;
  const canonical = kind === 'mentions' ? '/mentions-legales' : '/politique-confidentialite';

  return (
    <div className="bg-warm min-h-screen">
      <SEO
        title={`${doc.title} | Saynarelec Belgique`}
        description={doc.description}
        canonical={canonical}
        lang={lang}
        noindex={true}
      />

      <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-28">
        {/* Back link */}
        <Link
          to="/#footer"
          className="inline-flex items-center gap-2 text-sm text-navy/60 hover:text-electric transition-colors mb-10 font-medium cursor-pointer"
        >
          <ArrowLeft size={16} /> {data.back}
        </Link>

        {/* Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-solar" />
          <span className="text-solar font-bold tracking-label text-[11px] uppercase">
            {data.badge}
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-5xl leading-[0.98]">
          {doc.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-navy/70 text-base md:text-lg leading-relaxed">
          {doc.description}
        </p>

        {/* Content Body */}
        <div className="mt-10 border-t border-navy/15 pt-10 space-y-10">
          {doc.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-navy">
                {section.title}
              </h2>
              <div className="space-y-2 text-navy/75 leading-relaxed text-base md:text-lg">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className={p.startsWith('•') ? 'pl-2 text-navy/85 font-medium' : ''}>
                    {formatParagraph(p)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info line */}
        <div className="mt-16 border-t border-navy/15 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-navy/50">
          <span>© {new Date().getFullYear()} Saynarelec — Électricité · Solaire · Belgique</span>
          <div className="flex gap-4">
            {kind === 'mentions' ? (
              <Link to="/politique-confidentialite" className="text-navy/60 hover:text-electric transition-colors">
                Politique de confidentialité →
              </Link>
            ) : (
              <Link to="/mentions-legales" className="text-navy/60 hover:text-electric transition-colors">
                Mentions légales →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Legal({ kind }) {
  return <LegalContent kind={kind} />;
}