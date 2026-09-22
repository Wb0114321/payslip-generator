/* =====================================================
   PAY SLIP GENERATOR
   FINAL AUTO CALCULATION VERSION
===================================================== */


/* =====================================================
   LOGO
===================================================== */

const logoInput =
  document.getElementById("logoInput");

const logoPreview =
  document.getElementById("logoPreview");


logoInput.addEventListener(
  "change",
  function (e) {

    const file =
      e.target.files[0];

    if (!file) {
      return;
    }


    if (!file.type.startsWith("image/")) {

      alert("Please select an image file.");

      logoInput.value = "";

      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      function () {

        logoPreview.src =
          reader.result;

      };


    reader.readAsDataURL(file);

  }
);


/* =====================================================
   HEADER INPUT MAPPING
===================================================== */

const mappings = [

  ["companyName", "companyText"],

  ["address", "addressText"],

  ["phone", "phoneText"],

  ["slipTitle", "titleText"]

];


mappings.forEach(
  function ([inputId, textId]) {

    const input =
      document.getElementById(inputId);

    const text =
      document.getElementById(textId);


    input.addEventListener(
      "input",
      function () {

        text.textContent =
          input.value;

      }
    );

  }
);


/* =====================================================
   NUMBER PARSER
===================================================== */

function numberFromCell(cell) {

  if (!cell) {
    return 0;
  }


  let value =
    cell.innerText || "";


  /*
     Remove commas and other symbols
  */

  value =
    value.replace(/,/g, "");


  /*
     Keep numbers, decimal and minus
  */

  value =
    value.replace(/[^0-9.-]/g, "");


  const number =
    parseFloat(value);


  return Number.isFinite(number)
    ? number
    : 0;
}


/* =====================================================
   MONEY FORMAT
===================================================== */

function money(number) {

  return Number(number).toFixed(2);

}


/* =====================================================
   NUMBER TO WORDS
   INDIAN NUMBER SYSTEM
===================================================== */

const ones = [

  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen"

];


const tens = [

  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety"

];


function belowHundred(number) {

  if (number < 20) {

    return ones[number];

  }


  return (

    tens[Math.floor(number / 10)] +

    (

      number % 10
        ? " " + ones[number % 10]
        : ""

    )

  );

}


function numberToWords(number) {

  number =
    Math.floor(
      Math.abs(number)
    );


  if (number === 0) {

    return "Zero";

  }


  let result = "";


  const crore =
    Math.floor(
      number / 10000000
    );

  number %= 10000000;


  const lakh =
    Math.floor(
      number / 100000
    );

  number %= 100000;


  const thousand =
    Math.floor(
      number / 1000
    );

  number %= 1000;


  const hundred =
    Math.floor(
      number / 100
    );

  number %= 100;


  if (crore) {

    result +=
      numberToWords(crore) +
      " Crore ";

  }


  if (lakh) {

    result +=
      belowHundred(lakh) +
      " Lakh ";

  }


  if (thousand) {

    result +=
      belowHundred(thousand) +
      " Thousand ";

  }


  if (hundred) {

    result +=
      ones[hundred] +
      " Hundred ";

  }


  if (number) {

    result +=
      belowHundred(number);

  }


  return result.trim();

}


/* =====================================================
   AMOUNT IN WORDS
===================================================== */

function amountInWords(amount) {

  const negative =
    amount < 0;


  const absolute =
    Math.abs(amount);


  const rupees =
    Math.floor(absolute);


  const paise =
    Math.round(
      (absolute - rupees) * 100
    );


  let text =
    numberToWords(rupees) +
    " Rupees";


  if (paise > 0) {

    text +=
      " and " +
      belowHundred(paise) +
      " Paise";

  }


  text +=
    " Only";


  if (negative) {

    text =
      "Minus " + text;

  }


  return text;

}


/* =====================================================
   RECALCULATE EVERYTHING
===================================================== */

function recalc() {

  const rows =
    [
      ...document.querySelectorAll(
        "#salaryBody tr:not(.total-row)"
      )
    ];


  let earning =
    0;

  let deduction =
    0;


  rows.forEach(
    function (row) {

      const cells =
        row.children;


      if (cells.length !== 4) {

        return;

      }


      /*
         Column 2 = Earning Amount
      */

      earning +=
        numberFromCell(
          cells[1]
        );


      /*
         Column 4 = Deduction Amount
      */

      deduction +=
        numberFromCell(
          cells[3]
        );

    }
  );


  /*
     NET PAY
  */

  const netPay =
    earning - deduction;


  /*
     EARNING TOTAL
  */

  document.getElementById(
    "earningTotal"
  ).textContent =
    money(earning);


  /*
     DEDUCTION TOTAL
  */

  document.getElementById(
    "deductionTotal"
  ).textContent =
    money(deduction);


  /*
     NET PAY
  */

  document.getElementById(
    "netPay"
  ).textContent =
    money(netPay);


  /*
     AMOUNT IN WORDS
  */

  document.getElementById(
    "netPayWords"
  ).textContent =
    "(" +
    amountInWords(netPay) +
    ")";

}


/* =====================================================
   AMOUNT FIELD EVENTS
===================================================== */

document
  .querySelectorAll(
    ".salary-table .amount"
  )
  .forEach(
    function (element) {


      /*
         While typing
      */

      element.addEventListener(
        "input",
        function () {

          recalc();

        }
      );


      /*
         After leaving field
      */

      element.addEventListener(
        "blur",
        function () {

          const value =
            numberFromCell(element);


          element.textContent =
            money(value);


          recalc();

        }
      );


      /*
         ENTER = finish editing
      */

      element.addEventListener(
        "keydown",
        function (event) {

          if (event.key === "Enter") {

            event.preventDefault();

            element.blur();

          }

        }
      );

    }
  );


/* =====================================================
   ALSO RECALCULATE IF TABLE CONTENT CHANGES
===================================================== */

document
  .querySelectorAll(
    ".salary-table .editable"
  )
  .forEach(
    function (element) {

      element.addEventListener(
        "input",
        function () {

          recalc();

        }
      );

    }
  );


/* =====================================================
   INITIAL CALCULATION
===================================================== */

recalc();


/* =====================================================
   CLEAR / RESET
===================================================== */

function clearForm() {

  const confirmClear =
    confirm(
      "Clear all editable fields and restore default payslip?"
    );


  if (!confirmClear) {

    return;

  }


  /*
     Easiest and safest reset:
     reload original HTML values
  */

  location.reload();

}
