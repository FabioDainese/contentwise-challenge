// Components
import WizardContext from "@components/wizard-context";
import { Toaster } from "@components/ui/toaster";

// Fonts
import { Inter } from "next/font/google";

// Styles
import "@styles/globals.css";

// Types/Models/Schemas/...
type RootLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="p-8 md:p-16 xl:p-24">
          <WizardContext>{children}</WizardContext>
          <Toaster />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
