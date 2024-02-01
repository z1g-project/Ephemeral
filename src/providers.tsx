
import { ThemeProvider } from 'next-themes'
import { ReactNode } from "react";
type LayoutProps = {
    children: ReactNode;
  };
export function Providers({ children }: LayoutProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}