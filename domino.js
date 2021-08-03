const { NODATA } = require("dns");
const puppeteer = require("puppeteer");
const readline = require("readline");

let reader = readline.createInterface({
  input:process.stdin,
  output:process.stdout,
});

(async () => {
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.dominos.co.in/");
  await page.waitForSelector("button");
  await Promise.all([
    page.click("button"),
    page.waitForNavigation(),
  ])
  

  //click the order now button
  await page.waitForSelector(".srch-cnt-srch .srch-cnt-srch-inpt");
  await page.click(".srch-cnt-srch .srch-cnt-srch-inpt");
  //enter the area
  await page.waitForSelector(".sc-hzDkRC.fXeHuM .injectStyles-sc-1jy9bcf-0.iRUDKI");
  await page.type(".sc-hzDkRC.fXeHuM .injectStyles-sc-1jy9bcf-0.iRUDKI", "Govind Nagar Kanpur");
  //select the first area from the list
  const area = await page.$$('[data-label="location_[object Object]"]');
  await area[0].click();
  //enter the locality
  await page.waitForSelector(".sc-hzDkRC.fXeHuM");
  await page.type(".sc-hzDkRC.fXeHuM", "Khalsa Girls Inter College");
  //select the first locality from the list
  const location = await page.$$('[data-label="location_[object Object]"]');
  await location[0].click();
  await page.waitForNavigation();


  //menu page will appear
  await page.waitForSelector('div [data-label="Speciality Chicken"] div [data-label="Roasted Chicken Wings Peri-Peri"] button[data-label="addTocart"]');
  await page.evaluate(function(){
    let div=document.querySelectorAll('div [data-label="Speciality Chicken"] div [data-label="Roasted Chicken Wings Peri-Peri"] button[data-label="addTocart"]');
    let height=div[0].getBoundingClientRect().top;
    window.scrollTo(0,height+10000);  //scroll from top to your choice of pizza/sides
  })
  
  //add the item to your cart
  await page.waitForSelector('div [data-label="Speciality Chicken"] div [data-label="Roasted Chicken Wings Peri-Peri"] button[data-label="addTocart"]');
  await page.click('div [data-label="Speciality Chicken"] div [data-label="Roasted Chicken Wings Peri-Peri"] button[data-label="addTocart"]');
  //checkout for further process
  await page.waitForSelector('[data-label="miniCartCheckout"]');
  await page.click('[data-label="miniCartCheckout"]');
  await page.waitForNavigation();
  
  await page.evaluate(function(){
    let selectButton = document.querySelectorAll(".btn--grn");
    selectButton[1].click();
  })
  
  //enter phone number
  await page.waitForSelector("input[name='loginNumber']");
  await page.type("input[name='loginNumber']", "XYZ");//XYZ-PHONE NO.

  await page.waitForSelector("input[type='submit']");
  await page.click("input[type='submit']");
  
  //wait till you receive the OTP and then enter it in the console
  let otp = await readOTP();
  await page.waitForTimeout(3000);
  await page.waitForSelector("input[type='text']");
  await page.type("input[type='text']", otp);

  await page.waitForSelector(".injectStyles-sc-1jy9bcf-0.kUmvRk");
  await page.click(".injectStyles-sc-1jy9bcf-0.kUmvRk");
  await page.waitForNavigation();

  await page.waitForSelector('[data-label="Place Order"]');
  await page.click('[data-label="Place Order"]');
  
  //enter your personal details
  await page.waitForSelector('[data-label="First Name"]');
  await page.type('[data-label="First Name"]', "Muskan");
  await page.waitForSelector('[data-label="Last Name"]');
  await page.type('[data-label="Last Name"]', "Kaur");
  await page.waitForSelector('[data-label="Email Address"]');
  await page.type('[data-label="Email Address"]', "ABC");//ABC- EMAIL
  await page.waitForSelector('[data-label="Address"]');
  await page.type('[data-label="Address"]', "Khalsa Girls Inter College");
  await page.waitForSelector('[data-label="House No"]');
  await page.type('[data-label="House No"]', "##");//##- ADDRESS
  //save the details and continue
  await page.waitForSelector('[data-label="saveAndContinue"]');
  await page.click('[data-label="saveAndContinue"]');
  await page.waitForNavigation();
  
  //confirm the order by clicking on Confirm Order button
  await page.waitForSelector('[data-label="Confirm Order"]');
  await page.click('[data-label="Confirm Order"]');
  await page.waitForNavigation();
 

  //wait for 20 seconds and save the screenshot of your order summary after order is accepted from the store
  await page.waitForTimeout(20000);
  return page.screenshot({path:"orderSummary.png"});

})
();

//function to enter OTP in console
function readOTP(){
  return new Promise((resolve, reject) => {
    reader.question('Enter OTP -> ',(otp)=>{
      resolve(otp)
    }); 
  });
}