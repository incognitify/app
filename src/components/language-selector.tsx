"use client";

import { useTranslation } from "@/lib/i18n/translation-provider";
import { Language } from "@/lib/i18n/types";
import { useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-400 bg-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t("languageSelector.label")}
      >
        {t("languageSelector.label")}:{" "}
        {language === "en" ? t("languageSelector.english") : t("languageSelector.portuguese")}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-900 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            <button
              className={`${
                language === "en" ? "bg-gray-800 text-white" : "text-gray-300"
              } group flex rounded-md items-center w-full px-4 py-2 text-sm hover:bg-gray-800`}
              role="menuitem"
              onClick={() => changeLanguage("en")}
            >
              {t("languageSelector.english")}
            </button>
            <button
              className={`${
                language === "pt" ? "bg-gray-800 text-white" : "text-gray-300"
              } group flex rounded-md items-center w-full px-4 py-2 text-sm hover:bg-gray-800`}
              role="menuitem"
              onClick={() => changeLanguage("pt")}
            >
              {t("languageSelector.portuguese")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
