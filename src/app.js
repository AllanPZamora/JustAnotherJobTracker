const addRowBtn = document.getElementById('add-row-btn');
const tableBody = document.getElementById('job-table-body');

const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'];

function createRow() {
  const row = document.createElement('tr');

  const statusCell = `
    <td class="px-4 py-3">
      <select class="status-select bg-transparent border-none text-sm">
        ${statusOptions.map(opt => `<option>${opt}</option>`).join('')}
      </select>
    </td>`;

  row.innerHTML = `
    <td class="px-4 py-3" contenteditable="true"></td>
    <td class="px-4 py-3" contenteditable="true"></td>
    <td class="px-4 py-3" contenteditable="true"></td>
    ${statusCell}
    <td class="px-4 py-3" contenteditable="true"></td>
    <td class="px-4 py-3" contenteditable="true"></td>
    <td class="px-4 py-3 text-center">
      <button class="delete-row-btn text-slate-400 hover:text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mx-auto pointer-events-none">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </td>
  `;

  return row;
}

tableBody.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.delete-row-btn');
  if (deleteBtn) {
    const row = deleteBtn.closest('tr');
    if (row) row.remove();
  }
});

addRowBtn.addEventListener('click', () => {
  const newRow = createRow();
  tableBody.appendChild(newRow);

  const firstCell = newRow.querySelector('td[contenteditable="true"]');
  if (firstCell) firstCell.focus();
});

removeRowBtn.addEventListener('click', () => {
  const lastRow = tableBody.lastElementChild;
  if (lastRow) {
    lastRow.remove();
  }
});