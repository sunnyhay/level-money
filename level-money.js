const moment = require('moment');
const request = require('request');
moment().format();

const uri = 'https://2016.api.levelmoney.com/api/v2/core/get-all-transactions';
const formData = {
  "args": {
    "uid": 1110590645,
    "token": "68E8C0E6B10ED0C229A7C10AA8D07412",
    "api-token": "AppTokenForInterview",
    "json-strict-mode": false,
    "json-verbose-response": false
  }
};
const donutMerchant1 = 'Krispy Kreme Donuts', donutMerchant2 = 'DUNKIN #336784';
const dollar = '$';

var args = process.argv.slice(2);
var donutFlag = args[0] === '--ignore-donuts' ? true : false;
var donutCount1 = 0, donutCount2 = 0;

request.post({
  headers: {'Content-Type' : 'application/json'},	
  url: uri, 
  body: JSON.stringify(formData)}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('err in the request', err);
    }
    // get all transactions from response body
    var transactions = JSON.parse(body).transactions;
    // the total number of months
    var months = [];
    var output = {};
    // the summary of spending and income
    var sumSpent = 0, sumIncome = 0;
    for(var i = 0; i < transactions.length; i++) {
    	var donutMerchant = transactions[i]['merchant'];
    	// ignore donut transactions if relevant argument is set
    	if (donutFlag && (donutMerchant === donutMerchant1 || donutMerchant === donutMerchant2)) {
        if (donutMerchant === donutMerchant1)
          donutCount1++;
        if (donutMerchant === donutMerchant2)
          donutCount2++;
        continue;
    	}
      var transaction_date = transactions[i]['transaction-time'];
      var amount = transactions[i]['amount'];
      var check = moment(transaction_date, 'YYYY-MM');
      var month = check.format('MM');
      var year  = check.format('YYYY');
      var month_year = year + "-" + month;
      var item = {};
      if(months.indexOf(month_year) < 0){
        item.spent = dollar + (amount < 0 ? -amount : 0);
        item.income = dollar + (amount >= 0 ? amount : 0);	
        months.push(month_year);
        output[month_year] = item;
      } else {
        item = output[month_year];
        item.spent = dollar + (parseFloat(item.spent.substring(1)) + (amount < 0 ? -amount : 0)).toFixed(2);
        item.income = dollar + (parseFloat(item.income.substring(1)) + (amount >= 0 ? amount : 0)).toFixed(2);
      }
      sumSpent += amount < 0 ? -amount : 0;
      sumIncome += amount >= 0 ? amount : 0;      
    }
    // append the average statistics. This is the exactly average spending and income.
    output['average'] = {
      'spent' : dollar + (sumSpent / months.length).toFixed(2),
      'income' : dollar + (sumIncome / months.length).toFixed(2)    
    };
    if (donutCount1 > 0)
      console.log("there are " + donutCount1 + " ignored transactions in merchant " + donutMerchant1);
    if (donutCount2 > 0)
      console.log("there are " + donutCount2 + " ignored transactions in merchant " + donutMerchant2);  
    console.log("result: " + JSON.stringify(output));
});
