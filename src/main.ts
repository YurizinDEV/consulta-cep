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
  comboEstados.innerHTML = ''
  body.forEach((estado: { sigla: string; nome: string }) => {
    const option = document.createElement('option')
    option.value = estado.sigla
    option.textContent = estado.nome
    comboEstados.appendChild(option)
  })}

preencherComboEstados().then(() => {
  if (comboEstados.value) {
    comboEstados.dispatchEvent(new Event('change'))
  }
})  

// Preencher o combo de cidades COM BASE NO ESTADO SELECIONADO
comboEstados.addEventListener('change', async () => {
  const estadoSelecionado = comboEstados.value
  const result = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
  const body = await result.json()
  comboCidades.innerHTML = ''
  body.forEach((cidade: { id: number; nome: string }) => {
    const option = document.createElement('option')
    option.value = cidade.id.toString()
    option.textContent = cidade.nome
    comboCidades.appendChild(option)
  })

  if (comboCidades.options.length > 0) {
    comboCidades.selectedIndex = 0
    cidade.value = comboCidades.options[0].textContent || ''
    estado.value = comboEstados.value
  } else {
    cidade.value = ''
    estado.value = ''
  }
})


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
  // const resultUF = await fetch(`https://brasilapi.com.br/api/ibge/v1/uf/${cep.value.slice(0, 2)}`)
  const body = await result.json()
  // const bodyUF = await resultUF.json()
  limparFormulario()
  numero.focus()
  logradouro.value = body.street
  bairro.value = body.neighborhood
  comboEstados.value = body.state
  comboCidades.value = body.city
  estado.value = comboEstados.value
  cidade.value = comboCidades.value
}
