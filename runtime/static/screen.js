// Браузерный код экрана: подтверждение удаления и фильтрация списка на лету.
// Политика содержимого запрещает встроенные скрипты, поэтому файл внешний.

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const message = form.dataset.confirm;
  if (message && !window.confirm(message)) {
    event.preventDefault();
  }
});

const search = document.querySelector('input[name="filter"]');
const list = document.querySelector(".list-select");
if (search && list) {
  search.addEventListener("input", () => {
    const needle = search.value.trim().toLowerCase();
    for (const item of list.querySelectorAll(".order-row")) {
      const text = item.textContent.toLowerCase();
      item.hidden = needle.length > 0 && !text.includes(needle);
    }
  });
}