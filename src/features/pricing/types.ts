export interface ResolvedPrice {
  /** Price in the requested display currency */
  amount: number
  currency: string
  /** The base price in the product's base currency */
  base_amount: number
  base_currency: string
  /** Exchange rate used (1.0 when same currency or manual override was used) */
  exchange_rate: number
  /** True if the price came from a manual admin override */
  is_override: boolean
  /** True if the rate was fetched from cache (always true in our architecture) */
  is_cached_rate: boolean
}

export interface PriceSnapshot {
  product_id: string
  product_title: string
  product_summary: string | null
  cover_image_url: string | null
  base_price: number
  base_currency: string
  display_price: number
  display_currency: string
  exchange_rate: number
  override_used: boolean
  snapshotted_at: string
}

export interface ExchangeRatesMap {
  [currency: string]: number
}

export interface CurrencyOption {
  code: string
  label: string
  symbol: string
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'MUR', label: 'Mauritian Rupee', symbol: 'Rs' },
]

export const DEFAULT_CURRENCY = 'EUR'
