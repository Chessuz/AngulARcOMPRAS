import { formatCurrency } from "@angular/common";

export class Item {
    Id: number;
    idCompra: number;
    Corredor: number;
    Produto: string;
    Valor: number;
    Quantidade: number;
    ValorTotal: number;

    ValorTotalFormatado(): string {
        return formatCurrency(this.ValorTotal, "BRL", "R$");
    }
}
