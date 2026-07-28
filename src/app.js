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
  `;

  return row;
}

addRowBtn.addEventListener('click', () => {
  const newRow = createRow();
  tableBody.appendChild(newRow);

  const firstCell = newRow.querySelector('td[contenteditable="true"]');
  if (firstCell) firstCell.focus();
});