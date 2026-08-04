import { Container, CircularProgress } from "@mui/material";

/**
 * Spinner centralizado exibido enquanto uma lista carrega.
 */
export function LoadingState() {
    return (
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
        </Container>
    );
}