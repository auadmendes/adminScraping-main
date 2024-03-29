import { NextApiRequest, NextApiResponse } from "next";

import puppeteer from 'puppeteer-core'
import { getOptions } from "../../_lib/chromiumOption";


interface DraftkingsRequest extends NextApiRequest {
  body: {
    url: string;
    mfa: string;
    refs: Array<Array<string>>;
    user: string;
    password: string;
  };
}

export default async function handler(req: DraftkingsRequest, res: NextApiResponse) {

  console.log('Init >>>>>')

  try {
    const pageDetails = "https://paywithmybank.com/admin-console/transactions/details/"

    let browser = null;

    const ptxArray = []


    req.body.refs.map(item => {
      ptxArray.push(item[8])
    })

    const infoArray = []
    //infoArray.push(header)
    

      const options = await getOptions(true)
      browser = await puppeteer.launch(options)

      let page = await browser.newPage();

      await page.goto(req.body.url);
      
    
      await page.waitForSelector('input[name="username"]')
      await page.type('input[name="username"]', `${req.body.user}`)
    
      await page.waitForSelector('input[name="password"]')
      await page.type('input[name="password"]', `${req.body.password}`, { delay: 50 })
    
      await page.waitForSelector('input[name="mfa_code"]')
      await page.type('input[name="mfa_code"]', `${req.body.mfa}`, { delay: 50 })
    
      await page.keyboard.press('Enter', { delay: 100 })
    
      for (let i = 0; i < ptxArray.length; i++) {
          let ref = ptxArray[i]
          let trIds = ''
          let trxType = ''
          let trxMerchantName = ''


          await page.waitForSelector('input[name="ppTransactionId"]')
          await page.type('input[name="ppTransactionId"]', ref)

          await page.keyboard.press('Enter', { delay: 300 })

          await page.waitForSelector('.break-all', { delay: 100 })

          const referenceId = await page.$eval('.break-all', el => el.textContent)

          trxType = await page.$$eval('table tr td', anchors => {
            return anchors.map(links => links.textContent).slice(5, 6)
          })

          trxMerchantName = await page.$$eval('table tr td', anchors => {
            return anchors.map(links => links.textContent).slice(13, 14)
          })

          if (trxType[0] === 'External') {
            trIds = await page.$$eval('table tr td a', anchors => {
              return anchors.map(links => links.textContent).slice(7, 8)
            })
          } else {
            trIds = await page.$$eval('table tr td a', anchors => {
              return anchors.map(links => links.textContent).slice(0, 1)
            })
          }

          await page.goto(`${pageDetails}${trIds}`, {
            waitUntil: 'load',
            timeout: 0
          })

          const signatureRef = await page.$$eval(
            '#fi-transaction .table-condensed tbody tr td',
            anchors => {
              return anchors.map((links: { textContent: any; }) => links.textContent).slice(7, 8)
            }
          )

          const trustlyUserName = await page.$$eval('#info .table-hover tr td', anchors => {
            return anchors.map((items: { textContent: any; }) => items.textContent).slice(7, 8)
          })

          // console.log(req.body.refs[i][0], '0')
          // console.log(req.body.refs[i][1], '1')
          // console.log(req.body.refs[i][2], '2')
          // console.log(req.body.refs[i][3], '3')
          // console.log(req.body.refs[i][4], '5')
          // console.log(req.body.refs[i][5], '5')
          // console.log(req.body.refs[i][6], '6')
          // console.log(req.body.refs[i][7], '7')
          // console.log(req.body.refs[i][8], '8')
          // console.log(req.body.refs[i][9], '9')
      
          infoArray.push({
            customerName: trustlyUserName[0],
            merchantName: trxMerchantName[0],
            reason: req.body.refs[i][4] + ' ' + req.body.refs[i][5],
            amount: req.body.refs[i][3],
            pasClerkPtx: ref,
            logRef: req.body.refs[i][9],
            merchantReference: referenceId,
            transactionId: trIds[0],
            signatureRef: signatureRef[0].trim(),
            amount_usd: 'USD ' + req.body.refs[i][3],
          })

          await page.goBack()

          await page.waitForSelector('input[name="ppTransactionId"]')

          const ppTransactionId = await page.waitForSelector(
            'input[name="ppTransactionId"]'
          )

          await ppTransactionId.click({ clickCount: 3 })
          await ppTransactionId.press('Backspace')

      }


      await browser.close()
      res.status(201).send(infoArray)

  } catch (error) {
    console.log('Olha o erro' + error)
  } finally {
    console.log('Final')
  }
  
}