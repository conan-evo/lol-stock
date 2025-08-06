# Mobile Stock Trading Platform - Features & APIs Specification

## 1. Authentication & Security

### 1.1 User Registration
- **Description**: Allow new users to create trading accounts
- **Required APIs**:
  - `POST /auth/register` - User registration with KYC documents
  - `POST /auth/verify-email` - Email verification
  - `POST /auth/verify-phone` - OTP verification for phone
  - `POST /kyc/upload-documents` - Upload PAN, Aadhaar, bank proof
  - `GET /kyc/status` - Check KYC verification status
- **Notes**: Requires integration with KYC providers, CKYC database

### 1.2 User Login
- **Description**: Secure user authentication with multi-factor support
- **Required APIs**:
  - `POST /auth/login` - Primary login with credentials
  - `POST /auth/mfa/send-otp` - Send OTP for 2FA
  - `POST /auth/mfa/verify-otp` - Verify OTP
  - `POST /auth/biometric-login` - Biometric authentication
  - `POST /auth/refresh-token` - Refresh JWT tokens
- **Notes**: Support for PIN, biometric, and OTP-based authentication

### 1.3 Session Management
- **Description**: Manage user sessions and security
- **Required APIs**:
  - `GET /auth/session/validate` - Validate current session
  - `POST /auth/logout` - Logout from current session
  - `POST /auth/logout-all` - Logout from all devices
  - `GET /auth/active-sessions` - List active sessions
  - `DELETE /auth/session/{sessionId}` - Terminate specific session

### 1.4 Password & Security Management
- **Description**: Handle password resets and security settings
- **Required APIs**:
  - `POST /auth/forgot-password` - Initiate password reset
  - `POST /auth/reset-password` - Reset password with token
  - `PUT /auth/change-password` - Change password
  - `PUT /auth/security-questions` - Set/update security questions
  - `GET /auth/login-history` - View login history and attempts

## 2. User Dashboard

### 2.1 Portfolio Overview
- **Description**: Main dashboard showing portfolio summary
- **Required APIs**:
  - `GET /dashboard/overview` - Overall portfolio summary
  - `GET /dashboard/pnl` - Profit & Loss summary
  - `GET /dashboard/allocation` - Asset allocation breakdown
  - `GET /dashboard/performance` - Portfolio performance metrics
- **Notes**: Real-time data updates required

### 2.2 Quick Actions
- **Description**: Shortcuts for common trading actions
- **Required APIs**:
  - `GET /dashboard/quick-buy` - Pre-configured buy orders
  - `GET /dashboard/quick-sell` - Pre-configured sell orders
  - `GET /dashboard/favorites` - User's favorite instruments
  - `PUT /dashboard/favorites` - Update favorite instruments

### 2.3 Market Summary
- **Description**: Market indices and key statistics
- **Required APIs**:
  - `GET /market/indices` - Major market indices (Nifty, Sensex)
  - `GET /market/movers` - Top gainers/losers
  - `GET /market/sector-performance` - Sector-wise performance
  - `GET /market/market-status` - Market open/close status
- **Notes**: Integration with NSE/BSE data feeds required

## 3. Market Watch & Instruments

### 3.1 Instrument Search & Discovery
- **Description**: Search and discover tradeable instruments
- **Required APIs**:
  - `GET /instruments/search` - Search stocks, ETFs, mutual funds
  - `GET /instruments/categories` - Browse by categories
  - `GET /instruments/trending` - Trending/popular instruments
  - `GET /instruments/similar` - Similar instruments suggestions
  - `GET /instruments/details/{symbol}` - Detailed instrument information

### 3.2 Real-time Price Data
- **Description**: Live market data and price updates
- **Required APIs**:
  - `GET /market-data/live/{symbol}` - Real-time price data
  - `GET /market-data/depth/{symbol}` - Market depth (L2 data)
  - `GET /market-data/trades/{symbol}` - Recent trades
  - `WebSocket /ws/market-data` - Real-time price updates
- **Notes**: Requires NSE/BSE market data subscription

### 3.3 Watchlist Management
- **Description**: Personal watchlists for tracking instruments
- **Required APIs**:
  - `GET /watchlist` - Get user's watchlists
  - `POST /watchlist` - Create new watchlist
  - `PUT /watchlist/{id}` - Update watchlist
  - `DELETE /watchlist/{id}` - Delete watchlist
  - `POST /watchlist/{id}/instruments` - Add instruments to watchlist
  - `DELETE /watchlist/{id}/instruments/{symbol}` - Remove from watchlist

### 3.4 Market Calendar & Events
- **Description**: Important market events and announcements
- **Required APIs**:
  - `GET /market/calendar` - Market calendar with holidays
  - `GET /market/events` - Corporate actions, earnings, dividends
  - `GET /market/announcements` - Exchange announcements
  - `GET /instruments/{symbol}/events` - Instrument-specific events

## 4. Order Placement & Management

### 4.1 Order Placement
- **Description**: Place various types of trading orders
- **Required APIs**:
  - `POST /orders/place` - Place market/limit/stop-loss orders
  - `POST /orders/bracket` - Place bracket orders
  - `POST /orders/cover` - Place cover orders
  - `GET /orders/preview` - Preview order before placement
  - `POST /orders/basket` - Place multiple orders (basket orders)

### 4.2 Order Management
- **Description**: View and manage existing orders
- **Required APIs**:
  - `GET /orders` - List all orders (pending/executed/cancelled)
  - `GET /orders/{orderId}` - Get specific order details
  - `PUT /orders/{orderId}/modify` - Modify pending orders
  - `DELETE /orders/{orderId}` - Cancel pending orders
  - `POST /orders/cancel-all` - Cancel all pending orders

### 4.3 Order Validation & Checks
- **Description**: Pre-order validation and risk checks
- **Required APIs**:
  - `POST /orders/validate` - Validate order parameters
  - `GET /orders/margin-required` - Calculate margin requirements
  - `GET /orders/exposure-check` - Check position exposure limits
  - `GET /orders/buying-power` - Available buying power

### 4.4 Trade Execution & Confirmations
- **Description**: Trade execution updates and confirmations
- **Required APIs**:
  - `GET /trades` - List executed trades
  - `GET /trades/{tradeId}` - Get trade details
  - `WebSocket /ws/order-updates` - Real-time order status updates
  - `POST /trades/confirm` - Confirm trade execution

## 5. Portfolio & Holdings

### 5.1 Holdings Management
- **Description**: View and manage current holdings
- **Required APIs**:
  - `GET /portfolio/holdings` - Current equity holdings
  - `GET /portfolio/positions` - Intraday positions
  - `GET /portfolio/holdings/{symbol}` - Specific holding details
  - `GET /portfolio/analytics` - Portfolio analytics and metrics

### 5.2 Profit & Loss Tracking
- **Description**: Track P&L across different timeframes
- **Required APIs**:
  - `GET /portfolio/pnl/daily` - Daily P&L
  - `GET /portfolio/pnl/realized` - Realized P&L
  - `GET /portfolio/pnl/unrealized` - Unrealized P&L
  - `GET /portfolio/pnl/history` - Historical P&L data
  - `GET /portfolio/pnl/tax-report` - Tax reporting data

### 5.3 Asset Allocation
- **Description**: Portfolio diversification and allocation analysis
- **Required APIs**:
  - `GET /portfolio/allocation/sector` - Sector-wise allocation
  - `GET /portfolio/allocation/market-cap` - Market cap allocation
  - `GET /portfolio/allocation/asset-class` - Asset class breakdown
  - `GET /portfolio/rebalancing-suggestions` - Rebalancing recommendations

### 5.4 Performance Analytics
- **Description**: Portfolio performance metrics and benchmarking
- **Required APIs**:
  - `GET /portfolio/performance/returns` - Portfolio returns analysis
  - `GET /portfolio/performance/benchmark` - Benchmark comparison
  - `GET /portfolio/performance/risk-metrics` - Risk metrics (beta, volatility)
  - `GET /portfolio/performance/attribution` - Performance attribution

## 6. Funds Management

### 6.1 Account Balance & Margins
- **Description**: Manage trading account funds and margins
- **Required APIs**:
  - `GET /funds/balance` - Available cash balance
  - `GET /funds/margin/available` - Available margin
  - `GET /funds/margin/used` - Used margin breakdown
  - `GET /funds/margin/requirements` - Margin requirements by segment
  - `GET /funds/exposure` - Position exposure limits

### 6.2 Money Transfer
- **Description**: Add/withdraw funds from trading account
- **Required APIs**:
  - `POST /funds/add` - Add funds to account
  - `POST /funds/withdraw` - Withdraw funds
  - `GET /funds/bank-accounts` - Linked bank accounts
  - `POST /funds/bank-accounts` - Add new bank account
  - `GET /funds/transfer-history` - Fund transfer history
- **Notes**: Integration with payment gateways and banks required

### 6.3 Instant Settlement
- **Description**: Instant settlement and T+0 trading features
- **Required APIs**:
  - `GET /funds/instant-settlement/eligibility` - Check eligibility
  - `POST /funds/instant-settlement/enable` - Enable instant settlement
  - `GET /funds/instant-settlement/charges` - Settlement charges
  - `GET /funds/settlement-calendar` - Settlement calendar

## 7. Charts & Analytics

### 7.1 Technical Charts
- **Description**: Interactive price charts with technical indicators
- **Required APIs**:
  - `GET /charts/historical/{symbol}` - Historical price data (OHLCV)
  - `GET /charts/intraday/{symbol}` - Intraday price data
  - `GET /charts/indicators/{symbol}` - Technical indicators data
  - `WebSocket /ws/chart-data/{symbol}` - Real-time chart updates
- **Notes**: Multiple timeframes (1m, 5m, 15m, 1h, 1d, etc.)

### 7.2 Technical Analysis Tools
- **Description**: Technical analysis indicators and drawing tools
- **Required APIs**:
  - `GET /analysis/indicators/list` - Available technical indicators
  - `POST /analysis/indicators/calculate` - Calculate custom indicators
  - `GET /analysis/patterns/{symbol}` - Chart pattern recognition
  - `GET /analysis/support-resistance/{symbol}` - Support/resistance levels

### 7.3 Fundamental Analysis
- **Description**: Company fundamentals and financial data
- **Required APIs**:
  - `GET /fundamentals/{symbol}/financials` - Financial statements
  - `GET /fundamentals/{symbol}/ratios` - Financial ratios
  - `GET /fundamentals/{symbol}/peer-comparison` - Peer comparison
  - `GET /fundamentals/{symbol}/analyst-ratings` - Analyst recommendations
- **Notes**: Integration with financial data providers required

### 7.4 Market Analytics
- **Description**: Market-wide analytics and insights
- **Required APIs**:
  - `GET /analytics/market-sentiment` - Market sentiment indicators
  - `GET /analytics/sector-rotation` - Sector rotation analysis
  - `GET /analytics/options-chain/{symbol}` - Options chain data
  - `GET /analytics/derivatives/overview` - Derivatives market overview

## 8. Notifications & Alerts

### 8.1 Price Alerts
- **Description**: Custom price-based alerts and notifications
- **Required APIs**:
  - `GET /alerts` - List user alerts
  - `POST /alerts/price` - Create price alerts
  - `PUT /alerts/{alertId}` - Update alert
  - `DELETE /alerts/{alertId}` - Delete alert
  - `POST /alerts/bulk-create` - Create multiple alerts

### 8.2 Order & Trade Notifications
- **Description**: Notifications for order updates and trade executions
- **Required APIs**:
  - `GET /notifications/orders` - Order-related notifications
  - `GET /notifications/trades` - Trade execution notifications
  - `POST /notifications/preferences` - Set notification preferences
  - `WebSocket /ws/notifications` - Real-time notifications

### 8.3 Market News & Updates
- **Description**: Market news and important updates
- **Required APIs**:
  - `GET /news/market` - General market news
  - `GET /news/{symbol}` - Instrument-specific news
  - `GET /news/categories` - News by categories
  - `POST /news/preferences` - News preferences
- **Notes**: Integration with news providers required

### 8.4 System & Account Notifications
- **Description**: System maintenance and account-related notifications
- **Required APIs**:
  - `GET /notifications/system` - System announcements
  - `GET /notifications/account` - Account-related notifications
  - `PUT /notifications/mark-read` - Mark notifications as read
  - `GET /notifications/settings` - Notification settings

## 9. User Settings & Preferences

### 9.1 Profile Management
- **Description**: User profile and personal information management
- **Required APIs**:
  - `GET /profile` - Get user profile
  - `PUT /profile` - Update profile information
  - `POST /profile/avatar` - Upload profile picture
  - `GET /profile/kyc-status` - KYC verification status
  - `POST /profile/update-contact` - Update contact information

### 9.2 Trading Preferences
- **Description**: Customize trading experience and preferences
- **Required APIs**:
  - `GET /preferences/trading` - Trading preferences
  - `PUT /preferences/trading` - Update trading preferences
  - `GET /preferences/order-defaults` - Default order settings
  - `PUT /preferences/order-defaults` - Update order defaults
  - `GET /preferences/risk-settings` - Risk management settings

### 9.3 App Settings
- **Description**: Application-specific settings and customization
- **Required APIs**:
  - `GET /settings/app` - App settings
  - `PUT /settings/app` - Update app settings
  - `GET /settings/themes` - Available themes
  - `PUT /settings/theme` - Set app theme
  - `GET /settings/language` - Language preferences

### 9.4 Security Settings
- **Description**: Account security and privacy settings
- **Required APIs**:
  - `GET /settings/security` - Security settings
  - `PUT /settings/two-factor` - Enable/disable 2FA
  - `GET /settings/connected-devices` - Connected devices
  - `DELETE /settings/device/{deviceId}` - Revoke device access
  - `PUT /settings/privacy` - Privacy preferences

## 10. Backend Admin & Compliance APIs

### 10.1 User Management (Admin)
- **Description**: Admin tools for user account management
- **Required APIs**:
  - `GET /admin/users` - List all users with filters
  - `GET /admin/users/{userId}` - Get specific user details
  - `PUT /admin/users/{userId}/status` - Update user status
  - `GET /admin/users/{userId}/activity` - User activity logs
  - `POST /admin/users/{userId}/freeze` - Freeze user account

### 10.2 Transaction Monitoring
- **Description**: Monitor transactions for compliance and risk
- **Required APIs**:
  - `GET /admin/transactions/suspicious` - Flagged transactions
  - `GET /admin/transactions/large` - Large value transactions
  - `POST /admin/transactions/{txnId}/flag` - Flag transaction
  - `GET /admin/reports/daily-trading` - Daily trading reports
  - `GET /admin/reports/compliance` - Compliance reports

### 10.3 Risk Management
- **Description**: System-wide risk management and controls
- **Required APIs**:
  - `GET /admin/risk/exposure` - System exposure limits
  - `PUT /admin/risk/limits` - Update risk limits
  - `GET /admin/risk/violations` - Risk limit violations
  - `POST /admin/risk/circuit-breaker` - Trigger circuit breakers
  - `GET /admin/risk/var-analysis` - Value at Risk analysis

### 10.4 Audit & Compliance
- **Description**: Audit trails and regulatory compliance
- **Required APIs**:
  - `GET /admin/audit/user-actions` - User action audit logs
  - `GET /admin/audit/system-events` - System event logs
  - `GET /admin/compliance/kyc-pending` - Pending KYC verifications
  - `POST /admin/compliance/generate-report` - Generate compliance reports
  - `GET /admin/compliance/regulatory-filings` - Regulatory filing status

### 10.5 System Administration
- **Description**: System configuration and maintenance
- **Required APIs**:
  - `GET /admin/system/health` - System health monitoring
  - `GET /admin/system/performance` - Performance metrics
  - `POST /admin/system/maintenance` - Schedule maintenance
  - `GET /admin/system/configurations` - System configurations
  - `PUT /admin/system/feature-flags` - Update feature flags

## Additional Technical Considerations

### Real-time Data Requirements
- WebSocket connections for live price feeds
- Push notifications for mobile devices
- Real-time order status updates
- Live portfolio value updates

### Third-party Integrations
- **NSE/BSE**: Market data feeds, order routing
- **Payment Gateways**: Fund transfers, UPI integration
- **KYC Providers**: Document verification, CKYC integration
- **News Providers**: Market news and analysis
- **SMS/Email**: OTP and notification services

### Compliance & Security
- End-to-end encryption for sensitive data
- Audit logging for all user actions
- Risk management and position limits
- Regulatory reporting capabilities
- SEBI compliance requirements

### Performance & Scalability
- High-frequency trading support
- Low-latency order execution
- Horizontal scaling capabilities
- Caching strategies for market data
- Load balancing for peak trading hours