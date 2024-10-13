const OPTIONS = {
    method: 'GET',
    params: {
      risk: 'true',
      hostname: 'false'
    },
    headers: {
      'x-rapidapi-key': 'a0fea9b22dmsh277abc9d3047a91p19c075jsne40be0905ee1',
      'x-rapidapi-host': 'ip-directory.p.rapidapi.com'
    }

}

const fetchIpInfo = async ip => {
    try {
        const res = await fetch(`https://ip-directory.p.rapidapi.com/lookup/${ip}`, OPTIONS)
        return await res.json()
    } catch (err) {
        console.error("Error:", err)
        $results.innerHTML = `Error: No se pudo obtener información de la IP. Verifica la consola para más detalles.`;
    }    
  }

const $ = selector => document.querySelector(selector)

const $form = $('#form')
const $input = $('#input')
const $submit = $('#submit')
const $results = $('#results')

$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    
    const { value } = $input
    if (!value) return

    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')

    try {
        const ipInfo = await fetchIpInfo(value)

        if (ipInfo) {
            $results.textContent = JSON.stringify(ipInfo, null, 2)
        } else {
            $results.textContent = 'No se pudo obtener información sobre la IP.'
        }
    } catch (err) {
        $results.textContent = 'Hubo un error al buscar la información de la IP.'
    }

    $submit.removeAttribute('disabled')
    $submit.removeAttribute('aria-busy')
})
