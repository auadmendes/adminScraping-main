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

export default async function handler() {

  console.log('Init >>>>>')

  try {
    const pageDetails = "https://paywithmybank.com/admin-console/transactions/details/"

      let browser = null;
      const options = await getOptions(true)
      browser = await puppeteer.launch(options)

      let page = await browser.newPage();
      await page.goto(pageDetails);

      await browser.close()


      //res.status(201).send(infoArray)

  } catch (error) {
    console.log('Olha o erro' + error)
  } finally {
    console.log('Final')
  }
  
}