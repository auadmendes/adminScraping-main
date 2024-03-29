import { createContext, ReactNode, useState } from "react";
import * as XLSX from 'xlsx'

interface DraftkingsRef {
  reference: string
}

interface StopPaymentProviderProps {
  children: ReactNode
}

interface Reference {

  code: string;
  reference: string;

}

interface ApiProps {
  url: string;
  mfa: string;
  refs: Reference[];
  user: string;
  password: string;
}

interface Merchant {
  merchantName: string;
  transactionId: string;
  merchantId: string;
  customerName: string;
  amount: string;
  reason: string;
  reasonCode: string;
  pasClerkPtx: string;
  log: string;
  merchantReference: string;
  refID: string;
  signatureRef: string;
}

interface StopPaymentContextType {
  referencePTX: Reference[];
  draftkingsRefs: string;
  refs: Merchant[];
  vipList: String[];
  merchantVip: Merchant[];
  stopPayment: Merchant[];
  readSheet: (sheet: string) => void;
  readRecoupSheet: (sheet: string) => void;
  createFiltered: (sheet: string) => void;
  //createVipSheets: (list: string) => void;
  getDraftkingsVip: (data: ApiProps) => void;
  getStopPayment: (data: ApiProps) => void;
  getRecoup: (data: ApiProps) => void;
}


export const StopPaymentContext = createContext({} as StopPaymentContextType)

export function StopPaymentProvider({ children }: StopPaymentProviderProps) {
  const [draftkingsRefs, setDraftkingsRefs] = useState('Luciano')
  const [referencePTX, setReferencePTX] = useState<Reference[]>([])
  const [vipList, setVipList] = useState([])

  const [stopPayment, setStopPayment] = useState<Merchant[]>([])
  const [merchantVip, setMerchantVip] = useState<Merchant[]>([])

  const refs = []
  const infoArray = []
  const arr = []
  const arrayDraftkingsVips = []
  const firstFilterStopPayment = []
  const filteredItems = []
  //const firstAndDraftkingsBind = []


  // This method read the file and separate the VIPs from Draftkings
  function readSheet(sheet: any) {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target.result
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const ws_name = workbook.SheetNames[0]
      const ws = workbook.Sheets[ws_name]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

      data.map(item => {
        // console.log(item[1] + 'kkkkkkkkkkkkkkkkkkkkkkk')
        if (item[1] === 44048549 || item[1] === 44053920) {
          //if (item[1] === 44053920) {
          //console.log(item[9])

          refs.push([
            [item[0]], // Merchant
            [item[1]], // Merchant subs_id
            [item[2]], // Customer name
            [item[3]], // Amount
            [item[4]], // Reason
            [item[5]], // Reason_code
            [item[8]], // Pas_clerk_ptx
            [item[9]], // Log
          ])
          setReferencePTX([...refs])
        }
        if (item[1] === 44048549) {
          //console.log(item[9])

          refs.push([
            [item[0]], // Merchant
            [item[1]], // Merchant subs_id
            [item[2]], // Customer name
            [item[3]], // Amount
            [item[4]], // Reason
            [item[5]], // Reason_code
            [item[8]], // Pas_clerk_ptx
            [item[9]], // Log
          ])
          setReferencePTX([...refs])
        }
      })
    }
    //createFiltered(sheet)

    reader.readAsBinaryString(sheet);
  }

  //Read recoup
  function readRecoupSheet(sheet: any) {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target.result
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const ws_name = workbook.SheetNames[0]
      const ws = workbook.Sheets[ws_name]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

      // console.log(data)

      data.map(item => {


        if (item[9] !== undefined) {
          console.log(item[9])
          //console.log(item[2])
          refs.push([
            [item[1]], // Customer Id
            [item[2]], // Transaction ID
            [item[3]], // Merchatn reference
            [item[6]], // Amount recovered
            [item[9]], // Amount recovered

          ])
          setReferencePTX([...refs])

        }
      })
      console.log(referencePTX + '-------')
    }
    createFiltered(sheet)
    //return
    reader.readAsBinaryString(sheet);
  }

  function createFiltered(sheet: any) {
    //console.log('createFilter' + sheet)
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target.result
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const ws_name = workbook.SheetNames[0]
      const ws = workbook.Sheets[ws_name]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

      data.forEach(function (item, index) {
        if (
          item[0] !== 'FANDUEL_DAILY_FANTASY' &&
          item[0] !== 'FANDUEL_SPORTSBOOK' &&
          item[0] !== 'FANDUEL_VIP' &&
          item[0] !== 'LYFT' &&
          item[0] !== 'LYFT' &&
          //item[0] !== 'LYFT' && colocar outro merchant aqui *
          item[0] !== 'DRAFTKINGS_VIP' &&
          item[5] !== 'R01' &&
          item[5] !== 'I03'
        ) {
          firstFilterStopPayment.push(item)
          //console.log('Aqui')
        }
      })

      // data.forEach(function (item, index) {
      //   if (item[1] === 44048549) {
      //     arrayDraftkingsVips.push(item)
      //   }
      // })

      const firstAndDraftkingsBind = firstFilterStopPayment.concat(arrayDraftkingsVips)

      const formattedCustomers = firstAndDraftkingsBind.reduce((total, customer) => {
        const customers = { ...total }

        if (!customers[customer[2]]) {
          customers[customer[2]] = []

        }
        customers[customer[2]].push([

          (customer[0]),
          (customer[1]),
          (customer[2]),
          (customer[3]),
          (customer[4]),
          (customer[5]),
          (customer[6]),
          (customer[7]),
          (customer[8]),
          (customer[9]),
        ])
        //console.log(customers)
        return customers
      }, [])

      const newCustomers = Object.keys(formattedCustomers).map(customer => {
        return {
          name: customer,
          cases: formattedCustomers[customer],
          total: formattedCustomers[customer].reduce((total, currentAmount) => {
            return total + currentAmount[3]
          }, 0)
        }
      })

      const filteredCustomers = newCustomers
        .filter(item => item.total >= 500)
        .map(customer => customer.cases)
        .flat()

      filteredItems.push(...filteredCustomers)
      setReferencePTX([...filteredCustomers])

      // console.log('newCustomers')
      // console.log(newCustomers)

      // console.log('filteredCustomers')
      // console.log(filteredCustomers)


      // console.log('filteredItems')
      // console.log(filteredItems)

      // console.log('referencePTX')
      // console.log(referencePTX)

      //console.log(filteredCustomers)
      // merchantName: string;
      // transactionId: string;
      // merchantId: string;
      // customerName: string;
      // amount: string;
      // reason: string;
      // reasonCode: string;
      // pasClerkPtx: string;
      // log: string;
      // merchantReference: string;

      // data.map(item => {
      //   if (item[1] === 44048549) {
      //     //console.log(item[9])

      //     refs.push([
      //       [item[0]], // Merchant
      //       [item[1]], // Merchant subs_id
      //       [item[2]], // Customer name
      //       [item[3]], // Amount
      //       [item[4]], // Reason
      //       [item[5]], // Reason_code
      //       [item[8]], // Pas_clerk_ptx
      //       [item[9]], // Log
      //     ])
      //     setReferencePTX([...refs])
      //   }
      // })
    }

    reader.readAsBinaryString(sheet);
  }


  //Go to /api/stopPayment to get the data from Admin Console
  async function getStopPayment({ url, mfa, refs, user, password }: ApiProps) {
    //console.log('Refs >>> ' + refs)

    const response = await fetch('/api/stop-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        mfa,
        refs,
        user,
        password
      })
    })

    const data = await response.json()
    console.log(data, ' >>>>>>>>>')
    setStopPayment(data)

    //console.log('Response Stop Payment.......................................')
    console.log(data, ' >>>>>>>>>')
  }


  async function getRecoup({ url, mfa, refs, user, password }: ApiProps) {

    const response = await fetch('/api/recoup-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        mfa,
        refs,
        user,
        password
      })
    })

    const data = await response.json()
    console.log(data, ' RECOUP RECOUP RECOUP RECOUP RECOUP')
    //return
    setStopPayment(data)

    //console.log('Response Stop Payment.......................................')
    console.log(data, ' >>>>>>>>>')
  }

  //Go to /api/drafkings to get the data from Admin Console
  async function getDraftkingsVip({ url, mfa, refs, user, password }: ApiProps) {
    // console.log(refs)
    // console.log('Context > Inside getDraftkingsVip')

    const response = await fetch('/api/draftkings_vip', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        mfa,
        refs,
        user,
        password
      })
    })

    const data = await response.json()
    setMerchantVip(data)

    //console.log('Response')
    console.log(data)

  }

  return (
    <StopPaymentContext.Provider
      value={{
        draftkingsRefs,
        referencePTX,
        refs,
        vipList,
        merchantVip,
        stopPayment,
        readSheet,
        readRecoupSheet,
        createFiltered,
        getRecoup,
        getDraftkingsVip,
        getStopPayment
      }}
    >
      {children}
    </StopPaymentContext.Provider>
  )

}
