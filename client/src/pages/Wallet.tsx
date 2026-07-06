import { useEffect, useState, useMemo } from 'react';
import { Container, Typography, Box, Paper, Button, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, TablePagination, ToggleButtonGroup, ToggleButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useTransactionStore } from '../store/transactionStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

const Wallet = () => {
  const { user } = useAuthStore();
  const { balance, transactions, isLoading, fetchBalance, fetchTransactions, purchaseCoins } = useTransactionStore();
  const { showToast } = useToastStore();
  
  const [openTopup, setOpenTopup] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('credit_card');

  // Filtering & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const handleTopupSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      return showToast('Please enter a valid amount.', 'error');
    }
    try {
      await purchaseCoins(Number(amount), method);
      showToast(`Successfully added ${amount} SourceCoins to your wallet!`, 'success');
      setOpenTopup(false);
      setAmount('');
    } catch (error: any) {
      showToast(error.message || 'Failed to purchase coins', 'error');
    }
  };

  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.type.toLowerCase().includes(lowerQuery) || 
        tx.paymentMethod?.toLowerCase().includes(lowerQuery) ||
        tx.amount.toString().includes(lowerQuery)
      );
    }

    // Filter
    if (filterType !== 'all') {
      result = result.filter(tx => tx.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortOrder === 'highest') return b.amount - a.amount;
      if (sortOrder === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, filterType, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = page * rowsPerPage;
    return processedTransactions.slice(start, start + rowsPerPage);
  }, [processedTransactions, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
          Wallet Dashboard
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Balance Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, #1e1e1e 0%, #000000 100%)',
                color: 'white', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 280, 
                position: 'relative', 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Box sx={{ position: 'absolute', top: -30, right: -30, opacity: 0.05, transform: 'rotate(-15deg)' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 200 }} />
              </Box>
              <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 2, mb: 1, fontSize: '0.85rem' }}>
                Total Balance
              </Typography>
              <Typography variant="h2" fontWeight="900" sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 4 }}>
                {isLoading && balance === 0 ? <CircularProgress size={40} color="inherit" /> : balance.toLocaleString()} 
                <Typography component="span" variant="h5" sx={{ opacity: 0.7, fontWeight: 'medium' }}>SC</Typography>
              </Typography>
              
              <Button 
                variant="contained" 
                size="large"
                startIcon={<AddCardIcon />} 
                onClick={() => setOpenTopup(true)}
                fullWidth
                sx={{ 
                  bgcolor: 'white', 
                  color: 'black', 
                  '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)' }, 
                  transition: 'all 0.2s',
                  borderRadius: 3, 
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}
              >
                Top Up Wallet
              </Button>
            </Paper>
          </Box>
        </Grid>

        {/* Right Column: Transaction History */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #eaeaea', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #eaeaea', bgcolor: '#fafafa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ReceiptIcon color="primary" /> Transaction History
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                      sx: { borderRadius: 3, bgcolor: 'white' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <ToggleButtonGroup
                    value={filterType}
                    exclusive
                    onChange={(_e, val) => { if(val) { setFilterType(val); setPage(0); } }}
                    size="small"
                    fullWidth
                    sx={{ '& .MuiToggleButton-root': { borderRadius: 3, bgcolor: 'white' } }}
                  >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="purchase">In</ToggleButton>
                    <ToggleButton value="transfer">Out</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sortOrder}
                      onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}
                      sx={{ borderRadius: 3, bgcolor: 'white' }}
                      startAdornment={<InputAdornment position="start"><SortIcon color="action" fontSize="small" /></InputAdornment>}
                    >
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                      <MenuItem value="highest">Amount: High to Low</MenuItem>
                      <MenuItem value="lowest">Amount: Low to High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ minHeight: 400 }}>
              {isLoading && transactions.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <CircularProgress />
                </Box>
              ) : paginatedTransactions.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {paginatedTransactions.map((tx: any, index: number) => {
                    const txPayeeId = typeof tx.payeeId === 'object' ? tx.payeeId?._id : tx.payeeId;
                    const isIncome = tx.type === 'purchase' || (tx.type === 'transfer' && txPayeeId === user?._id);
                    return (
                    <Box 
                      key={tx._id} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 3,
                        borderBottom: index !== paginatedTransactions.length - 1 ? '1px solid #f0f0f0' : 'none',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: '#fafbfc' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          bgcolor: isIncome ? 'success.50' : 'error.50',
                          color: isIncome ? 'success.main' : 'error.main'
                        }}>
                          <AvatarIcon type={tx.type} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight="600" textTransform="capitalize">
                            {tx.type === 'purchase' ? 'Purchased SourceCoins' : tx.type === 'transfer' ? 'Job Payment' : tx.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {tx.paymentMethod}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color={isIncome ? 'success.main' : 'text.primary'}>
                        {isIncome ? '+' : '-'}{tx.amount.toLocaleString()} SC
                      </Typography>
                    </Box>
                  )})}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 400, color: 'text.secondary' }}>
                  <ReceiptIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No transactions found</Typography>
                  <Typography variant="body2">Try adjusting your filters or search query.</Typography>
                </Box>
              )}
            </Box>
            
            <Divider />
            <TablePagination
              component="div"
              count={processedTransactions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ borderTop: 'none' }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Top-up Dialog */}
      <Dialog open={openTopup} onClose={() => setOpenTopup(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold">Buy SourceCoins</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Amount of SourceCoins"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={method}
                label="Payment Method"
                onChange={(e) => setMethod(e.target.value)}
              >
                <MenuItem value="credit_card">Debit / Credit Card</MenuItem>
                <MenuItem value="etransfer">Interac e-Transfer</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary" align="center" sx={{ bgcolor: 'info.50', p: 1.5, borderRadius: 2 }}>
              * This is a simulated transaction for testing purposes.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setOpenTopup(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleTopupSubmit} variant="contained" disabled={isLoading} sx={{ bgcolor: 'black', borderRadius: 2, px: 3 }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Purchase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const AvatarIcon = ({ type }: { type: string }) => {
  if (type === 'purchase') return <AddCardIcon color="inherit" />;
  if (type === 'transfer') return <SwapHorizIcon color="inherit" />;
  return <ReceiptIcon color="inherit" />;
};

export default Wallet;
