import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";

/* ---------- Animations ---------- */
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

// Animate width to a CSS variable so we can include buffer space
const typing = keyframes`
  from { width: 0 }
  to   { width: var(--tw); }
`;

const caretBlink = keyframes`50% { border-color: transparent; }`;

const flipInOut = keyframes`
  0%   { opacity: 0; transform: perspective(600px) rotateX(-90deg); }
  15%  { opacity: 1; transform: perspective(600px) rotateX(0deg); }
  85%  { opacity: 1; transform: perspective(600px) rotateX(0deg); }
  100% { opacity: 0; transform: perspective(600px) rotateX(90deg); }
`;
const flipInHold = keyframes`
  0%   { opacity: 0; transform: perspective(600px) rotateX(-90deg); }
  25%  { opacity: 1; transform: perspective(600px) rotateX(0deg); }
  100% { opacity: 1; transform: perspective(600px) rotateX(0deg); }
`;

/* ---------- TypedText (with anti-clipping buffer) ---------- */
function TypedText({
  text,
  delay = 0,
  speed = 60,
  caret = "blink",
  bufferCh = 0.8, // extra width in "ch" to prevent italic clipping
  sx = {},
}) {
  const steps = Math.max(1, text.length);
  const durationMs = steps * speed;
  const withBlink = caret === "blink";

  // final width = characters + buffer
  const finalWidth = `calc(${steps}ch + ${bufferCh}ch)`;

  return (
    <Box
      component="span"
      sx={{
        "--tw": finalWidth,                 // used by keyframes
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        width: finalWidth,                  // reserve final width to avoid layout shift
        borderRight: caret === "none" ? "none" : "2px solid currentColor",
        paddingRight: caret === "none" ? "0.2ch" : 0, // tiny breathing room at the end
        animation: `
          ${typing} ${durationMs}ms steps(${steps}, end) ${delay}ms 1 both
          ${withBlink ? `, ${caretBlink} 1s step-end infinite ${delay + durationMs}ms` : ""}
        `,
        ...sx,
      }}
    >
      {text}
    </Box>
  );
}

/* ---------- RotatingWords ---------- */
function RotatingWords({ words, delay = 0, slot = 900, gap = 150, fontSx = {} }) {
  const maxLen = Math.max(...words.map((w) => w.length));
  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-block",
        width: `${maxLen}ch`,
        height: "1em",
        verticalAlign: "baseline",
        perspective: "600px",
        ...fontSx,
      }}
    >
      {words.map((w, i) => {
        const isLast = i === words.length - 1;
        const kf = isLast ? flipInHold : flipInOut;
        const start = delay + i * (slot + gap);
        return (
          <Box
            key={w}
            component="span"
            sx={{
              position: "absolute",
              inset: 0,
              display: "inline-flex",
              alignItems: "baseline",
              justifyContent: "flex-start",
              backfaceVisibility: "hidden",
              animation: `${kf} ${slot}ms ${start}ms ease both`,
            }}
          >
            {w}
          </Box>
        );
      })}
    </Box>
  );
}

export default function Hero() {
  const theme = useTheme();

  // dark theme → dark icon, light theme → light icon (your naming)
  const logoSrc =
    theme.palette.mode === "dark"
      ? "/backslash-icon-dark.png"
      : "/backslash-icon-light.png";

  const ROTATE_WORDS = [ "Media","Security", "Support", "Designs"];
  const TAGLINE = "Scalable | Reliable | Secure";

  /* ---- Timings (ms) ---- */
  const t0 = 300;
  const revealTextAt = t0 + 450;

  const backDelay = t0 + 700;
  const backSpeed = 75;
  const backDur = "Backslash".length * backSpeed;

  const rotateStart = backDelay + backDur + 120;
  const slot = 900;
  const gap = 150;
  const totalFlip = (ROTATE_WORDS.length - 1) * (slot + gap);
  const taglineStart = rotateStart + totalFlip + 200;
  const tagSpeed = 45;

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setOpen(true), revealTextAt);
    return () => clearTimeout(id);
  }, []);

  // After all animations complete, fade background from Paper -> Secondary
  const [bgToSecondary, setBgToSecondary] = React.useState(false);
  React.useEffect(() => {
    // End of tagline typing = when to start fading background
    const endOfAnimationsMs = taglineStart + TAGLINE.length * tagSpeed;
    const id = setTimeout(() => setBgToSecondary(true), endOfAnimationsMs);
    return () => clearTimeout(id);
  }, [taglineStart, TAGLINE.length, tagSpeed]);

  return (
    <Box
      component="section"
      sx={{
        minHeight: { xs: "calc(100svh - 56px)", sm: "calc(100svh - 64px)" },
        display: "grid",
        placeItems: "center",
        px: 2,
        // Fade the hero backdrop from paper -> secondary once intro animations finish
        backgroundColor: bgToSecondary
          ? theme.palette.secondary.main
          : theme.palette.background.paper,
        transition: "background-color 1200ms ease",
      }}
    >
      <Box sx={{ width: "min(1200px, 100%)", mx: "auto" }}>
        {/* Row centered at all times */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, sm: 3, md: 5 },
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logoSrc}
            alt="Backslash logo"
            sx={{
              width: { xs: 180, sm: 260, md: 320 },
              height: "auto",
              userSelect: "none",
              animation: `${fadeIn} 700ms 40ms ease-out both`,
              flex: "0 0 auto",
            }}
          />

          {/* Text block (expands from 0 width) */}
          <Box
            sx={{
              overflow: "hidden",
              maxWidth: open ? 1000 : 0,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(6px)",
              transition: "max-width 600ms ease, opacity 380ms ease, transform 380ms ease",
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              {/* Line 1: Backslash (extra buffer to avoid italic clipping) */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 26, sm: 36, md: 80   },
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.015em",
                }}
              >
                <TypedText
                  text="Backslash"
                  delay={backDelay}
                  speed={backSpeed}
                  caret="none"
                  bufferCh={1.2} // <— extra space so last glyph never cuts off
                  sx={{ fontFamily: `"GoBold", system-ui, sans-serif`, fontStyle: "italic" }}
                />
              </Typography>

              {/* Line 2: rotating words */}
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 24, sm: 30, md: 40 },
                  fontWeight: 500,
                  mt: { xs: 0.25, sm: 0.5 },
                }}
              >
                <RotatingWords
                  words={ROTATE_WORDS}
                  delay={rotateStart}
                  slot={slot}
                  gap={gap}
                  fontSx={{
                    fontFamily: `"Hack", ui-monospace, SFMono-Regular, Menlo, monospace`,
                    fontStyle: "italic",
                  }}
                />
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tagline centered below */}
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 500, opacity: 0.9, mt: { xs: 2, sm: 3 } }}
        >
          <TypedText text={TAGLINE} delay={taglineStart} speed={tagSpeed} />
        </Typography>
      </Box>
    </Box>
  );
}
