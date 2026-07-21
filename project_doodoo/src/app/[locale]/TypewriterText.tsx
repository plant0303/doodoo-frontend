import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function TypewriterText({
  words,
  typingSpeed = 300,
  deletingSpeed = 120,
  pauseTime = 1800,
}: TypewriterTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[textIndex];

    // 지우는 중일 때
    if (isDeleting) {
      if (subIndex === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % words.length);
        return;
      }

      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev - 1);
      }, deletingSpeed);

      return () => clearTimeout(timeout);
    }

    // 써내려가는 중일 때
    if (subIndex === currentWord.length) {
      // 다 썼으면 일정 시간 대기 후 지우기 시작
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + 1);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, textIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  // 커서 깜빡임 효과
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="inline-flex items-center text-[var(--primary-color)] font-semibold min-h-[1em]">
      <span>{words[textIndex]?.substring(0, subIndex)}</span>
      <span
        className={`ml-0.5 inline-block w-[3px] h-[1em] bg-blue-700 transition-opacity ${
          isBlinking ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </span>
  );
}