// Tailwind CSS Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "gdg-blue": "#4285F4",
                "gdg-red": "#DB4437",
                "gdg-yellow": "#F4B400",
                "gdg-green": "#0F9D58",
                "background-light": "#ffffff",
                "background-dark": "#1a1a1a",
                "foreground-light": "#3c4043",
                "foreground-dark": "#e8eaed",
                "input-light": "#f1f3f4",
                "input-dark": "#2d2d2d",
                "border-light": "#dadce0",
                "border-dark": "#5f6368",
                "placeholder-light": "#80868b",
                "placeholder-dark": "#9aa0a6"
            },
            fontFamily: {
                "display": ["Roboto", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
}