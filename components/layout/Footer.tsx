import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-800 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-4">Awareness Be</h2>
            <p className="text-cream-100/80 text-sm leading-relaxed max-w-md mb-6">
              Bridging evidence-based metabolic health, gut resilience, and conscious 
              living to help you thrive from the inside out. Est. 2026.
            </p>
            <div className="flex items-center space-x-2 text-cream-100/60 text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-amber-300" />
              <span>for holistic wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-cream-100/60">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#philosophy" className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/#book" className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  Consultations
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-cream-100/60">
              Connect
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-cream-100/80">
                <Mail className="w-4 h-4 text-amber-300" />
                <span>hello@awarenessbe.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-cream-100/80">
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Schedule via booking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream-100/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-cream-100/50">
              © {currentYear} Awareness Be. All rights reserved.
            </p>
            <p className="text-xs text-cream-100/40 text-center md:text-right max-w-xl">
              The information provided on Awareness Be is for educational purposes only 
              and does not substitute professional medical advice. Always consult with 
              a qualified healthcare provider before making any health-related decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}