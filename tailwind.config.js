export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                surface: "#FEF7FF",
                "on-surface": "#49454F",
                primary: "#6750A4",
                "primary-fixed": "#D0BCFF",
                // Contrast text for primary surfaces
                "on-primary-contrast": "#FFFFFF",
            },
            fontFamily: {
                sans: ["Poppins", "ui-sans-serif", "system-ui"],
                serif: ["Georgia", "ui-serif", "serif"],
            },
            fontSize: {
                headline: ["20px", { lineHeight: "24px" }],
                "title-md": ["16px", { lineHeight: "24px" }],
                "body-lg": ["16px", { lineHeight: "24px" }],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        fontFamily: theme("fontFamily.serif").join(","),
                        p: {
                            marginTop: "1em",
                            marginBottom: "1em",
                            lineHeight: "1.7",
                        },
                    },
                },
                invert: {
                    css: {
                        fontFamily: theme("fontFamily.serif").join(","),
                        // Cores base
                        "--tw-prose-body": theme("colors.white / 0.9"),
                        "--tw-prose-headings": theme("colors.white"),
                        "--tw-prose-hr": theme("colors.white / 0.1"),
                        "--tw-prose-bold": theme("colors.white"),
                        "--tw-prose-counters": theme("colors.white / 0.7"),
                        "--tw-prose-bullets": theme("colors.white / 0.7"),
                        "--tw-prose-quotes": theme("colors.white"),
                        "--tw-prose-quote-borders": theme("colors.primary"),
                        "--tw-prose-captions": theme("colors.white / 0.7"),
                        "--tw-prose-code": theme("colors.white"),
                        "--tw-prose-pre-code": theme("colors.white"),
                        "--tw-prose-pre-bg": theme("colors.primary"),
                        "--tw-prose-th-borders": theme("colors.white / 0.2"),
                        "--tw-prose-td-borders": theme("colors.white / 0.1"),

                        /* LINKS — clareia e melhora acessibilidade */
                        a: {
                            color: theme("colors.primary-fixed"),
                            textDecorationColor: theme("colors.primary-fixed"),
                            textUnderlineOffset: "3px",
                            "&:hover": {
                                color: theme("colors.white"),
                                textDecorationColor: theme("colors.primary-fixed"),
                            },
                        },
                        "a code": {
                            color: "inherit",
                        },

                        /* MARCADORES DE LISTA (●, 1., etc) */
                        "ul > li::marker": {
                            color: theme("colors.white / 0.7"),
                        },
                        "ol > li::marker": {
                            color: theme("colors.white / 0.7"),
                        },

                        /* TÍTULOS */
                        "h1, h2, h3, h4, h5, h6": {
                            color: theme("colors.white"),
                        },
                    },
                },
            }),
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
