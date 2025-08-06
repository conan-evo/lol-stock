import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../store/AuthContext';
import MarketService from '../services/marketService';
import { Portfolio, MarketIndex, Stock } from '../types';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [popularStocks, setPopularStocks] = useState<Stock[]>([]);
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; nextOpen?: string; nextClose?: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { state } = useAuth();

  useEffect(() => {
    loadDashboardData();
    MarketService.startRealTimeUpdates();

    return () => {
      MarketService.stopRealTimeUpdates();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [portfolioRes, indicesRes, stocksRes, statusRes] = await Promise.all([
        MarketService.getPortfolio(state.user?.id || '1'),
        MarketService.getMarketIndices(),
        MarketService.getPopularStocks(),
        MarketService.getMarketStatus(),
      ]);

      if (portfolioRes.success) setPortfolio(portfolioRes.data);
      if (indicesRes.success) setIndices(indicesRes.data);
      if (stocksRes.success) setPopularStocks(stocksRes.data);
      if (statusRes.success) setMarketStatus(statusRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? '#00d4aa' : '#ff6b6b';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="trending-up" size={50} color="#00d4aa" />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
            <Text style={styles.userName}>{state.user?.firstName} {state.user?.lastName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Market Status */}
        {marketStatus && (
          <View style={styles.marketStatusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: marketStatus.isOpen ? '#00d4aa' : '#ff6b6b' }]} />
            <Text style={styles.marketStatusText}>
              Market is {marketStatus.isOpen ? 'Open' : 'Closed'}
              {!marketStatus.isOpen && marketStatus.nextOpen && ` • Opens ${marketStatus.nextOpen}`}
              {marketStatus.isOpen && marketStatus.nextClose && ` • Closes ${marketStatus.nextClose}`}
            </Text>
          </View>
        )}

        {/* Portfolio Overview */}
        {portfolio && (
          <LinearGradient
            colors={['#1e3c72', '#2a5298']}
            style={styles.portfolioCard}
          >
            <Text style={styles.portfolioTitle}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>{formatCurrency(portfolio.totalValue)}</Text>
            <View style={styles.portfolioStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getChangeColor(portfolio.dayChange) }]}>
                  {formatCurrency(portfolio.dayChange)}
                </Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getChangeColor(portfolio.totalReturn) }]}>
                  {formatCurrency(portfolio.totalReturn)}
                </Text>
                <Text style={styles.statLabel}>Total Return</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getChangeColor(portfolio.totalReturnPercent) }]}>
                  {formatPercent(portfolio.totalReturnPercent)}
                </Text>
                <Text style={styles.statLabel}>Return %</Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trending-up" size={24} color="#00d4aa" />
              <Text style={styles.actionText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trending-down" size={24} color="#ff6b6b" />
              <Text style={styles.actionText}>Sell</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="wallet-outline" size={24} color="#00d4aa" />
              <Text style={styles.actionText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="search-outline" size={24} color="#00d4aa" />
              <Text style={styles.actionText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Indices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <View style={styles.indicesContainer}>
            {indices.map((index) => (
              <View key={index.symbol} style={styles.indexCard}>
                <Text style={styles.indexName}>{index.name}</Text>
                <Text style={styles.indexValue}>{index.value.toLocaleString()}</Text>
                <View style={styles.indexChange}>
                  <Ionicons
                    name={index.change >= 0 ? "trending-up" : "trending-down"}
                    size={16}
                    color={getChangeColor(index.change)}
                  />
                  <Text style={[styles.indexChangeText, { color: getChangeColor(index.change) }]}>
                    {formatPercent(index.changePercent)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Popular Stocks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stocks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stocksList}>
            {popularStocks.slice(0, 6).map((stock) => (
              <TouchableOpacity key={stock.symbol} style={styles.stockCard}>
                <View style={styles.stockInfo}>
                  <View style={styles.stockLogo}>
                    <Text style={styles.stockLogoText}>{stock.logo}</Text>
                  </View>
                  <View>
                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                    <Text style={styles.stockName} numberOfLines={1}>{stock.name}</Text>
                  </View>
                </View>
                <View style={styles.stockPrice}>
                  <Text style={styles.stockPriceText}>{formatCurrency(stock.price)}</Text>
                  <View style={styles.stockChange}>
                    <Ionicons
                      name={stock.change >= 0 ? "trending-up" : "trending-down"}
                      size={12}
                      color={getChangeColor(stock.change)}
                    />
                    <Text style={[styles.stockChangeText, { color: getChangeColor(stock.change) }]}>
                      {formatPercent(stock.changePercent)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Holdings */}
        {portfolio && portfolio.holdings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Holdings</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View Portfolio</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.holdingsList}>
              {portfolio.holdings.map((holding) => (
                <View key={holding.symbol} style={styles.holdingCard}>
                  <View style={styles.holdingInfo}>
                    <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                    <Text style={styles.holdingShares}>{holding.shares} shares</Text>
                  </View>
                  <View style={styles.holdingValues}>
                    <Text style={styles.holdingValue}>{formatCurrency(holding.marketValue)}</Text>
                    <Text style={[styles.holdingReturn, { color: getChangeColor(holding.totalReturn) }]}>
                      {formatPercent(holding.totalReturnPercent)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    color: '#8e8e93',
    fontSize: 16,
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  marketStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  marketStatusText: {
    color: '#8e8e93',
    fontSize: 14,
  },
  portfolioCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  portfolioTitle: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.8,
  },
  portfolioValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#00d4aa',
    fontSize: 14,
    fontWeight: '500',
  },
  indicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indexCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 3,
    alignItems: 'center',
  },
  indexName: {
    color: '#8e8e93',
    fontSize: 12,
    marginBottom: 4,
  },
  indexValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  indexChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  stocksList: {
    gap: 12,
  },
  stockCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stockLogoText: {
    fontSize: 18,
  },
  stockSymbol: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockName: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  stockPriceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  stockChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stockChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  holdingsList: {
    gap: 12,
  },
  holdingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingSymbol: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  holdingShares: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  holdingReturn: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 100,
  },
});