import './style.css'

const cep = document.querySelector<HTMLInputElement>('#cep')!
const logradouro = document.querySelector<HTMLInputElement>('#logradouro')!
const numero = document.querySelector<HTMLInputElement>('#numero')!
const bairro = document.querySelector<HTMLInputElement>('#bairro')!
const cidade = document.querySelector<HTMLInputElement>('#cidade')!
const estado = document.querySelector<HTMLInputElement>('#estado')!
const comboEstados = document.querySelector<HTMLSelectElement>('#comboEstados')!
const comboCidades = document.querySelector<HTMLSelectElement>('#comboCidades')!

// Preencher o combo de estados
async function preencherComboEstados() {
  const result = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  const body = await result.json()
  comboEstados.innerHTML = '<option value="">Selecione um estado</option>'
  body.forEach((estado: { sigla: string; nome: string }) => {
    const option = document.createElement('option')
    option.value = estado.sigla
    option.textContent = estado.nome
    comboEstados.appendChild(option)
  })
}


// Função para carregar cidades de um estado
async function carregarCidades(estadoSelecionado: string) {
  const result = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
  const body = await result.json()
  comboCidades.innerHTML = '<option value="">Selecione uma cidade</option>'

  body.forEach((cidade: { id: number; nome: string }) => {
    const option = document.createElement('option')
    option.value = cidade.id.toString()
    option.textContent = cidade.nome
    comboCidades.appendChild(option)
  })
  estado.value = comboEstados.value

  return body
}

// Preencher o combo de cidades COM BASE NO ESTADO SELECIONADO
comboEstados.addEventListener('change', async () => {
  const estadoSelecionado = comboEstados.value
  await carregarCidades(estadoSelecionado)
})

preencherComboEstados()


cep.addEventListener('blur', () => {
  consultarCep()
})

function limparFormulario() {
  // cep.value = ''
  logradouro.value = ''
  numero.value = ''
  bairro.value = ''
  cidade.value = ''
  estado.value = ''
}

async function consultarCep() {
  const result = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep.value}`)

  const body = await result.json()

  limparFormulario()

  logradouro.value = body.street || ''
  bairro.value = body.neighborhood || ''
  comboEstados.value = body.state
  estado.value = body.state

  await carregarCidades(body.state)

  if (body.city) {
    for (let i = 0; i < comboCidades.options.length; i++) {
      const optionText = comboCidades.options[i].textContent || ''

      if (optionText === body.city ||
        optionText.includes(body.city) ||
        body.city.includes(optionText)) {
        comboCidades.selectedIndex = i
        cidade.value = optionText
        break
      }
    }
  }

  numero.focus()
}
