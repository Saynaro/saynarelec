import React from 'react';
import { LanguageProvider } from '@/lib/i18n';
import { ContentProvider } from '@/lib/content';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Services from '@/components/site/Services';
import About from '@/components/site/About';
import Realisations from '@/components/site/Realisations';
import SolarSection from '@/components/site/SolarSection';
import Process from '@/components/site/Process';
import FinalCTA from '@/components/site/FinalCTA';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';
import AdminBar from '@/components/site/cms/AdminBar';

export default function Home() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <div className="bg-warm min-h-screen overflow-x-hidden w-full max-w-[100vw]">
          <Header />
          <main className="overflow-x-hidden w-full">
            <Hero />
            <Services />
            <About />
            <Realisations />
            <SolarSection />
            <Process />
            <FinalCTA />
            <Contact />
          </main>
          <Footer />
          <AdminBar />
        </div>
      </ContentProvider>
    </LanguageProvider>
  );
}