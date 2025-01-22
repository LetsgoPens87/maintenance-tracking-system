import React from 'react';
import '../app/globals.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Equipment Management System</title>
        {/* Add this line to link to your favicon */}
        <link rel="icon" href="/kanehl_consulting_llc_logo.ico" />
      </head>
      <body className="flex flex-col min-h-screen">
        <header className="bg-black p-4">
          <h1 className="text-3xl text-white text-center">Equipment Management System</h1>
        </header>
        <main className="flex-grow p-4">
          {children}
        </main>
        <footer className="bg-black text-white text-center p-4">
          <p>©Kanehl Consulting LLC</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;