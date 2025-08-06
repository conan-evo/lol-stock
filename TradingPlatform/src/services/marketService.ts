import { Stock, Quote, MarketIndex, Portfolio, Holding, ApiResponse } from '../types';

// Mock stock data for demonstration
const MOCK_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.87,
    changePercent: 1.66,
    volume: 45678903,
    marketCap: 2750000000000,
    pe: 28.5,
    high52w: 198.23,
    low52w: 124.17,
    logo: '🍎',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.45,
    changePercent: -1.04,
    volume: 23456789,
    marketCap: 1740000000000,
    pe: 25.2,
    high52w: 151.55,
    low52w: 83.34,
    logo: '🔍',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    volume: 34567890,
    marketCap: 2810000000000,
    pe: 32.1,
    high52w: 384.30,
    low52w: 213.43,
    logo: '💻',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.42,
    change: -8.33,
    changePercent: -3.24,
    volume: 67890123,
    marketCap: 789000000000,
    pe: 65.8,
    high52w: 299.29,
    low52w: 101.81,
    logo: '🚗',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 151.94,
    change: 1.87,
    changePercent: 1.25,
    volume: 56789012,
    marketCap: 1560000000000,
    pe: 45.3,
    high52w: 170.00,
    low52w: 81.43,
    logo: '📦',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 23.45,
    changePercent: 2.75,
    volume: 78901234,
    marketCap: 2160000000000,
    pe: 68.4,
    high52w: 974.00,
    low52w: 180.96,
    logo: '🔧',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 484.20,
    change: -5.67,
    changePercent: -1.16,
    volume: 45678901,
    marketCap: 1230000000000,
    pe: 24.8,
    high52w: 531.49,
    low52w: 88.09,
    logo: '📱',
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    price: 489.33,
    change: 8.91,
    changePercent: 1.85,
    volume: 12345678,
    marketCap: 217000000000,
    pe: 34.2,
    high52w: 700.99,
    low52w: 162.71,
    logo: '📺',
  },
];

const MOCK_INDICES: MarketIndex[] = [
  {
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4567.23,
    change: 12.45,
    changePercent: 0.27,
  },
  {
    name: 'NASDAQ',
    symbol: 'IXIC',
    value: 14234.56,
    change: -23.12,
    changePercent: -0.16,
  },
  {
    name: 'Dow Jones',
    symbol: 'DJI',
    value: 34567.89,
    change: 89.34,
    changePercent: 0.26,
  },
];

class MarketService {
  private static instance: MarketService;
  private stocks: Stock[] = [...MOCK_STOCKS];
  private indices: MarketIndex[] = [...MOCK_INDICES];
  private updateInterval: NodeJS.Timeout | null = null;

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  // Start real-time price updates simulation
  startRealTimeUpdates(): void {
    if (this.updateInterval) return;

    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, 3000); // Update every 3 seconds
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updatePrices(): void {
    // Simulate price changes
    this.stocks = this.stocks.map(stock => {
      const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5% change
      const newPrice = stock.price * (1 + changePercent);
      const priceChange = newPrice - stock.price;

      return {
        ...stock,
        price: Number(newPrice.toFixed(2)),
        change: Number(priceChange.toFixed(2)),
        changePercent: Number((changePercent * 100).toFixed(2)),
        volume: stock.volume + Math.floor(Math.random() * 1000000),
      };
    });

    // Update indices
    this.indices = this.indices.map(index => {
      const changePercent = (Math.random() - 0.5) * 0.02; // -1% to +1% change
      const newValue = index.value * (1 + changePercent);
      const valueChange = newValue - index.value;

      return {
        ...index,
        value: Number(newValue.toFixed(2)),
        change: Number(valueChange.toFixed(2)),
        changePercent: Number((changePercent * 100).toFixed(2)),
      };
    });
  }

  async getQuote(symbol: string): Promise<ApiResponse<Quote>> {
    try {
      const stock = this.stocks.find(s => s.symbol === symbol);
      if (!stock) {
        return {
          success: false,
          data: {} as Quote,
          message: 'Stock not found',
        };
      }

      const quote: Quote = {
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        high: stock.price * 1.02,
        low: stock.price * 0.98,
        open: stock.price - stock.change,
        previousClose: stock.price - stock.change,
        timestamp: new Date().toISOString(),
      };

      return {
        success: true,
        data: quote,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Quote,
        message: 'Failed to fetch quote',
      };
    }
  }

  async getQuotes(symbols: string[]): Promise<ApiResponse<Quote[]>> {
    try {
      const quotes: Quote[] = [];
      
      for (const symbol of symbols) {
        const response = await this.getQuote(symbol);
        if (response.success) {
          quotes.push(response.data);
        }
      }

      return {
        success: true,
        data: quotes,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch quotes',
      };
    }
  }

  async getPopularStocks(): Promise<ApiResponse<Stock[]>> {
    try {
      // Return top 8 stocks by market cap
      const popularStocks = [...this.stocks]
        .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
        .slice(0, 8);

      return {
        success: true,
        data: popularStocks,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch popular stocks',
      };
    }
  }

  async getMarketIndices(): Promise<ApiResponse<MarketIndex[]>> {
    try {
      return {
        success: true,
        data: [...this.indices],
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch market indices',
      };
    }
  }

  async searchStocks(query: string): Promise<ApiResponse<Stock[]>> {
    try {
      const filteredStocks = this.stocks.filter(
        stock =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filteredStocks,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed',
      };
    }
  }

  async getStockDetails(symbol: string): Promise<ApiResponse<Stock>> {
    try {
      const stock = this.stocks.find(s => s.symbol === symbol);
      if (!stock) {
        return {
          success: false,
          data: {} as Stock,
          message: 'Stock not found',
        };
      }

      return {
        success: true,
        data: stock,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Stock,
        message: 'Failed to fetch stock details',
      };
    }
  }

  // Mock portfolio data
  async getPortfolio(userId: string): Promise<ApiResponse<Portfolio>> {
    try {
      const holdings: Holding[] = [
        {
          symbol: 'AAPL',
          shares: 50,
          averageCost: 150.00,
          currentPrice: 175.43,
          marketValue: 8771.50,
          totalReturn: 1271.50,
          totalReturnPercent: 16.95,
          dayChange: 143.50,
          dayChangePercent: 1.66,
        },
        {
          symbol: 'MSFT',
          shares: 25,
          averageCost: 320.00,
          currentPrice: 378.85,
          marketValue: 9471.25,
          totalReturn: 1471.25,
          totalReturnPercent: 18.39,
          dayChange: 103.00,
          dayChangePercent: 1.10,
        },
        {
          symbol: 'GOOGL',
          shares: 30,
          averageCost: 145.00,
          currentPrice: 138.21,
          marketValue: 4146.30,
          totalReturn: -203.70,
          totalReturnPercent: -4.69,
          dayChange: -43.50,
          dayChangePercent: -1.04,
        },
      ];

      const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0) + 5000; // + cash
      const totalReturn = holdings.reduce((sum, holding) => sum + holding.totalReturn, 0);
      const dayChange = holdings.reduce((sum, holding) => sum + holding.dayChange, 0);

      const portfolio: Portfolio = {
        totalValue,
        totalReturn,
        totalReturnPercent: (totalReturn / (totalValue - totalReturn)) * 100,
        dayChange,
        dayChangePercent: (dayChange / (totalValue - dayChange)) * 100,
        cashBalance: 5000,
        holdings,
        diversification: {
          sectors: {
            'Technology': 85.4,
            'Consumer Discretionary': 14.6,
          },
          assetTypes: {
            'Stocks': 77.2,
            'Cash': 22.8,
          },
        },
      };

      return {
        success: true,
        data: portfolio,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Portfolio,
        message: 'Failed to fetch portfolio',
      };
    }
  }

  // Market status
  async getMarketStatus(): Promise<ApiResponse<{ isOpen: boolean; nextOpen?: string; nextClose?: string }>> {
    try {
      const now = new Date();
      const hour = now.getHours();
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
      const isOpen = isWeekday && hour >= 9 && hour < 16; // 9 AM to 4 PM

      return {
        success: true,
        data: {
          isOpen,
          nextOpen: isOpen ? undefined : 'Tomorrow 9:30 AM EST',
          nextClose: isOpen ? 'Today 4:00 PM EST' : undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: { isOpen: false },
        message: 'Failed to fetch market status',
      };
    }
  }
}

export default MarketService.getInstance();