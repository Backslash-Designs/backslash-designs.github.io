import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import ParticleBackground from "../../components/ParticleBackground";

export const values = [
    {
        title: "Scalable",
        description:
        "From day one, architectures are designed to handle growth—traffic bursts, data volume, and evolving features—without costly rework.",
        details: [
            "Modular boundaries and stateless services enable horizontal scaling with containers and serverless.",
            "Async workloads via queues and scheduled jobs prevent hotspots and keep latency predictable.",
            "Smart data patterns: read replicas, partitioning, caching layers, and CQRS where it pays off.",
            "Infra-as-code and autoscaling policies keep environments reproducible and cost-aware."
        ],
        Icon: QueryStatsIcon,
        href: "/about#scalable",
    },
    {
        title: "Reliable",
        description:
        "We build for uptime with redundancy, observability, and testing pipelines that keep changes safe and rollouts smooth.",
        details: [
            "Clear SLOs, health checks, and end-to-end tracing to detect and resolve issues fast.",
            "Defense-in-depth testing: unit, integration, contract, and smoke/e2e in CI.",
            "Progressive delivery: feature flags, canaries, and blue/green for safe rollouts.",
            "Resiliency patterns: retries with backoff, timeouts, idempotency, and circuit breakers."
        ],
        Icon: VerifiedIcon,
        href: "/about#reliable",
    },
    {
        title: "Secure",
        description:
        "Security is built-in: least-privilege access, encryption standards, and continuous hardening—not bolted on later.",
        details: [
            "Least-privilege IAM, scoped service accounts, and audited access paths.",
            "Encryption in transit (TLS) and at rest; robust secrets management and rotation.",
            "Shift-left: dependency scanning, SAST/DAST, and threat modeling in the SDLC.",
            "Continuous patching, hardening baselines, and proactive monitoring/alerting."
        ],
        Icon: SecurityIcon,
        href: "/about#secure",
    },
];

/**
 * ValuesSummary
 * @param {Object} props
 * @param {'paper'|'none'|'particles'} [props.bgStyle='paper'] - Background surface style for the section.
 */
export function ValuesSummary({ bgStyle = 'paper' }) {
    // bgStyle: 'paper' | 'none' | 'particles'
    const sectionRef = React.useRef(null);
    const isPaper = bgStyle === 'paper';
    const isParticles = bgStyle === 'particles';
    const Wrapper = isPaper ? Paper : Box;
    return (
        <Wrapper ref={sectionRef} component="section" sx={{ position: 'relative', minHeight: '50vh', overflow: 'hidden', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
            {isParticles && (
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <ParticleBackground fixed clipToRef={sectionRef} />
                </Box>
            )}
            <Box sx={{ maxWidth: 1100, width: "100%", mx: "auto", position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Our Values
                </Typography>
                <Grid container spacing={2} alignItems="stretch">
                    {values.map(({ title, description, details, Icon, href }) => (
                        <Grid key={title} item size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
                                <Stack spacing={1.25}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                display: "grid",
                                                placeItems: "center",
                                                bgcolor: (t) => t.palette.action.hover,
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {description}
                                    </Typography>
                                    <Box>
                                        <Button size="small" component="a" href={href}>
                                            Learn more
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Wrapper>
    );
}

// New: Detailed Values section (reused by About page)
export default function ValuesPage({summariesById }) {
    return (
        <>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            About Our Values
        </Typography>

        {values.map(({ title, details = [], Icon, href }) => {
            const id = (href && href.split("#")[1]) || title.toLowerCase().replace(/\s+/g, "-");
            const summary = summariesById?.[id];

            return (
            <Box key={title} id={id} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box
                    sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: (t) => t.palette.action.hover,
                    }}
                >
                    <Icon fontSize="small" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                </Box>

                {summary && (
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.95 }}>
                    {summary}
                </Typography>
                )}

                <Stack spacing={0.75}>
                {Array.isArray(details) ? (
                    details.map((p, i) => (
                    <Typography key={i} variant="body2" sx={{ opacity: 0.95 }}>
                        {p}
                    </Typography>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    {details}
                    </Typography>
                )}
                </Stack>
            </Box>
            );
        })}
        </>
    );
}
