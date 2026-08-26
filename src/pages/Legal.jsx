import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';

function LegalContent({ kind }) {
  const { t } = useLang();
  const title = kind === 'mentions' ? t('legal_mentions_title') : t('legal_privacy_title');
  const body = kind === 'mentions' ? t('legal_mentions_body') : t('legal_privacy_body');

  return (
    <div className="bg-warm min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-navy/60 hover:text-electric transition-colors mb-10"
        >
          <ArrowLeft size={16} /> {t('legal_back')}
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-solar" />
          <span className="text-solar font-bold tracking-label text-[11px] uppercase">SAYNARELEC · BELGIQUE</span>
        </div>

        <h1 className="font-heading font-semibold tracking-tightest text-navy text-4xl md:text-5xl leading-[0.98]">
          {title}
        </h1>

        <div className="mt-8 border-t border-navy/15 pt-8 space-y-5 text-navy/75 leading-relaxed text-lg">
          <p>
            <span className="font-medium text-navy">{t('legal_company')}</span> — {t('legal_country')}.
          </p>
          <p>{t('legal_owner')}</p>
          <p>
            {t('legal_email_label')}{' '}
            <a href={`mailto:${t('contact_email')}`} className="text-electric hover:text-solar transition-colors">
              {t('contact_email')}
            </a>
          </p>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
}

export default function Legal({ kind }) {
  return (
    <LanguageProvider>
      <LegalContent kind={kind} />
    </LanguageProvider>
  );
}