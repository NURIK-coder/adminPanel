import { useEffect, useState } from "react";

export default function ScreenSizeGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-6">
        <div className="bg-white p-6 rounded-xl shadow text-red-600 text-lg font-semibold">
          Admin panel faqat <span className="text-blue-600">noutbuk</span> yoki <span className="text-blue-600">kompyuterda</span> ishlaydi.
        </div>
      </div>
    );
  }

  return children;
}
