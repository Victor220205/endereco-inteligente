const form = document.getElementById('endereco-form');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const numeroInput = document.getElementById('numero');
const ufInput = document.getElementById('uf');

function formatCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);
  return part2 ? `${part1}-${part2}` : part1;
}

cepInput.addEventListener('input', () => {
  cepInput.value = formatCep(cepInput.value);
});

ufInput.addEventListener('input', () => {
  ufInput.value = ufInput.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const cepValue = cepInput.value.trim();
  const logradouroValue = logradouroInput.value.trim();
  const numeroValue = numeroInput.value.trim();
  const ufValue = ufInput.value.trim();

  const cepRegex = /^(\d{5})-(\d{3})$/;
  const ufRegex = /^[A-Z]{2}$/;
  const numeroRegex = /^\d+$/;

  const errors = [];

  if (!cepValue) {
    errors.push('CEP é obrigatório.');
  } else if (!cepRegex.test(cepValue)) {
    errors.push('CEP inválido. Use o formato 00000-000.');
  }

  if (!logradouroValue) {
    errors.push('Logradouro é obrigatório.');
  } else if (logradouroValue.length < 5) {
    errors.push('Logradouro deve conter no mínimo 5 caracteres.');
  }

  if (!numeroValue) {
    errors.push('Número é obrigatório.');
  } else if (!numeroRegex.test(numeroValue)) {
    errors.push('Número deve conter apenas dígitos.');
  }

  if (!ufValue) {
    errors.push('UF é obrigatória.');
  } else if (!ufRegex.test(ufValue)) {
    errors.push('UF inválida. Use duas letras maiúsculas.');
  }

  if (errors.length > 0) {
    errors.forEach((message) => alert(message));
    return;
  }

  alert('Endereço cadastrado com sucesso');
  form.reset();
});
