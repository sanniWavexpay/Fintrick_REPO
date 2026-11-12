<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB; // 🔥 Import zaroori hai

class CleanupPendingOrders extends Command
{
    protected $signature = 'app:cleanup-pending-orders';
    protected $description = 'Restore stock for orders that were not paid within 30 minutes';

    public function handle()
    {
        $expiredOrders = DB::table('orders')
            ->where('PaymentStatus', 14) // 14 = Pending
            ->where('CreatedDtTm', '<', now()->subMinutes(30))
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info("Nothing to clean.");
            return;
        }

        foreach ($expiredOrders as $order) {
            DB::beginTransaction();
            try {
                $items = DB::table('order_items')->where('OrderID', $order->ID)->get();

                foreach ($items as $item) {
                    // 1. Inventory Update
                    DB::table('inventory')->where('PVID', $item->PVID)->update([
                        'AvailableQty' => DB::raw("AvailableQty + " . $item->Quantity),
                        'SoldQty'      => DB::raw("SoldQty - " . $item->Quantity),
                        'Updated_At'   => now()
                    ]);

                    // 2. Order Item Status Update (22 = Cancelled)
                    DB::table('order_items')->where('ID', $item->ID)->update(['ItemStatus' => 22]);

                    // 3. History Table Entry
                    DB::table('order_items_status_history')->insert([
                        'OID' => $order->ID,
                        'OrderItemID' => $item->ID,
                        'Status' => 18, // Old: Pending
                        'NewStatus' => 22, // New: Cancelled
                        'ChangedBy' => 0,
                        'CreatedDtTm' => now()
                    ]);
                }

                // 4. Main Order Table Update
                DB::table('orders')->where('ID', $order->ID)->update([
                    'OrderStatus' => 12, // Cancelled
                    'PaymentStatus' => 16, // Failed
                    'UpdatedDtTm'=>now()
                ]);

                // 5. Order Payment Table Update
                DB::table('order_payment')->where('OID', $order->ID)->update([
                    'PaymentStatus' => 42, // Expired
                    'UpdatedAt' => now() 
                ]);

                // 6. Payments (Transaction Log) Table Update
                DB::table('payments')->where('OID', $order->ID)->update([
                    'Status' => 28, // Failed
                    'ModifiedDtTm' => now() // Failed

                ]);

                DB::commit();
                $this->info("Order {$order->OrderNo} auto-cancelled successfully.");
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("Failed for {$order->OrderNo}: " . $e->getMessage());
            }
        }
    }
}
