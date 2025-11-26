"use client";
// mainpage
import React, { useState } from 'react'
import styles from '@/styles/components/HeroSection.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());

    router.push(`/list?${params.toString()}`);
  };

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
                  height={50}
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
              action="/list" // 실제 검색 페이지 경로 지정
              method="get"
              onSubmit={handleSearch} // 라우팅 함수 연결
            >
              <input
                type="text"
                placeholder="Search..."
                aria-label="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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
    </div>
  )
}

export default HeroSection
