import { Poppins, IBM_Plex_Mono, Covered_By_Your_Grace } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "./(home)/components/Shared/SmoothScrollProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const grace = Covered_By_Your_Grace({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-grace",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const metropolis = localFont({
  src: [
    {
      path: "../public/metropolis/Metropolis-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/metropolis/Metropolis-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-metropolis",
});
export const metadata = {
  title: 'Limitless Studio',
  description: 'Premium Digital Experiences',
  icons: {
    icon: '/icon.png', // Reference a file in the public folder
    apple: '/icon.png',
  },
}


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${grace.variable} ${ibmPlexMono.variable} ${metropolis.variable} h-full antialiased`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
