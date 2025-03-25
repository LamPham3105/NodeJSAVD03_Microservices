import Image from "next/image";

export default function DetailsCheckout({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <></>;
  }
  // Calculate total amount for the entire order
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {items?.map((item: any, index: any) => (
        <div key={index} className="mt-4 ml-10 grid grid-cols-12">
          <div className="col-span-6 flex flex-row items-center gap-3">
            <div className="w-16 h-16 relative">
              <Image layout="fill" objectFit="cover" src={item.img} alt="" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base">{item.name}</span>
              <span className="text-sm text-gray-600">{item.description}</span>
            </div>
          </div>
          <div className="col-span-2 ml-1 flex items-center">{item.price}</div>
          <div className="col-span-2 ml-5 flex items-center">
            {item.quantity}
          </div>
          <div className="col-span-2 ml-5 flex items-center">
            {item.price * item.quantity} {/* Auto-calculate total price */}
          </div>
        </div>
      ))}
      {/* Display total amount */}
      <div className="mt-4 ml-10 font-bold text-lg">
        Tổng cộng: {totalAmount}
      </div>
    </>
  );
}
