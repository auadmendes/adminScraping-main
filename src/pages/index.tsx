import { useContext, useEffect, useState } from "react"
import { StopPaymentContext } from "../contexts/StopPaymentContext";

export default function Home() {
  const { merchantVip, stopPayment } = useContext(StopPaymentContext)
  const [selectedCustomers, setSelectedCustomer] = useState([])


  return (
    <div className="flex flex-1 items-center justify-center w-screen ">
      <div className="flex-1 pt-8 pl-8 pr-8 flex flex-col w-full overflow-auto">
        <div>

        </div>

        {stopPayment.length > 0 ? (
          <table className="w-full max-w-full border-collapse min-w-[500px] border-2">
            <thead>
              <tr>
                <th className="bg-gray-700 text-gray-100 p-4 text-left text-sm 
              font-bold leading-6 rounded-tl-lg pl-6">
                  Customer
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                  Merchant
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                  Amount
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                  Type
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                  PTX
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                  REF ID
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                  Merchant REF
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                  Transaction
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                  Signature
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                  Amount
                </th>
                <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >

                </th>

              </tr>
            </thead>
            <tbody>
              {stopPayment.map((item) => {
                return (
                  <tr className="w-screen text-left gap-2">
                    <td
                      className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 p-2 w-auto"
                    >
                      {item.customerName}
                    </td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 w-1/10">{item.merchantName}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 pl-4 pr-4">{item.amount}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 pr-4">{item.reasonCode}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm leading-4 p-2  pr-4">{item.pasClerkPtx}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 w-auto">{item.log}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm leading-4">{item.merchantReference}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 w-auto">{item.transactionId}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm  w-auto">{item.signatureRef}</td>
                    <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 w-auto">USD {item.amount}</td>
                    <td>
                      <button className="p-2 bg-Trutly">
                        Send
                      </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>
        ) : (
          <div>
            <span>empty</span>
          </div>
        )}
        <table className="w-full max-w-full border-collapse min-w-[500px] border-2">
          <thead>
            <tr>
              <th className="bg-gray-700 text-gray-100 p-4 text-left text-sm 
              font-bold leading-6 rounded-tl-lg pl-6">
                Transaction
              </th>
              <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                Merchant
              </th>
              <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                M. Reference
              </th>
              <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                Amount
              </th>
              <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                Type
              </th>
              <th className="bg-gray-700 text-gray-100 p4 text-left text-sm 
              font-bold leading-6" >
                Code
              </th>
              {/* <th className="bg-gray-700 text-gray-100 p4 text-left text-sm font-bold
              leading-6 rounded-tr-lg pr-6" >
                Log
              </th> */}
            </tr>
          </thead>
          <tbody>
            {merchantVip.map((item) => {
              return (
                <tr>
                  <td
                    className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 p-2 w-[200px]"
                  >
                    {item.transactionId}
                  </td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 ">{item.merchantName}</td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 ">{item.merchantReference}</td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4">{item.amount}</td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4">{item.reason}</td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4">{item.reasonCode}</td>

                  <td className="bg-gray-500 border-t-2 border-solid border-gray-[#e1e1e6] 
                  text-gray-100 text-sm font-bold leading-4 w-auto">{item.log}</td>
                </tr>
              )
            })}

          </tbody>
        </table>

      </div>
    </div >
  )
}