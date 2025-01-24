// File Location: app/layout.tsx
// Description: Global layout for the app with a footer.

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Footer with GitHub Pages link */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "20px",
            padding: "10px",
            fontSize: "14px",
            color: "#666",
            backgroundColor: "#f5f5f5",
          }}
        >
          <p>
            Visit the app on GitHub Pages:{" "}
            <a
              href="https://dboa9.github.io/housing_disrepair_next/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              GitHub Pages
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
