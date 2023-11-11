const errorMessages = {
  pdfUploadFailed: {
    status: 400,
    message: 'O upload falhou: já há um pdf assinado para esse atendimento.'
  },
  pdfDownloadFailed: {
    status: 400,
    message: 'Erro ao tentar baixar pdf: O arquivo não foi encontrado!'
  },
  clientFormDataFailed: {
    status: 400,
    message:
      'Erro ao tentar recuperar os dados para popular os dados do formulário de cadastro de cliente.'
  },
  appointmentClientDataFailed: {
    status: 400,
    message:
      'Erro ao tentar recuperar os dados para popular os dados do formulário de cadastro de atendimento.'
  },
  specialistQueryFailed: {
    status: 400,
    message: 'Erro ao tentar pesquisar especialistas.'
  },
  avatarUploadFailed: {
    status: 400,
    message: 'O upload falhou: já há um avatar para esse usuário.'
  }
};

export default errorMessages;
