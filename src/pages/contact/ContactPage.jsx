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
// CHANGED: use services/QuoteRequestService
import { submitQuoteRequest, submitWaitlistEmail } from "../../services/QuoteRequestService.jsx";
import { SERVICES } from "../services/ServicesPage.jsx";
import ReCAPTCHA from "react-google-recaptcha"; // + add reCAPTCHA
import Checkbox from "@mui/material/Checkbox"; // + new
import FormControlLabel from "@mui/material/FormControlLabel"; // + new

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
    acceptMarketing: true, // + new default ON
  });
  const [errors, setErrors] = React.useState({});
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState("success");
  const [submitting, setSubmitting] = React.useState(false);

  // Roll back waitlist to email-only
  const [waitlistEmail, setWaitlistEmail] = React.useState("");
  const [waitlistErr, setWaitlistErr] = React.useState("");
  const [waitSubmitting, setWaitSubmitting] = React.useState(false);
  const [waitlistName, setWaitlistName] = React.useState("");
  const [waitlistNameErr, setWaitlistNameErr] = React.useState("");
  const [waitlistAcceptMarketing, setWaitlistAcceptMarketing] = React.useState(true); // + new default ON

  // + reCAPTCHA state
  const [recaptchaToken, setRecaptchaToken] = React.useState("");
  const recaptchaRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? !!checked : value })); // + handle checkbox
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Name is required.";
    if (!form.email.trim()) er.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email.";
    if (!form.message.trim()) er.message = "Please describe your needs.";
    // + require reCAPTCHA for quote requests
    if (!recaptchaToken) er.recaptcha = "Please verify you're human.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    // + reCAPTCHA validation restored
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    try {
      setSubmitting(true);
      await submitQuoteRequest({ ...form, recaptchaToken }); // includes acceptMarketing
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
        acceptMarketing: true, // + reset to default ON
      });
      // + reset reCAPTCHA after successful submit
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
    } catch (err) {
      console.error("Quote request failed:", err);
      setSnackSeverity("error");
      setSnackMsg("Could not send your request. Please try again later.");
      setSnackOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Waitlist submit
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    // + validate name
    if (!waitlistName.trim()) {
      setWaitlistNameErr("Enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(waitlistEmail)) {
      setWaitlistErr("Enter a valid email.");
      return;
    }
    // require reCAPTCHA for waitlist as well
    if (!recaptchaToken) {
      setErrors((er) => ({ ...er, recaptcha: "Please verify you're human." }));
      return;
    }
    try {
      setWaitSubmitting(true);
      await submitWaitlistEmail({
        name: waitlistName,
        email: waitlistEmail,
        acceptMarketing: waitlistAcceptMarketing, // + include
        recaptchaToken,
      });
      setSnackSeverity("success");
      setSnackMsg("Thanks! We’ll notify you when we’re accepting new projects.");
      setSnackOpen(true);
      setWaitlistName("");
      setWaitlistNameErr("");
      setWaitlistEmail("");
      setWaitlistErr("");
      setWaitlistAcceptMarketing(true); // + reset to default ON
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
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
              {/* Fields first */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                <TextField
                  label="Full name"
                  value={waitlistName}
                  onChange={(e) => { setWaitlistName(e.target.value); setWaitlistNameErr(""); }}
                  error={!!waitlistNameErr}
                  helperText={waitlistNameErr}
                  required
                  sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}
                  autoComplete="name"
                />
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
              </Stack>

              {/* Marketing consent */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="waitlistAcceptMarketing"
                    checked={waitlistAcceptMarketing}
                    onChange={(e) => setWaitlistAcceptMarketing(e.target.checked)}
                  />
                }
                label="I agree to receive occasional updates about services and availability."
                sx={{ mb: 1.5 }}
              />

              {/* reCAPTCHA below fields */}
              <Box sx={{ mb: 1.5 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => {
                    setRecaptchaToken(token || "");
                    setErrors((er) => ({ ...er, recaptcha: undefined }));
                  }}
                  onExpired={() => setRecaptchaToken("")}
                />
                {!!errors.recaptcha && (
                  <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                    {errors.recaptcha}
                  </Typography>
                )}
              </Box>

              {/* Submit */}
              <Button type="submit" variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }} disabled={waitSubmitting}>
                {waitSubmitting ? "Submitting..." : "Notify Me"}
              </Button>
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
                    {/* Build options from SERVICES */}
                    {SERVICES.map(({ key, title }) => (
                      <MenuItem key={key} value={key}>
                        {title}
                      </MenuItem>
                    ))}
                    {/* Always include a catch‑all */}
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

              {/* Marketing consent */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="acceptMarketing"
                    checked={form.acceptMarketing}
                    onChange={handleChange}
                  />
                }
                label="I agree to receive occasional updates about services and availability."
                sx={{ mt: 1.5 }}
              />

              {/* reCAPTCHA widget */}
              <Box sx={{ mt: 1.5, mb: 0.5 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => {
                    setRecaptchaToken(token || "");
                    setErrors((er) => ({ ...er, recaptcha: undefined }));
                  }}
                  onExpired={() => setRecaptchaToken("")}
                />
                {!!errors.recaptcha && (
                  <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                    {errors.recaptcha}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }} alignItems="center">
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