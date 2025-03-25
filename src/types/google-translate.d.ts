declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: any;
            autoDisplay: boolean;
          }, element: string): void;
          InlineLayout: {
            SIMPLE: any;
          };
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export {}