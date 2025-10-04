import Chart from "react-apexcharts";

export default function MonthlyIncomeChart({ data }) {
  // Initialize 12 months with 0 income
  const monthlyIncome = Array(12).fill(0);

  // Sum income for each month
  data?.forEach(order => {
    const month = new Date(order.createdAt).getMonth(); // 0 = Jan, 11 = Dec
    monthlyIncome[month] += order.totalPrice || 0; // replace 'total' with your order amount field
  });

  const options = {
    colors: ["#00b894"], // Different color for income
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val) => `$${val.toLocaleString()}` },
    },
  };

  const series = [
    {
      name: "Income",
      data: monthlyIncome,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Income</h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 pl-2 min-w-0">
          <Chart options={options} series={series} type="bar" height={180} width="100%" />
        </div>
      </div>
    </div>
  );
}
