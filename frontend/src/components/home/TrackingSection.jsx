import {
  Container,
  Typography,
  Box,
} from "@mui/material";

export default function TrackingSection() {
  return (
    <Box sx={{ bgcolor: "#F4F6F8", py: 10 }}>
      <Container>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Tracking en Tiempo Real
        </Typography>

        <Typography mt={2}>
          Sigue la ubicación de tu bus
          desde cualquier dispositivo.
        </Typography>
      </Container>
    </Box>
  );
}