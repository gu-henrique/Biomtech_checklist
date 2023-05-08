





//-- UPLOAD DE IMAGEM COM PREVIEW --
// Selecionando elementos do DOM
const uploadImg = document.querySelector(".upload-img"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");

// Evento de clique no botão de upload
uploadImg.addEventListener("click", () => {
  fileInput.click();
});

// Evento de alteração no input de arquivo
fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    uploadFile(file);
  }
}

// Função para realizar o upload do arquivo selecionado e  Configurando a requisição para o arquivo PHP que processa o upload
function uploadFile(file) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {

    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";

    // HTML para exibir o progresso do upload na área de progresso
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${file.name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;

    // Adicionando a área de progresso e exibindo o progresso do upload
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    // Quando o upload é finalizado, exibe a mensagem de sucesso na área de arquivos enviados
    if (loaded == total) {
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${file.name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });

  // Enviando o arquivo para o servidor usando o objeto FormData
  let data = new FormData();
  data.append('file', file);
  xhr.send(data);
}



//-- DOWNLOAD DO FORM --

// Botão de download
const downloadBtn = document.querySelector(".download-btn");

// URL do servidor que processa os dados do formulário e gera o PDF
const fileLink = "https://docraptor.com/";

// Função para enviar os dados do formulário e receber o PDF gerado
async function downloadPDF() {
  try {
    // Obtém os dados do formulário
    const form = document.querySelector("form");
    const formData = new FormData(form);

    // Envia os dados do formulário para o servidor e recebe o PDF gerado em resposta
    const response = await fetch(fileLink, {
      method: "POST",
      body: formData,
    });
    const pdfBlob = await response.blob();

    // Cria um link de download para o PDF gerado
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formulario.pdf";

    // Dispara o download e limpa a URL do objeto
    link.click();
    window.URL.revokeObjectURL(url);

    // Atualiza o botão de download para permitir o download novamente
    downloadBtn.classList.replace("timer", "disable-timer");
    downloadBtn.innerHTML = `<i class='bx bxs-download icon'></i>
                              <span class="text">Baixar Formulário em PDF</span>`;
  } catch (error) {
    console.error(error);
  }
}



// Função para inicializar o temporizador do botão de download
function initTimer() {
  if (downloadBtn.classList.contains("disable-timer")) {
    return downloadPDF();
  }
  let timer = downloadBtn.dataset.timer;
  downloadBtn.classList.add("timer");
  downloadBtn.innerHTML = `Seu download começará em <b>${timer}</b> segundos`;
  const initCounter = setInterval(() => {
    if (timer > 0) {
      timer--;
      return (downloadBtn.innerHTML = `Seu download começará em <b>${timer}</b> segundos`);
    }
    clearInterval(initCounter);
    downloadPDF();
    downloadBtn.innerText = "Baixando formulário...";
    setTimeout(() => {
      downloadBtn.classList.replace("timer", "disable-timer");
      downloadBtn.innerHTML = `<i class='bx bxs-download icon'></i>
                                <span class="text">Baixar Formulário em PDF</span>`;
    }, 3000);
  }, 1000);
}

// Evento de clique no botão de download
downloadBtn.addEventListener("click", initTimer);


