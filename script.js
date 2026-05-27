const form = document.getElementById('endereco-form');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const cidadeInput = document.getElementById('cidade');
const numeroInput = document.getElementById('numero');
const ufInput = document.getElementById('uf');
const messagesContainer = document.getElementById('messages');

function clearMessages() {
  messagesContainer.innerHTML = '';
}

function showMessage(text, type = 'error') {
  const message = document.createElement('div');
  message.className = `message message-${type}`;
  message.textContent = text;
  messagesContainer.appendChild(message);
}

function showErrors(errors) {
  clearMessages();
  errors.forEach((message) => showMessage(message, 'error'));
}

function formatCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);
  return part2 ? `${part1}-${part2}` : part1;
}

function resetAddressFields() {
  logradouroInput.value = '';
  cidadeInput.value = '';
  ufInput.value = '';
}

function setAddressFields(data) {
  if (data.logradouro) {
    logradouroInput.value = data.logradouro;
  }
  if (data.localidade) {
    cidadeInput.value = data.localidade;
  }
  if (data.uf) {
    ufInput.value = data.uf.toUpperCase();
  }
}

async function lookupCep(value) {
  const cep = value.replace(/\D/g, '');
  if (cep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error('network');
    }

    const data = await response.json();
    if (data.erro) {
      resetAddressFields();
      showMessage('CEP não encontrado. Informe um CEP válido.', 'error');
      return false;
    }

    setAddressFields(data);
    clearMessages();
    return true;
  } catch (error) {
    resetAddressFields();
    showMessage('Não foi possível consultar o CEP. Verifique sua conexão.', 'error');
    return false;
  }
}

cepInput.addEventListener('input', async () => {
  const formatted = formatCep(cepInput.value);
  if (formatted !== cepInput.value) {
    cepInput.value = formatted;
  }

  const numericCep = cepInput.value.replace(/\D/g, '');
  if (numericCep.length === 8) {
    await lookupCep(cepInput.value);
  }
});

numeroInput.addEventListener('input', () => {
  numeroInput.value = numeroInput.value.replace(/\D/g, '');
});

ufInput.addEventListener('input', () => {
  ufInput.value = ufInput.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessages();

  const cepValue = cepInput.value.trim();
  const logradouroValue = logradouroInput.value.trim();
  const cidadeValue = cidadeInput.value.trim();
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

  if (!cidadeValue) {
    errors.push('Cidade é obrigatória.');
  } else if (cidadeValue.length < 3) {
    errors.push('Cidade deve conter no mínimo 3 caracteres.');
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
    showErrors(errors);
    return;
  }

  const lookupResult = await lookupCep(cepValue);
  if (lookupResult === false) {
    return;
  }

  alert('Endereço cadastrado com sucesso');
  form.reset();
  clearMessages();
});
