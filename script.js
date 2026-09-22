const logoInput = document.getElementById("logoInput");
const logoPreview = document.getElementById("logoPreview");

logoInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => logoPreview.src = reader.result;
  reader.readAsDataURL(file);
});

const mappings = [
  ["companyName","companyText"],
  ["address","addressText"],
  ["phone","phoneText"],
  ["slipTitle","titleText"]
];

mappings.forEach(([inputId,textId]) => {
  const input = document.getElementById(inputId);
  const text = document.getElementById(textId);
  input.addEventListener("input", () => text.textContent = input.value);
});

function numberFromCell(cell){
  const n = parseFloat(cell.innerText.replace(/[^0-9.-]/g,""));
  return Number.isFinite(n) ? n : 0;
}

function recalc(){
  const rows = [...document.querySelectorAll("#salaryBody tr:not(.total-row)")];
  let earn = 0, deduct = 0;
  rows.forEach(row => {
    const cells = row.children;
    if(cells.length !== 4) return;
    earn += numberFromCell(cells[1]);
    deduct += numberFromCell(cells[3]);
  });
  document.getElementById("earningTotal").textContent = earn.toFixed(2);
  document.getElementById("deductionTotal").textContent = deduct.toFixed(2);
}

document.querySelectorAll(".salary-table .editable").forEach(el => {
  el.addEventListener("input", recalc);
});
recalc();

function clearForm(){
  if(!confirm("Clear the editable fields?")) return;
  document.querySelectorAll(".editable").forEach(el => {
    if(el.id === "companyText") el.textContent = "";
    else if(el.id === "addressText") el.textContent = "";
    else if(el.id === "phoneText") el.textContent = "";
    else if(el.id === "titleText") el.textContent = "";
  });
  logoPreview.removeAttribute("src");
  logoInput.value = "";
}
