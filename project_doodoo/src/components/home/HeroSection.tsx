import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">

      {/* 메인 컨테이너 */}
      <section
        className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[90vw] max-w-[1400px]
        rounded-3xl shadow-lg bg-[var(--sub-color)]/90
        backdrop-blur-xl
        border border-white/20
        p-10 sm:p-18
        "
      >

        {/* TOP 영역 */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 text-[var(--primary-color)]">

          {/* LEFT TITLE */}
          <div className="flex-[1] text-center sm:text-left">
            <p className="text-5xl opacity-80 tracking-tight mb-2 animate-slideDown font-light">
              You can get
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight animate-slideDown delay-100 tracking-tighter">
              Unlimited<br />Free sources
            </h1>
          </div>

          {/* RIGHT SEARCH & LOGO 그룹 */}
          <div className="flex flex-col items-center w-full sm:w-1/2 gap-6 flex-[1.5]">

            {/* 로고 */}
            <a href="/" aria-label="Home">
              <img
                src="/logo/doodoo_logo.png"
                alt="DooDoo Logo"
                className="
                  w-[110px] sm:w-[130px]
                "
              />
            </a>

            {/* 메뉴 */}
            <nav className="w-full">
              <ul className="flex justify-between text-lg font-semibold tracking-tight px-6">
                {["Photo", "Illustration", "Template", "Icon", "Sticker"].map((item, i) => (
                  <li
                    key={i}
                    className="
                      cursor-pointer hover:text-[var(--primary-hover)]
                      transition-colors duration-200
                    "
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </nav>

            {/* 검색창 */}
            <form
              role="search"
              action="/search"
              method="get"
              className="
                flex items-center w-full
                bg-white border border-white/20 backdrop-blur-xl
                rounded-full h-12 px-4
                inset-shadow-xs
                focus-within:border-[var(--sub-hover)]
              "
            >
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="
                  w-full px-2 border-none outline-none
                  placeholder-white/60 text-gray-800
                "
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} className="w-5 y-5 text-[var(--primary-color)]" />
              </button>
            </form>

          </div>
        </header>

        {/* GALLERY GRID */}
        <div className="mt-14">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <div
                  className="
                    w-full h-[120px] sm:h-[150px]
                    rounded-xl bg-white/30 backdrop-blur-lg
                    shadow-inner
                    animate-fadeInUp
                    hover:bg-white/50 transition duration-300
                    cursor-pointer
                  "
                >
                </div>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </div>
  );
}
