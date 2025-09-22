import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { submitQuoteRequest, submitWaitlistEmail } from "../../components/QuoteRequestHandler.jsx";

const TICKET_URL = "https://backslashdesigns.ITClientPortal.com/"; // replace with your ticket system URL
const INTAKE_PAUSED = ["1", "true", "yes", "on"].includes(
  String(import.meta.env.VITE_PAUSE_INTAKE ?? "0").toLowerCase()
);

export default function Contact() {
    const [form, setForm] = React.useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        type: "",
        budget: "",
        message: "",
    });
    const [errors, setErrors] = React.useState({});
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMsg, setSnackMsg] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("success"); // NEW
    const [submitting, setSubmitting] = React.useState(false); // NEW

    // NEW: waitlist state
    const [waitlistEmail, setWaitlistEmail] = React.useState("");
    const [waitlistErr, setWaitlistErr] = React.useState("");
    const [waitSubmitting, setWaitSubmitting] = React.useState(false); // NEW

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (!form.name.trim()) er.name = "Name is required.";
        if (!form.email.trim()) er.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email.";
        if (!form.message.trim()) er.message = "Please describe your needs.";
        return er;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const er = validate();
        if (Object.keys(er).length) {
            setErrors(er);
            return;
        }

        try {
            setSubmitting(true);
            await submitQuoteRequest(form);
            setSnackSeverity("success");
            setSnackMsg("Thanks! We’ll be in touch shortly.");
            setSnackOpen(true);
            setForm({
                name: "",
                company: "",
                email: "",
                phone: "",
                type: "",
                budget: "",
                message: "",
            });
        } catch (err) {
            console.error("Quote request failed:", err);
            setSnackSeverity("error");
            setSnackMsg("Could not send your request. Please try again later.");
            setSnackOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

        // NEW: waitlist submit via n8n webhook
        const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(waitlistEmail)) {
            setWaitlistErr("Enter a valid email.");
            return;
        }
        try {
            setWaitSubmitting(true);
            await submitWaitlistEmail(waitlistEmail);
            setSnackSeverity("success");
            setSnackMsg("Thanks! We’ll notify you when we’re accepting new projects.");
            setSnackOpen(true);
            setWaitlistEmail("");
            setWaitlistErr("");
        } catch (err) {
            console.error("Waitlist signup failed:", err);
            setSnackSeverity("error");
            setSnackMsg("Could not join the waitlist. Please try again later.");
            setSnackOpen(true);
        } finally {
            setWaitSubmitting(false);
        }
    };

    return (
        <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Contact Us
            </Typography>

            {/* Existing customers — prominent ticket link */}
            <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                bgcolor: (t) => t.palette.action.hover,
                borderColor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"),
            }}
            >
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Existing customer?
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Open a support ticket and our team will assist you promptly.
                </Typography>
            </Box>
            <Button
                component="a"
                href={TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                size="large"
                sx={{ whiteSpace: "nowrap" }}
            >
                Open Support Ticket
            </Button>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* New customers — conditional intake */}
            {INTAKE_PAUSED ? (
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Currently at capacity
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                    We’re not taking on new work right now. Leave your email and we’ll reach out when intake reopens.
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleWaitlistSubmit}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
                        <TextField
                        type="email"
                        label="Email address"
                        value={waitlistEmail}
                        onChange={(e) => { setWaitlistEmail(e.target.value); setWaitlistErr(""); }}
                        error={!!waitlistErr}
                        helperText={waitlistErr}
                        required
                        sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}
                        autoComplete="email"
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }} disabled={waitSubmitting}>
                        {waitSubmitting ? "Submitting..." : "Notify Me"}
                        </Button>
                    </Stack>
                    </Box>
                </Paper>
            ) : (
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Request a Quote
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                    Tell us about your project and we’ll get back to you.
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                            autoComplete="name"
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            label="Company"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="organization"
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            required
                            autoComplete="email"
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="tel"
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            select
                            label="Project Type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            fullWidth
                            >
                            <MenuItem value="">Select…</MenuItem>
                            <MenuItem value="web">Web App / Website</MenuItem>
                            <MenuItem value="security">Security / Hardening</MenuItem>
                            <MenuItem value="automation">Automation / Integrations</MenuItem>
                            <MenuItem value="support">Ongoing Support</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                            select
                            label="Budget Range"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            fullWidth
                            >
                            <MenuItem value="">Select…</MenuItem>
                            <MenuItem value="lt5k">Under $5,000</MenuItem>
                            <MenuItem value="5k-15k">$5,000 – $15,000</MenuItem>
                            <MenuItem value="15k-50k">$15,000 – $50,000</MenuItem>
                            <MenuItem value="gt50k">Over $50,000</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item size={{ xs: 12 }}>
                            <TextField
                            label="Project Details"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            error={!!errors.message}
                            helperText={errors.message || "Share goals, timeline, and any constraints."}
                            fullWidth
                            required
                            multiline
                            minRows={4}
                            />
                        </Grid>
                        </Grid>

                        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }} alignItems="center">
                            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                                {submitting ? "Sending..." : "Request Quote"}
                            </Button>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                By submitting, you agree to be contacted about your request.
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            )}
        </Box>

        <Snackbar
            open={snackOpen}
            autoHideDuration={4000}
            onClose={() => setSnackOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} variant="filled" sx={{ width: "100%" }}>
                {snackMsg || "Thanks! We’ll be in touch shortly."}
            </Alert>
        </Snackbar>
        </Box>
    );
}
