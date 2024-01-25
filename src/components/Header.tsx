import { Helmet } from "react-helmet";
interface HeaderProps {
  title: string;
}
export default function Header(props: HeaderProps) {
  return (
    <Helmet>
      <title>{localStorage.getItem("cloakTitle") || props.title}</title>
      <link
        rel="icon"
        href={localStorage.getItem("cloakFavicon") || "/favicon.ico"}
      />
      {/* DOES NOT WORK NOOOO */}
      {window.location.origin === "http://localhost:8080" && (
        <div>
          <meta name="googlebot" content="index, follow, snippet" />
          <link rel="canonical" href="https://ephermal.incognitotgt.me" />
          <meta
            name="description"
            content="Ephermal is a web proxy that allows you to bypass internet censorship"
          />
          <meta
            name="keywords"
            content="Ephermal, Proxy, Web Proxy, Censorship, Bypass, Bypass Censorship"
          />
        </div>
      )}
    </Helmet>
  );
}
