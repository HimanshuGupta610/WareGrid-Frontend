import React from 'react';

const TrendAlerts = ({ products }) => {
  const alerts = products.filter(p => {
    if (!p.history || p.history.length < 2) return false;
    const recent = p.history.slice(-2);
    return (
      recent[1].stock < recent[0].stock &&
      (recent[0].stock - recent[1].stock >= p.weeklySales / 2)
    );
  });

  if (alerts.length === 0) return null;

  return (
   <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4 inline-block max-w-full">
  <h3 className="font-semibold mb-2 text-sm md:text-base">⚠️ Trend Alerts</h3>
  <ul className="list-disc pl-5 space-y-1 text-sm">
    {alerts.map((p, i) => (
      <li key={i}>
        <span className="font-medium">{p.productName}</span> ({p.warehouseLocation}) stock is dropping faster than expected.
      </li>
    ))}
  </ul>
</div>
  );
};

export default TrendAlerts;
