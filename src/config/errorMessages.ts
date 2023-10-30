const errorMessages = {
  pdfUploadFailed: {
    status: 400,
    message: 'O upload falhou: já há um pdf assinado para esse atendimento.'
  },
  pdfDownloadFailed: {
    status: 400,
    message: 'Erro ao tentar baixar pdf: O arquivo não foi encontrado!'
  }
};

export default errorMessages;
