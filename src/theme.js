import { createTheme } from "@material-ui/core"

export const theme = {
    light: {
        primaryColor: '#faf1e6',
        secondaryColor: '#ffc074',
        tertiaryColor: "#ffddb5",
        forthColor: '#fff5d5',
        fifthColor: '#b78c00',
        backgroundColor: '#f6f5f5',
        darkColor: 'black'
    },
}

export const themeMui = createTheme(theme)