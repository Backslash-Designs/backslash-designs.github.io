import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";

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
  bufferCh = 0.8,
  sx = {},
  animate = true, // NEW: allow disabling animation
}) {
  const steps = Math.max(1, text.length);
  const durationMs = steps * speed;
  const withBlink = caret === "blink" && animate;
  const showCaret = animate && caret !== "none";

  // final width = characters + buffer
  const finalWidth = `calc(${steps}ch + ${bufferCh}ch)`;

  return (
    <Box
      component="span"
      sx={{
        "--tw": finalWidth,
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        width: finalWidth,
        borderRight: showCaret ? "2px solid currentColor" : "none",
        paddingRight: showCaret ? 0 : "0.2ch",
        animation: animate
          ? `
            ${typing} ${durationMs}ms steps(${steps}, end) ${delay}ms 1 both
            ${withBlink ? `, ${caretBlink} 1s step-end infinite ${delay + durationMs}ms` : ""}
          `
          : "none",
        ...sx,
      }}
    >
      {text}
    </Box>
  );
}

/* ---------- RotatingWords ---------- */
function RotatingWords({ words, delay = 0, slot = 900, gap = 150, fontSx = {}, animate = true }) {
  const maxLen = Math.max(...words.map((w) => w.length));

  // NEW: if not animating, just show the final word (e.g., "Designs")
  if (!animate) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: `${maxLen}ch`,
          height: "1em",
          verticalAlign: "baseline",
          ...fontSx,
        }}
      >
        {words[words.length - 1]}
      </Box>
    );
  }

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

  // NEW: TTL to suppress re-playing intro if recently viewed
  const INTRO_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const [skipIntro] = React.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const t = Number(localStorage.getItem("heroIntroPlayedAt"));
      return Number.isFinite(t) && Date.now() - t < INTRO_TTL_MS;
    } catch {
      return false;
    }
  });

  const [open, setOpen] = React.useState(skipIntro); // start opened if skipping
  React.useEffect(() => {
    if (skipIntro) return;
    const id = setTimeout(() => setOpen(true), revealTextAt);
    return () => clearTimeout(id);
  }, [skipIntro, revealTextAt]);

  // After all animations complete, fade background from Paper -> Secondary
  const [bgToSecondary, setBgToSecondary] = React.useState(skipIntro); // start final bg if skipping
  React.useEffect(() => {
    if (skipIntro) return;
    // End of tagline typing = when to start fading background
    const endOfAnimationsMs = taglineStart + TAGLINE.length * tagSpeed;
    const id = setTimeout(() => {
      setBgToSecondary(true);
      // persist completion timestamp
      try {
        localStorage.setItem("heroIntroPlayedAt", String(Date.now()));
      } catch {}
    }, endOfAnimationsMs);
    return () => clearTimeout(id);
  }, [skipIntro, taglineStart, TAGLINE.length, tagSpeed]);

  return (
    <Paper
      component="section"
      sx={{
        // Shrink to half height when animations are done
        minHeight: {
          xs: bgToSecondary ? "calc((100svh - 56px) / 2)" : "calc(100svh - 56px)",
          sm: bgToSecondary ? "calc((100svh - 64px) / 2)" : "calc(100svh - 64px)",
        },
        display: "grid",
        placeItems: "center",
        px: 2,
        backgroundColor: bgToSecondary
          ? theme.palette.secondary.main
          : theme.palette.background.paper,
        transition: "background-color 1200ms ease, min-height 700ms ease",
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
              animation: skipIntro ? "none" : `${fadeIn} 700ms 40ms ease-out both`, // NEW
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
              {/* Line 1: Backslash */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 26, sm: 36, md: 80 },
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
                  bufferCh={1.2}
                  animate={!skipIntro} // NEW
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
                  animate={!skipIntro} // NEW
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
          <TypedText text={TAGLINE} delay={taglineStart} speed={tagSpeed} animate={!skipIntro} />
        </Typography>
      </Box>
    </Paper>
  );
}
