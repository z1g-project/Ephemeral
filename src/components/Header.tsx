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
    </Helmet>
  );
}
