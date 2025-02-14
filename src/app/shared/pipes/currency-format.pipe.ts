import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
    transform(value: number | string): string {
        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        if (isNaN(value)) {
            return '';
        }
            // Handle values below 1000
            const formattedFixedValue = new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2, // Ensure two decimal places
                maximumFractionDigits: 2
            }).format(value);

            return `R$ ${formattedFixedValue}`;
        
    }

}
