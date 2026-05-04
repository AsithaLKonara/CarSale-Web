import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          ULTRA<span>DRIVE</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/inventory">Inventory</Link>
          <Link href="/performance">Performance</Link>
          <Link href="/technology">Technology</Link>
          <Link href="/about">About</Link>
        </div>

        <div className={styles.navActions}>
          <button className={styles.primaryBtnSmall}>Book a Visit</button>
          <button className={styles.menuBtn}><Menu size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
