// mainpage, SSG
import React from 'react'
import styles from '@/styles/components/HeroSection.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Ballpit from './Ballpit';

function HeroSection() {
  return (
    <div className={styles.container}>
      <section className={styles.mainVisual}>
        <header className={styles.topCont}>
          <div className={styles.title}>
            <p>You can get</p>
            <span>Unlimited <br></br>Free sources</span>
          </div>
          <div className={styles.searchCont}>
            <div className={styles.logoContainer}>
              <a href="/" aria-label="Home">
                <img
                  src="/logo/doodoo_logo.png"  // public/logo/doodoo_logo.png
                  alt="DooDoo Logo"
                  height={80}
                />
              </a>
            </div>
            <nav className={styles.gnb}>
              <ul>
                <li><a>Photo</a></li>
                <li><a>Illustration</a></li>
                <li><a>Template</a></li>
                <li><a>Icon</a></li>
                <li><a>Sticker</a></li>
              </ul>
            </nav>
            <form
              role="search"
              className={styles.searchInputContainer}
              action="/search"  // 실제 검색 페이지 경로 지정
              method="get"
            >
              <input type="text" placeholder="Search..." aria-label="search" name="q" />
              <button type="submit" aria-label="검색">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form >
          </div>
        </header>
        <div className={styles.gallery}>
          <ul>
            <li>
              <div className={styles.galleryImg}></div>
            </li>
            <li>
              <div className={styles.galleryImg}></div>
            </li>
            <li>
              <div className={styles.galleryImg}></div>
            </li>
            <li>
              <div className={styles.galleryImg}></div>
            </li>
          </ul>
        </div>
      </section>
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', maxHeight: '100%', zIndex: '-999' }}>
        <Ballpit
          count={20}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}

          // ball design
          colors={['#FFF18D', '#FFA578', '#FFD2D2']}
          ambientColor={16777215} //주변광 색
          ambientIntensity={0} //주변광 정도
          minSize={0.2} // 최소사이즈
          maxSize={2} // 최대사이즈
        />
      </div>
    </div>
  )
}

export default HeroSection
