/**
 * Remove qualquer informação de fuso horário ou hora de uma string de data.
 * Garante que a data seja salva sempre à meia-noite (00:00:00) em UTC,
 * evitando bugs onde a data volta 1 dia no banco devido ao timezone.
 */
export function normalizarData(data) {
    const dateStr = typeof data === "string" ? data.split("T")[0] : data.toISOString().split("T")[0];
    return new Date(`${dateStr}T00:00:00.000Z`);
}
