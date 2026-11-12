@extends('layouts.admin')

@section('content')
    <div class="custom-container py-4">
        <div class="row g-6 mb-6">
            <div class="col-xl-3 col-md-6 col-12">
                <div class="card card-lg bg-gradient-success shadow-sm border-0 h-100">
                    <div class="card-body d-flex flex-column gap-8 text-inherit">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="fw-bold">Total Revenue</div>
                            <div class="opacity-50"><i class="ti ti-currency-rupee fs-4"></i></div>
                        </div>
                        <div class="lh-1 d-flex flex-column gap-3">
                            <div class="fs-1 fw-bold">₹{{ number_format($stats['total_revenue']) }}</div>
                            <p class="mb-0 small opacity-75">Updated just now</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
                <div class="card card-lg bg-gradient-info shadow-sm border-0 h-100">
                    <div class="card-body d-flex flex-column gap-8 text-inherit">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="fw-bold">Total Orders</div>
                            <div class="opacity-50"><i class="ti ti-shopping-cart fs-4"></i></div>
                        </div>
                        <div class="lh-1 d-flex flex-column gap-3">
                            <div class="fs-1 fw-bold">{{ $stats['total_orders'] }}</div>
                            <p class="mb-0 small opacity-75">{{ $stats['delivered_orders'] }} Shipped |
                                {{ $stats['pending_orders'] }} New</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
                <div class="card card-lg bg-gradient-warning shadow-sm border-0 h-100">
                    <div class="card-body d-flex flex-column gap-8 text-inherit">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="fw-bold">Pending Orders</div>
                            <div class="opacity-50"><i class="ti ti-clock-hour-4 fs-4"></i></div>
                        </div>
                        <div class="lh-1 d-flex flex-column gap-3">
                            <div class="fs-1 fw-bold">{{ $stats['pending_orders'] }}</div>
                            <p class="mb-0 small opacity-75">Action Required</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
                <div class="card card-lg bg-gradient-danger shadow-sm border-0 h-100">
                    <div class="card-body d-flex flex-column gap-8 text-inherit">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="fw-bold">Total Customers</div>
                            <div class="opacity-50"><i class="ti ti-users fs-4"></i></div>
                        </div>
                        <div class="lh-1 d-flex flex-column gap-3">
                            <div class="fs-1 fw-bold">{{ $stats['total_customers'] }}</div>
                            <p class="mb-0 small opacity-75">Growing every day</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-xl-8">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 15px;">
                    <div class="card-body">
                        <h5 class="fw-bold mb-4">
                            <i class="ti ti-chart-line me-2 text-primary"></i>Revenue Trend
                        </h5>
                        <div id="totalIncomeChart" style="width: 100%"></div>
                    </div>
                </div>
            </div>

            <div class="col-xl-4">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 15px;">
                    <div class="card-body text-center">
                        <h5 class="fw-bold mb-4 text-start">
                            <i class="ti ti-chart-pie me-2 text-danger"></i>Order Logistics
                        </h5>
                        <div id="contactSource" class="d-flex justify-content-center "></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        // 1. Backend data ko pehle hi global load kar lo
        const myMonthlySales = @json($monthlySales);
        const myOrderStats = @json($orderStats);

        // Global settings taaki koi purana default data overlap na kare
        window.Apex = {
            chart: {
                animations: {
                    enabled: false
                } // Taaki instant update ho, deri na ho
            }
        };

        document.addEventListener('DOMContentLoaded', function() {
            // =====================================
            // 1. REVENUE AREA CHART
            // =====================================
            const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            const revenueContainer = document.querySelector("#totalIncomeChart");
            if (revenueContainer) {
                const revOptions = {
                    series: [{
                        name: 'Revenue',
                        data: myMonthlySales.map(i => Number(i.total))
                    }],
                    chart: {
                        type: 'area',
                        height: 350,
                        toolbar: {
                            show: false
                        },
                        background: 'transparent',
                        foreColor: isDarkMode ? '#adb5bd' : '#495057' // Labels color change
                    },
                    theme: {
                        mode: isDarkMode ? 'dark' : 'light'
                    },
                    grid: {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
                    },
                    colors: ['#667eea'],
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    xaxis: {
                        categories: myMonthlySales.map(i => i.month)
                    },
                    dataLabels: {
                        enabled: false
                    }
                };
                new ApexCharts(revenueContainer, revOptions).render();
            }

            // 2. ORDER LOGISTICS (DONUT)
            const donutContainer = document.querySelector("#contactSource");
            if (donutContainer) {
                let donutSeries = [
                    Number(myOrderStats.delivered || 0),
                    Number(myOrderStats.pending || 0),
                    Number(myOrderStats.cancelled || 0),
                    Number(myOrderStats.returned || 0)
                ];

                // Check if all zero
                const isAllZero = donutSeries.every(v => v === 0);

                const donutOptions = {
                    series: isAllZero ? [1] : donutSeries, // Show 1 for placeholder if 0
                    labels: isAllZero ? ['No Data'] : ['Delivered', 'Pending', 'Cancelled', 'Returned'],
                    chart: {
                        type: 'donut',
                        height: 350,
                        background: 'transparent'
                    },
                    colors: isAllZero ? ['#334155'] : ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
                    theme: {
                        mode: isDarkMode ? 'dark' : 'light'
                    },
                    stroke: {
                        show: true,
                        colors: [isDarkMode ? '#1e293b' : '#fff']
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            colors: isDarkMode ? '#cbd5e1' : '#475569'
                        }
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: true,
                                    total: {
                                        show: true,
                                        label: 'Total',
                                        color: isDarkMode ? '#94a3b8' : '#64748b',
                                        formatter: () => isAllZero ? 0 : donutSeries.reduce((a, b) => a + b, 0)
                                    }
                                }
                            }
                        }
                    }
                };
                new ApexCharts(donutContainer, donutOptions).render();
            }
        });
    </script>
@endsection
