import React from "react";
import { Global, css } from "@emotion/react";

export default function Fonts() {
    return (
        <Global
        styles={css`
            @font-face {
            font-family: "GoBold";
            src: url("fonts/Gobold Bold Italic.otf") format("opentype");
            font-style: italic;
            font-weight: 700;
            font-display: swap;
            }
            @font-face {
            font-family: "Hack";
            src: url("fonts/Hack-Italic.ttf") format("truetype");

            font-style: italic;
            font-weight: 400;
            font-display: swap;
            }
        `}
        />
    );
}
