import { TooltipProps } from 'recharts'; // Import types from Recharts

// Define the shape of the data passed to the Tooltip
interface CustomPayload {
  payload: {
    sales: number;
    unitsSold: number;
    salesGrowth?: number; // This can be optional
  };
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { sales, unitsSold, salesGrowth } = payload[0]
      .payload as CustomPayload['payload'];

    return (
      <div className="bg-white shadow-lg p-3 border rounded">
        <p className="label">{`Month: ${label}`}</p>
        <p>{`Sales: $${sales}`}</p>
        {salesGrowth !== undefined ? (
          <p>{`Monthly Growth: ${salesGrowth}%`}</p>
        ) : null}
        <p>{`Units Sold: ${unitsSold}`}</p>
      </div>
    );
  }
  return null;
};
