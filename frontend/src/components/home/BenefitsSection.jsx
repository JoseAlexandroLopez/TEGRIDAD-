import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const benefits = [
  "Reservas Online",
  "Seguimiento en Tiempo Real",
  "TegriPuntos",
  "Boletos Digitales",
];

export default function BenefitsSection() {
  return (
    <Container sx={{ py: 10 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        mb={5}
      >
        Beneficios
      </Typography>

      <Grid container spacing={4}>
        {benefits.map((item) => (
          <Grid item xs={12} md={3} key={item}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
              }}
            >
              <Typography fontWeight={600}>
                {item}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}