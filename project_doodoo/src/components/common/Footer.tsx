import React from 'react';
import Link from 'next/link';


// 푸터에 들어갈 링크 데이터 구조 정의
const FOOTER_LINKS = [
  {
    title: "서비스 소개",
    links: [
      { label: "doodoo 소개", href: "/about" },
      { label: "자주 묻는 질문 (FAQ)", href: "/faq" },
      { label: "이용 약관", href: "/terms" },
      { label: "개인정보 처리방침", href: "/privacy" },
    ],
  },
  {
    title: "커뮤니티",
    links: [
      { label: "블로그", href: "/blog" },
      { label: "기여자 되기", href: "/contribute" },
      { label: "API", href: "/api-docs" },
      { label: "문의하기", href: "/contact" },
    ],
  },
];

// 간단한 소셜 미디어 아이콘 SVG
const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-gray-100 transition-colors duration-200"
    aria-label="소셜 미디어 링크"
  >
    {children}
  </a>
);


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* 1. 브랜드 및 저작권 정보 */}
          <div className="md:col-span-2">
            <Link href="/" className="text-3xl font-extrabold text-[#3C4DF8]  hover:opacity-80 transition-opacity">
              <img
                src="/logo/doodoo_logo.png"
                alt="DooDoo Logo"
                className="h-8 sm:h-10"
              />
              doodoo
            </Link>

            <p className="text-sm text-gray-400 max-w-sm">
              doodoo는 상업적 사용이 가능한 고화질, 고품질 무료 이미지 스톡 사이트입니다. 모든 이미지는 자유롭게 다운로드하고 수정할 수 있습니다.
            </p>

            {/* 소셜 미디어 아이콘 */}
            <div className="flex space-x-5 pt-2">
              <SocialIcon href="https://twitter.com/doodoo_official">
                {/* X/Twitter Icon (업데이트됨) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.854 9.043 9.47 12.986h-7.873l-5.45-7.464L4.856 22H1.54L9.882 12.91L1.992 2.25h7.247l4.38 5.766 5.894-5.766h-3.32z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com/doodoo_official">
                {/* Instagram Icon (기존 유지) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.716 0 3.056.01 4.123.064 1.066.059 1.79.227 2.428.463.639.236 1.157.57 1.571.985.414.415.748.933.985 1.571.236.639.404 1.362.463 2.428.054 1.066.064 1.407.064 4.123s-.01 3.056-.064 4.123c-.059 1.066-.227 1.79-.463 2.428-.236.639-.57 1.157-.985 1.571-.415.414-.933.748-1.571.985-.639.236-1.362.404-2.428.463-1.066.054-1.407.064-4.123.064s-3.056-.01-4.123-.064c-1.066-.059-1.79-.227-2.428-.463-.639-.236-1.157-.57-1.571-.985-.414-.415-.748-.933-.985-1.571-.236-.639-.404-1.362-.463-2.428-.054-1.066-.064-1.407-.064-4.123s.01-3.056.064-4.123c.059-1.066.227-1.79.463-2.428.236-.639.57-1.157.985-1.571.415-.414.933-.748 1.571-.985.639-.236 1.362-.404 2.428-.463C8.944 2.01 9.284 2 12 2zm0 2c-2.676 0-3.033.01-4.095.064-.961.053-1.467.218-1.896.387-.429.169-.74.398-1.01.669-.271.271-.5.582-.669 1.01-.169.429-.334.935-.387 1.896-.054 1.062-.064 1.419-.064 4.095s.01 3.033.064 4.095c.053.961.218 1.467.387 1.896.169.429.398.74.669 1.01.271.271.582.5.985.669.404.169.91.334 1.871.387 1.062.054 1.419.064 4.095.064s3.033-.01 4.095-.064c.961-.053 1.467-.218 1.896-.387.429-.169.74-.398 1.01-.669.271-.271.5-.582.669-1.01.169-.429.334-.935.387-1.896.054-1.062.064-1.419.064-4.095s-.01-3.033-.064-4.095c-.053-.961-.218-1.467-.387-1.896-.169-.429-.398-.74-.669-1.01-.271-.271-.582-.5-.985-.669-.404-.169-.91-.334-1.871-.387C15.033 4.01 14.676 4 12 4zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>
              </SocialIcon>
            </div>

            <p className="text-sm text-gray-500 pt-8">
              &copy; {new Date().getFullYear()} doodoo. All rights reserved.
            </p>
          </div>

          {/* {FOOTER_LINKS.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[#3C4DF8] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}

          {/*  
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">최신 소식 알림받기</h3>
            <p className="text-sm text-gray-400">
              doodoo의 최신 스톡이 뜰 때마다 이메일로 알림을 받아보세요
            </p>
          <div className="mt-4">
            <button className="bg-[#3C4DF8] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              뉴스레터 구독
            </button>
          </div>
        </div>
          */}
        </div>
      </div>
    </footer >
  );
}