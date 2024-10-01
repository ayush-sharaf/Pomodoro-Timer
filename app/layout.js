import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Pomodoro Timer",
  description: "Pomodoro Timer helps you to get you disciplined about work",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white text-center py-4">
                <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center">
                {children}
            </main>
            <footer className="bg-blue-600 text-white text-center py-4">
                <p>&copy; 2024 Ayush Kumar Sharaf - Focus, Rest, and Repeat!</p>
            </footer>
        </div>
       
      </body>
    </html>
  );
}
