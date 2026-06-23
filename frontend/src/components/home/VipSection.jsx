import {
  Container,
  Typography,
  Box,
} from "@mui/material";

export default function VipSection() {
  return (
    <Box sx={{ bgcolor: "#F4F6F8", py: 10 }}>
      <Container>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Experiencia VIP
        </Typography>

        <Typography mt={2}>
          Asientos reclinables, WiFi,
          entretenimiento y atención premium.
        </Typography>
      </Container>
    </Box>
  );
}