
import { Helmet } from "react-helmet-async";

interface Props {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    noIndex?: boolean;
}

const SITE_URL = "https://pastaprego.mx"; // Reemplazar con dominio real

export const SEO = ({
    title = "Pasta Prè-gō - Italiano Auténtico",
    description = "Auténtica cocina italiana entregada con pasión. Pastas frescas y salsas caseras.",
    image = "/images/products/hero-pasta.webp", // Ruta desde public/
    url = SITE_URL,
    noIndex = false
}: Props) => {

    const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
    const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Facebook / Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
        </Helmet>
    );
};

