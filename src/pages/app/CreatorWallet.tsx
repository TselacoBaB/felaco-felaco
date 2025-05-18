import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useOzowTopup } from "@/hooks/useOzowTopup";
import { supabase } from "@/integrations/supabase/client";

// Mock transaction data
const transactions = [
	{ id: 1, type: 'subscription', amount: 25, date: '2023-05-12', status: 'completed', from: 'user123' },
	{ id: 2, type: 'tip', amount: 15, date: '2023-05-10', status: 'completed', from: 'fan456' },
	{ id: 3, type: 'payout', amount: -50, date: '2023-05-05', status: 'completed', to: 'Bank Account' },
	{ id: 4, type: 'content_purchase', amount: 10, date: '2023-05-01', status: 'completed', from: 'viewer789' },
];

const CreatorWallet = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [withdrawLoading, setWithdrawLoading] = useState(false);
	const [topupAmount, setTopupAmount] = useState("");
	const { startTopup, loading: topupLoading, error: topupError, paymentUrl } = useOzowTopup();

	// Simulate userId from auth context (replace with real user id)
	const userId = "demo-user-id";

	const handleWithdraw = () => {
		if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
			toast({
				title: "Invalid amount",
				description: "Please enter a valid withdrawal amount",
				variant: "destructive",
			});
			return;
		}

		setWithdrawLoading(true);

		// Simulate API call
		setTimeout(() => {
			toast({
				title: "Withdrawal initiated",
				description: `Your withdrawal of $${withdrawAmount} has been initiated and is being processed.`,
			});
			setWithdrawAmount("");
			setWithdrawLoading(false);
		}, 1500);
	};

	const handleTopup = async () => {
		if (!topupAmount || parseFloat(topupAmount) <= 0) {
			toast({
				title: "Invalid amount",
				description: "Please enter a valid top-up amount",
				variant: "destructive",
			});
			return;
		}
		await startTopup(parseFloat(topupAmount), userId);
	};

	return (
		<div className="p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Creator Wallet</h1>
				<Button
					variant="outline"
					size="sm"
					onClick={() => navigate('/app/creator-dashboard')}
				>
					Dashboard
				</Button>
			</div>

			{/* Wallet Balance */}
			<Card className="mb-6">
				<CardHeader className="text-center pb-2">
					<CardTitle className="text-lg">Available Balance</CardTitle>
				</CardHeader>
				<CardContent className="text-center pt-0">
					<p className="text-4xl font-bold mb-1">$210.00</p>
					<p className="text-sm text-gray-500">Next payout: May 15, 2023</p>
					{/* Top-up section */}
					<div className="mt-4 flex flex-col items-center">
						<Label htmlFor="topup-amount">Top Up Wallet</Label>
						<div className="flex gap-2 mt-2">
							<Input
								id="topup-amount"
								type="number"
								placeholder="0.00"
								value={topupAmount}
								onChange={e => setTopupAmount(e.target.value)}
								className="w-32"
							/>
							<Button
								onClick={handleTopup}
								disabled={topupLoading || !topupAmount || parseFloat(topupAmount) <= 0}
							>
								{topupLoading ? "Processing..." : "Pay with Ozow"}
							</Button>
						</div>
						{topupError && <div className="text-red-600 text-xs mt-2">{topupError}</div>}
						{paymentUrl && (
							<div className="mt-2">
								<a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Complete Payment</a>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="transactions" className="mb-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="transactions">Transactions</TabsTrigger>
					<TabsTrigger value="withdraw">Withdraw</TabsTrigger>
				</TabsList>

				<TabsContent value="transactions">
					<Card>
						<CardHeader>
							<CardTitle>Transaction History</CardTitle>
						</CardHeader>
						<CardContent>
							{transactions.length > 0 ? (
								<div className="divide-y">
									{transactions.map((tx) => (
										<div key={tx.id} className="py-3 flex justify-between items-center">
											<div>
												<h3 className="font-medium capitalize">
													{tx.type.replace('_', ' ')}
													{tx.type === 'payout' ? ' to Bank' : ` from ${tx.from}`}
												</h3>
												<p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
											</div>
											<div className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
												{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									No transactions yet
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="withdraw">
					<Card>
						<CardHeader>
							<CardTitle>Withdraw Funds</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<Label htmlFor="amount">Amount to withdraw</Label>
									<div className="relative mt-1">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<span className="text-gray-500">$</span>
										</div>
										<Input
											id="amount"
											type="number"
											placeholder="0.00"
											className="pl-8"
											value={withdrawAmount}
											onChange={(e) => setWithdrawAmount(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="payment-method">Payment Method</Label>
									<div className="p-3 border rounded-md mt-1 flex items-center">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
										</div>
										<div className="flex-1">
											<p className="font-medium">Bank Account (Default)</p>
											<p className="text-xs text-gray-500">Ending in 1234</p>
										</div>
									</div>
								</div>

								<Button
									onClick={handleWithdraw}
									disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || withdrawLoading}
									className="w-full"
								>
									{withdrawLoading ? "Processing..." : "Withdraw Funds"}
								</Button>

								<div className="text-xs text-gray-500">
									<p>Note: Withdrawals typically take 1-3 business days to process.</p>
									<p>Minimum withdrawal amount: $50.00</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Earnings Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-gray-600">Subscriptions</span>
							<span className="font-medium">$125.00</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Tips</span>
							<span className="font-medium">$75.00</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Content Sales</span>
							<span className="font-medium">$60.00</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Platform Fee (20%)</span>
							<span className="font-medium text-red-600">-$50.00</span>
						</div>
						<div className="border-t pt-2 flex justify-between font-medium">
							<span>Total Earnings</span>
							<span>$210.00</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="text-center">
				<Button
					variant="outline"
					onClick={() => navigate('/app/creator-dashboard')}
				>
					Back to Dashboard
				</Button>
			</div>
		</div>
	);
};

export default CreatorWallet;
