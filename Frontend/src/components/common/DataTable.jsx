import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

/**
 * Tabela genérica dirigida por configuração de colunas.
 * Substitui as tabelas quase idênticas de ListaUsuarios, ListaSalas e ListaReservas.
 *
 * @param {Array<{key: string, label: string, render?: (row) => any}>} columns
 * @param {Array<object>} rows - cada linha precisa ter um campo `id`
 * @param {string} [emptyMessage]
 */
export function DataTable({ columns, rows, emptyMessage = "Nenhum item encontrado." }) {
    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={col.key}><strong>{col.label}</strong></TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}