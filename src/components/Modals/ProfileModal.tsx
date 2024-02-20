export default function Component() {
  return (
    <div className="fixed top-0 right-0 mt-4 mr-4 w-[350px] rounded-lg bg-white p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">Your Fungi Account</h2>
        <button className="text-lg font-semibold">X</button>
      </div>
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="ml-2">0x514...83x1</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Send</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Withdraw</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Transactions</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Deposit</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Settings</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-sm">Log Out</p>
        </div>
      </div>
    </div>
  );
}
