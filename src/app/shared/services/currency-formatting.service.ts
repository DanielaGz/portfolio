import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyFormattingService {
  private currencyConfigs: { [key: string]: { decimals: number; symbol: string; symbolPosition: 'before' | 'after' } } = {
    'COP': { decimals: 0, symbol: '$', symbolPosition: 'before' },
    'USD': { decimals: 2, symbol: '$', symbolPosition: 'before' },
    'EUR': { decimals: 2, symbol: '€', symbolPosition: 'after' },
    'GBP': { decimals: 2, symbol: '£', symbolPosition: 'before' }
  };

  constructor() {}

  formatAmount(amount: number, currency: string = 'COP'): string {
    const config = this.currencyConfigs[currency] || this.currencyConfigs['COP'];
    
    // Format with thousand separators and appropriate decimals
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    });

    // Add currency symbol
    if (config.symbolPosition === 'before') {
      return `${config.symbol}${formatted}`;
    } else {
      return `${formatted}${config.symbol}`;
    }
  }

  formatAmountWithDecimals(amount: number, currency: string = 'COP', decimals?: number): string {
    const config = this.currencyConfigs[currency] || this.currencyConfigs['COP'];
    const finalDecimals = decimals !== undefined ? decimals : config.decimals;
    
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals
    });

    if (config.symbolPosition === 'before') {
      return `${config.symbol}${formatted}`;
    } else {
      return `${formatted}${config.symbol}`;
    }
  }

  getCurrencySymbol(currency: string): string {
    return this.currencyConfigs[currency]?.symbol || '$';
  }
}
