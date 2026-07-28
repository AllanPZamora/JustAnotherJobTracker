const addRowBtn = document.getElementById('add-row-btn');
const tableBody = document.getElementById('job-table-body');
const STORAGE_KEY = 'jobTrackerRows';

const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'];

const deleteIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mx-auto pointer-events-none">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>`;

function createRow(data = {}) {
  const row = document.createElement('tr');

  const statusCell = `
    <td class="px-4 py-3">
      <select class="status-select bg-transparent border-none text-sm">
        ${statusOptions.map(opt => `<option ${data.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
    </td>`;

  row.innerHTML = `
    <td class="px-4 py-3" contenteditable="true">${data.company || ''}</td>
    <td class="px-4 py-3" contenteditable="true">${data.role || ''}</td>
    <td class="px-4 py-3" contenteditable="true">${data.date || ''}</td>
    ${statusCell}
    <td class="px-4 py-3" contenteditable="true">${data.link || ''}</td>
    <td class="px-4 py-3" contenteditable="true">${data.notes || ''}</td>
    <td class="px-4 py-3 text-center">
      <button class="delete-row-btn text-slate-400 hover:text-red-500">${deleteIconSvg}</button>
    </td>
  `;

  return row;
}

function getRowData(row) {
  const cells = row.querySelectorAll('td[contenteditable="true"]');
  return {
    company: cells[0].textContent.trim(),
    role: cells[1].textContent.trim(),
    date: cells[2].textContent.trim(),
    status: row.querySelector('.status-select').value,
    link: cells[3].textContent.trim(),
    notes: cells[4].textContent.trim(),
  };
}

function saveToStorage() {
  const rows = Array.from(tableBody.querySelectorAll('tr')).map(getRowData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  let rows;
  try {
    rows = JSON.parse(saved);
  } catch (e) {
    return false;
  }

  tableBody.innerHTML = '';
  rows.forEach(data => tableBody.appendChild(createRow(data)));
  return true;
}

addRowBtn.addEventListener('click', () => {
  const newRow = createRow();
  tableBody.appendChild(newRow);
  saveToStorage();

  const firstCell = newRow.querySelector('td[contenteditable="true"]');
  if (firstCell) firstCell.focus();
});

tableBody.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.delete-row-btn');
  if (deleteBtn) {
    const row = deleteBtn.closest('tr');
    if (row) row.remove();
    saveToStorage();
  }
});

tableBody.addEventListener('focusout', (event) => {
  if (event.target.matches('td[contenteditable="true"]')) {
    saveToStorage();
  }
});

tableBody.addEventListener('change', (event) => {
  if (event.target.matches('.status-select')) {
    saveToStorage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
});