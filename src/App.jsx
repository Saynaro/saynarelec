import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '@/lib/i18n';
import { ContentProvider } from '@/lib/content';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Legal from '@/pages/Legal';
import ServicePage from '@/pages/ServicePage';
import ContactPage from '@/pages/ContactPage';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <ContentProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Direct Service Pages */}
                <Route path="/services/:slug" element={<ServicePage />} />
                <Route path="/electricite" element={<Navigate to="/services/electricite-generale" replace />} />
                <Route path="/installation-electrique" element={<Navigate to="/services/electricite-generale" replace />} />
                <Route path="/renovation-electrique" element={<Navigate to="/services/renovation-electrique" replace />} />
                <Route path="/mise-en-conformite" element={<Navigate to="/services/mise-en-conformite" replace />} />
                <Route path="/depannage-electrique" element={<Navigate to="/services/depannage-electrique" replace />} />
                <Route path="/depannage" element={<Navigate to="/services/depannage-electrique" replace />} />
                <Route path="/panneaux-solaires" element={<Navigate to="/services/panneaux-solaires" replace />} />
                <Route path="/eclairage" element={<Navigate to="/services/eclairage" replace />} />

                {/* Standalone Contact & Quote Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* Legal Pages */}
                <Route path="/mentions-legales" element={<Legal kind="mentions" />} />
                <Route path="/politique-confidentialite" element={<Legal kind="privacy" />} />

                {/* 404 */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ContentProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App