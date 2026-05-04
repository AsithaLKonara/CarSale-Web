'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          ULTRA<span>DRIVE</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/inventory" className={pathname === '/inventory' ? styles.active : ''}>Inventory</Link>
          <Link href="/performance" className={pathname === '/performance' ? styles.active : ''}>Performance</Link>
          <Link href="/technology" className={pathname === '/technology' ? styles.active : ''}>Technology</Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : ''}>About</Link>
        </div>

        <div className={styles.navActions}>
          <Link href="/book">
            <button className={styles.primaryBtnSmall}>Book a Visit</button>
          </Link>
          <button className={styles.menuBtn}><Menu size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
