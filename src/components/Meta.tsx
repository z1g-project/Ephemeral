import { Helmet } from "react-helmet";
// todo - get these to only appear conditionally, and maybe add fake meta tags
export default function Meta() {
  return (
    <Helmet>
      <meta name="googlebot" content="index, follow, snippet" />
      <link rel="canonical" href="https://ephermal.incognitotgt.me/" />
      <meta
        name="keywords"
        content="proxy, web proxy, unblock websites, unblock chromebook, free web proxy, proxy list, proxy sites, un block chromebook, online proxy, proxy server, proxysite, proxy youtube, bypass securly, bypass iboss, bypass lightspeed filter, z1g, chromebooks, titanium network, unblock youtube, youtube proxy, unblocked youtube, youtube unblocked"
      />
      <meta property="og:site_name" content="Ephermal" />
      <meta property="og:url" content="https://ephermal.incognitotgt.me/" />
      <meta property="og:title" content="Ephermal" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Ephermal is a web proxy that allows you to bypass internet restrictions such as firewalls, filters, and parental controls. It has a simple and clean UI, and has powerful features such as userscripts, userstyles, and a browser like UI"
      />
      <script type="application/ld+json">
        {`
            {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ephermal",
            "url": "https://ephermal.incognitotgt.me",
            "sameAs": [
                "https://github.com/z1g-project",
                "https://ephermal.incognitotgt.me"
            ]
        }
            `}
      </script>
      <script type="application/ld+json">
        {`
           {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
                "@type": "Question",
                "name": "What is Ephermal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ephermal is a web proxy that allows you to bypass internet restrictions such as firewalls, filters, and parental controls. It has a simple and clean UI, and has powerful features such as userscripts, userstyles, and a browser like UI"
                }
            }, {
                "@type": "Question",
                "name": "How do I unblock websites at school?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Using Ephermal, a powerful web proxy that circumvents network and extension filters. It is also open-source and free to use."
                }
            }, {
                "@type": "Question",
                "name": "What sites can I unblock with Ephermal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With Ephermal you can access sites such as Discord, Spotify, YouTube and other game sites!"
                }
            },  {
                "@type": "Question",
                "name": "Does Ephermal hide my search history?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Change your Tab appearance in Settings and make the tab look like another site!."
                }
            }, {
                "@type": "Question",
                "name": "Is Ephermal open-source?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Check out our GitHub where you can deploy or host your own instance of Ephermal."
                }
            }]
           }
            `}
      </script>
    </Helmet>
  );
}
