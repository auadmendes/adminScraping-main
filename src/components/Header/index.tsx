import { useContext, useEffect, useState } from "react"
import { StopPaymentContext } from "../../contexts/StopPaymentContext"

import { TailSpin } from 'react-loader-spinner'
import { FileArrowDown } from 'phosphor-react'
import Avatar from "react-avatar"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef } from "react"

import axios from 'axios';
//import XLSX from 'xlsx'
const XLSX = require('xlsx')

//import api from '../../pages/api/testScrapApi'

export function Header() {
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('https://paywithmybank.com/admin-console/')
  const [mfa, setMfa] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isRecoupChecked, setIsRecoupChecked] = useState(false)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  const [data, setData] = useState(null);

  const checkRef = useRef('SP')

  const { push } = useRouter()

  const {
    readSheet,
    readRecoupSheet,
    createFiltered,
    referencePTX,
    getDraftkingsVip,
    getStopPayment,
    getRecoup,
    merchantVip,
    stopPayment
  } = useContext(StopPaymentContext)

  function fileSelect(event: any) {
    let file = event.target.files[0]

    if (isChecked) {
      readSheet(file)
    } else if (isRecoupChecked) {
      readRecoupSheet(file)
      //alert('reading recoup file...')
    }
    else {
      createFiltered(file)
    }
  }

  const info = {
    url: url,
    mfa: mfa,
    refs: referencePTX,
    user: user,
    password: password,
  }

  function handleApi() {
    if (isChecked) {
      setIsLoading(true)
      console.log('Header > chose VIP')
      getDraftkingsVip(info)
    } else if (isRecoupChecked) {
      //alert('Recoup')
      //console.log(info.refs)
      getRecoup(info)
    }
    else {
      setIsLoading(true)
      console.log('Header > chose SP')
      getStopPayment(info)
    }
    setMfa('')
  }

  function handleDownload() {
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const today = month + '_' + day + '_' + year
    if (isChecked) {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(merchantVip)

      XLSX.utils.book_append_sheet(wb, ws, 'Draftkings VIP')

      XLSX.writeFile(wb, `Draftkings_VIPS_${today}.xlsx`)
    } else {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(stopPayment)

      XLSX.utils.book_append_sheet(wb, ws, 'Stop Payment')

      XLSX.writeFile(wb, 'Stop Payment.xlsx')
    }

  }

  function handleCheckBox() {
    setIsChecked(!isChecked)
  }
  function handleRecoupCheckBox() {
    setIsRecoupChecked(!isRecoupChecked)
  }

  async function testAPI() {
    try {
      const response = await axios.get('../../../api/testScrapApi', {
        // url: 'your-url',
        // mfa: 'your-mfa',
        // refs: [['ref1', 'ref2']], // Example for refs, adjust as needed
        // user: 'your-username',
        // password: 'your-password',
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    try {
      const storageData = localStorage.getItem('@admin-console-user')
      const userData = JSON.parse(storageData)

      setUser(userData.user)
      setPassword(userData.password)

    } catch (error) {
      push('/Login')
    }

  }, [])

  useEffect(() => {
    if (merchantVip.length > 0 || stopPayment.length > 0) {
      setIsLoading(false)
    }
  }, [merchantVip, stopPayment])

  return (
    <header
      className="flex flex-1 justify-start w-full min-w-screen flex-col bg-gray-300 h-[150px] pt-8 pl-4">
      <h1 className="text-gray-700">Stop Payment {referencePTX.length} </h1>

      <div className="flex flex-row gap-2 items-center justify-between px-4">

        {/* the div below contain button inputs and labels */}
        <div className="flex space-x-6 items-end justify-between flex-row">
          <div className="flex flex-row mt-4 items-center justify-center">

            <div>
              <input
                className="max-w-[200px] p-3 text-gray-600"
                placeholder="Type the MFA"
                type="text"
                value={mfa} onChange={(e) => setMfa(e.target.value)}
              />
            </div>

            <div>
              <button
                disabled={!user}
                className="flex items-center justify-center h-[50px] max-w-[300px] w-[200px] 
              bg-Trutly text-gray-800 text-lg ml-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleApi}>
                {isLoading ? (
                  <TailSpin
                    height="50"
                    width="50"
                    color="#fff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  <span>Send</span>
                )}
              </button>

            </div>
            <FileArrowDown
              onClick={handleDownload}
              height={'50'}
              width={'50'}
              className={`text-Trutly cursor-pointer ${isLoading} disabled:`}
            />
          </div>

          <div>
            <div className="flex gap-2 items-center">
              <label className="block mb-2 text-sm font-medium text-gray-900">Check the box before upload |</label>
              <input type="checkbox" name="Stop Payment" id="SP" checked={isChecked} onChange={handleCheckBox}
                className="block w-5 h-5 text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-2" />
              <label>VIPs</label>

              <input type="checkbox" name="Recoup" id="recoup" checked={isRecoupChecked} onChange={handleRecoupCheckBox}
                className="block w-5 h-5 text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-2" />
              <label>Recoup</label>
            </div>

            <input
              className="block text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"

              onChange={fileSelect}
            />


            <p className="mt-1 text-sm text-gray-500 dark:text-gray-700"
              id="file_input_help">
              Excel, Google Sheet (Ex. Return_File0421 - {referencePTX.length}).
            </p>

            
          </div>
          <button
          className="w-28 h-12 p-6 bg-red-400 text-gray-100"
          onClick={testAPI}
          >
            Test
          </button>
        </div>

        <Link href={'/Login'} className="flex flex-col items-center gap-2">
          <Avatar
            className="cursor-pointer"
            name={user}
            size="50"
            round={true}
          />
          {user ? user : 'login'}
        </Link>

      </div>

    </header>
  )
}