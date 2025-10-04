
import { ArrowDown, ArrowUp, BoxIcon, Calendar, DollarSign, HeaterIcon, User } from "lucide-react";


export default function EcommerceMetrics({ data }) {
    const today = new Date();
    const todayDateOnly = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const todayOrders = data.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        return itemDate === todayDateOnly;
    });
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <User className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm">
                            Customers
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 ">
                            {data.length}
                        </h4>
                    </div>
                    <div color="success">
                        <ArrowUp />
                        {Math.ceil(10 * Math.random(10))}%
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <DollarSign className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm">
                            Total Revenue
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 ">
                            {data.reduce((sum, order) => sum + order.totalPrice, 0)}
                        </h4>
                    </div>
                    <div color="success">
                        <ArrowUp />
                        11.01%
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm">
                            Orders
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 ">
                            {data.length}
                        </h4>
                    </div>
                    <div color="success">
                        <ArrowUp />
                        {Math.ceil(10 * Math.random(10))}%
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <Calendar className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm">
                            Todays Order
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 ">
                            {todayOrders.length}
                        </h4>
                    </div>

                    <div color="error">
                        <ArrowDown />
                        9.05%
                    </div>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}
