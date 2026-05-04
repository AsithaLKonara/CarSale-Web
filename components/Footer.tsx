import React from 'react';
import Link from 'next/link';
import { Share2, Globe, MessageSquare, Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={`${styles.footerCol} ${styles.brand}`}>
            <Link href="/" className={styles.footerLogo}>
              ULTRA<span>DRIVE</span>
            </Link>
            <p className={styles.brandText}>
              The world's premier destination for ultra-luxury and performance supercars. Engineering excellence, delivered to your doorstep.
            </p>
            <div className={styles.socialLinks}>
              <Link href="#"><Share2 size={20} /></Link>
              <Link href="#"><Globe size={20} /></Link>
              <Link href="#"><MessageSquare size={20} /></Link>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/inventory">Inventory</Link></li>
              <li><Link href="/performance">Performance</Link></li>
              <li><Link href="/technology">Technology</Link></li>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/test-drive">Book Test Drive</Link></li>
              <li><Link href="/finance">Financing</Link></li>
              <li><Link href="/warranty">Warranty</Link></li>
            </ul>
          </div>

          <div className={`${styles.footerCol} ${styles.contact}`}>
            <h4>Get in Touch</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} />
              <span>123 Supercar Drive, Los Angeles, CA 90210</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} />
              <span>+1 (555) 000-SUPER</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} />
              <span>sales@ultradrive.com</span>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2024 UltraDrive Automotive Group. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
