import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Plus,
  CreditCard
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  reference: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

const BankAccountTab = () => {
  const [balance] = useState(0.00);
  const [transactions] = useState<Transaction[]>([]);
  const [bankAccounts] = useState<BankAccount[]>([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const credits = transactions.filter(t => t.type === 'credit').length;
  const debits = transactions.filter(t => t.type === 'debit').length;

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    return transaction.type === transactionFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Wallet Balance Section */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Balance</span>
            </div>
            <p className="text-xs opacity-90 mb-4">Available for withdrawal</p>
            
            <div className="text-4xl font-bold mb-6">
              ₦{balance.toFixed(2)}
            </div>
            
            <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  Withdraw Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background">
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw to your bank account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-account">Bank Account</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.bankName} - {account.accountNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" disabled={bankAccounts.length === 0}>
                    {bankAccounts.length === 0 ? 'Add a bank account first' : 'Withdraw Funds'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{credits}</p>
                  <p className="text-sm text-muted-foreground">₦0.00</p>
                </div>
                <div className="text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium mt-2">Credits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{debits}</p>
                  <p className="text-sm text-muted-foreground">₦0.00</p>
                </div>
                <div className="text-red-600">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium mt-2">Debits</p>
            </CardContent>
          </Card>
        </div>

        {/* Bank Account Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Bank Account</CardTitle>
            </div>
            <CardDescription>Manage your bank account for withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountNumber} - {account.accountName}
                          </p>
                        </div>
                        {account.isDefault && (
                          <Badge>Default</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Bank Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader>
                      <DialogTitle>Add Bank Account</DialogTitle>
                      <DialogDescription>
                        Add a new bank account for withdrawals
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select your bank" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border z-50">
                            <SelectItem value="access">Access Bank</SelectItem>
                            <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                            <SelectItem value="zenith">Zenith Bank</SelectItem>
                            <SelectItem value="uba">United Bank for Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input 
                          id="account-number" 
                          placeholder="Enter your account number"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input 
                          id="account-name" 
                          placeholder="Account holder name"
                          disabled
                        />
                      </div>
                      <Button className="w-full">Add Bank Account</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Add a bank account to withdraw your earnings
                </p>
                <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader>
                      <DialogTitle>Add Bank Account</DialogTitle>
                      <DialogDescription>
                        Add your bank account information for withdrawals
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select your bank" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border z-50">
                            <SelectItem value="access">Access Bank</SelectItem>
                            <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                            <SelectItem value="zenith">Zenith Bank</SelectItem>
                            <SelectItem value="uba">United Bank for Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input 
                          id="account-number" 
                          placeholder="Enter your account number"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input 
                          id="account-name" 
                          placeholder="Account holder name"
                          disabled
                        />
                      </div>
                      <Button className="w-full">Add Bank Account</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Content */}
      <div className="lg:col-span-8">
        {/* Transaction History */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View and filter your wallet transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={transactionFilter} onValueChange={setTransactionFilter}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Transactions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value={transactionFilter} className="mt-6">
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'credit' ? '+' : '-'}₦{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.reference}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions found.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankAccountTab;